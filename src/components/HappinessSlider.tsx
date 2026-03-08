import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import * as happinessRepo from '@/src/db/repositories/happinessRepository';
import { MoodIcons } from '@/src/constants/icons';

const SCALE = [
  { score: 1, label: 'Tough' },
  { score: 2, label: 'Hard' },
  { score: 3, label: 'Okay' },
  { score: 4, label: 'Good' },
  { score: 5, label: 'Great' },
];

interface HappinessSliderProps {
  babyId: string | undefined;
  date: string;
  babyName?: string;
}

export function HappinessSlider({ babyId, date, babyName }: HappinessSliderProps) {
  const { ollie } = useAppTheme();
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!babyId) return;
    happinessRepo.getHappinessForDate(babyId, date).then((record) => {
      if (record) setSelected(record.score);
    }).catch(() => {});
  }, [babyId, date]);

  const handleSelect = async (score: number) => {
    if (!babyId) return;
    setSelected(score);
    try {
      await happinessRepo.upsertHappiness({ babyId, date, score });
    } catch (e) {
      console.error('Happiness save error:', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
      <Text style={[styles.title, { color: ollie.textPrimary }]}>How's {babyName ? `${babyName}'s` : 'your'} day?</Text>
      <View style={styles.row}>
        {SCALE.map((item) => {
          const isSelected = selected === item.score;
          const MoodIcon = MoodIcons[item.score - 1];
          return (
            <Pressable
              key={item.score}
              style={[
                styles.item,
                isSelected && { backgroundColor: ollie.accentLight, borderRadius: ollie.radiusSm },
              ]}
              onPress={() => handleSelect(item.score)}
            >
              <View style={[styles.moodIcon, !isSelected && styles.dimmed]}>
                <MoodIcon width={36} height={36} />
              </View>
              <Text style={[styles.label, { color: isSelected ? ollie.accent : ollie.textLight }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  moodIcon: {
    marginBottom: 4,
  },
  dimmed: {
    opacity: 0.4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
  },
});

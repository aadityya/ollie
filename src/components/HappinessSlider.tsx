import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import * as happinessRepo from '@/src/db/repositories/happinessRepository';

const SCALE = [
  { score: 1, emoji: '😢', label: 'Tough' },
  { score: 2, emoji: '😟', label: 'Hard' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
];

interface HappinessSliderProps {
  babyId: string | undefined;
  date: string;
}

export function HappinessSlider({ babyId, date }: HappinessSliderProps) {
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
      <Text style={[styles.title, { color: ollie.textPrimary }]}>How's your day?</Text>
      <View style={styles.row}>
        {SCALE.map((item) => {
          const isSelected = selected === item.score;
          return (
            <Pressable
              key={item.score}
              style={[
                styles.item,
                isSelected && { backgroundColor: ollie.accentLight, borderRadius: ollie.radiusSm },
              ]}
              onPress={() => handleSelect(item.score)}
            >
              <Text style={[styles.emoji, !isSelected && styles.dimmed]}>{item.emoji}</Text>
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
  emoji: {
    fontSize: 28,
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

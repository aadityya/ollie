import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import * as happinessRepo from '@/src/db/repositories/happinessRepository';
import { MoodIcons } from '@/src/constants/icons';

const SCALE = [
  { label: 'Hard', score: 2 },
  { label: 'Okay', score: 3 },
  { label: 'Great', score: 5 },
];

interface HappinessSliderProps {
  babyId?: string;
  date: string;
  babyName?: string;
}

export function HappinessSlider({ babyId, date, babyName }: HappinessSliderProps) {
  const { ollie } = useAppTheme();
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!babyId) return;
    happinessRepo.getHappinessForDate(babyId, date).then((rec) => {
      if (rec) {
        const idx = SCALE.findIndex((s) => s.score === rec.score);
        setSelected(idx >= 0 ? idx : null);
      } else {
        setSelected(null);
      }
    });
  }, [babyId, date]);

  const handleSelect = async (idx: number) => {
    if (!babyId) return;
    setSelected(idx);
    await happinessRepo.upsertHappiness({
      babyId,
      date,
      score: SCALE[idx].score,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
      <Text style={[styles.title, { color: ollie.textPrimary }]}>
        Before you go to bed, how was {babyName ? `${babyName}'s` : 'the'} day today?
      </Text>
      <View style={styles.row}>
        {SCALE.map((item, idx) => {
          const isSelected = selected === idx;
          const Icon = MoodIcons[idx];
          return (
            <Pressable
              key={item.label}
              style={[
                styles.item,
                isSelected && { backgroundColor: ollie.accentLight, borderRadius: ollie.radiusSm },
              ]}
              onPress={() => handleSelect(idx)}
            >
              <Icon width={72} height={72} />
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? ollie.accent : ollie.textLight },
                ]}
              >
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
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  item: {
    alignItems: 'center',
    padding: 10,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
});

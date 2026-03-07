import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { isToday } from 'date-fns';
import { formatDateLabel } from '@/src/utils/dateHelpers';

interface DatePickerProps {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function DatePicker({ date, onPrevious, onNext }: DatePickerProps) {
  const { ollie } = useAppTheme();
  const isCurrentDay = isToday(date);

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm, shadowColor: ollie.shadow }]}>
      <Pressable onPress={onPrevious} style={styles.arrow}>
        <Text style={[styles.arrowText, { color: ollie.textLight }]}>‹</Text>
      </Pressable>
      <Text style={[styles.label, { color: ollie.textPrimary }]}>
        {formatDateLabel(date)}
      </Text>
      <Pressable onPress={onNext} style={styles.arrow} disabled={isCurrentDay}>
        <Text style={[styles.arrowText, { color: ollie.textLight, opacity: isCurrentDay ? 0.3 : 1 }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 10,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  arrow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

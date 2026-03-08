import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAppTheme } from '@/src/theme';

interface DateFieldProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

function parseDate(str: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const d = new Date(str + 'T12:00:00');
  return isNaN(d.getTime()) ? null : d;
}

export function DateField({ value, onChange, label, maximumDate, minimumDate }: DateFieldProps) {
  const { ollie } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const dateObj = parseDate(value);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'set' && date) {
      onChange(format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <View>
      {label && <Text style={[styles.label, { color: ollie.textSecondary }]}>{label}</Text>}
      <Pressable
        style={[styles.field, { borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={[styles.text, { color: dateObj ? ollie.textPrimary : ollie.textLight }]}>
          {dateObj ? format(dateObj, 'MMMM d, yyyy') : 'Select date'}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>
      {showPicker && (
        <View style={[styles.pickerWrap, { backgroundColor: ollie.bg, borderColor: ollie.border }]}>
          <DateTimePicker
            value={dateObj ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={handleChange}
            themeVariant="light"
          />
          {Platform.OS === 'ios' && (
            <Pressable
              style={[styles.doneBtn, { backgroundColor: ollie.accent }]}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  icon: {
    fontSize: 16,
  },
  pickerWrap: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  doneBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppTheme } from '@/src/theme';

interface TimeFieldProps {
  value: string; // HH:MM
  onChange: (timeStr: string) => void;
  label?: string;
}

function parseTime(str: string): Date | null {
  const match = str.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const d = new Date();
  d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
  return d;
}

function formatHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDisplay(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function TimeField({ value, onChange, label }: TimeFieldProps) {
  const { ollie } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const timeObj = parseTime(value);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'set' && date) {
      onChange(formatHHMM(date));
    }
  };

  return (
    <View>
      {label && <Text style={[styles.label, { color: ollie.textLight }]}>{label}</Text>}
      <Pressable
        style={[styles.field, { borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={[styles.text, { color: timeObj ? ollie.textPrimary : ollie.textLight }]}>
          {timeObj ? formatDisplay(timeObj) : 'Select time'}
        </Text>
        <Text style={styles.icon}>🕐</Text>
      </Pressable>
      {showPicker && (
        <View style={[styles.pickerWrap, { backgroundColor: ollie.bg, borderColor: ollie.border }]}>
          <DateTimePicker
            value={timeObj ?? new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  icon: {
    fontSize: 14,
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

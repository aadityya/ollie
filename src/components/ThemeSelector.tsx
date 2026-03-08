import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { ThemeName } from '@/src/types';

const THEMES: { name: ThemeName; label: string; color: string }[] = [
  { name: 'pastel', label: 'Pastel', color: '#FDDEDE' },
  { name: 'earthy', label: 'Earthy', color: '#F5E6D3' },
  { name: 'minimal', label: 'Minimal', color: '#F0EEEB' },
  { name: 'ocean', label: 'Ocean', color: '#D0E8F8' },
  { name: 'lavender', label: 'Lavender', color: '#E8D5F8' },
  { name: 'dark', label: 'Dark', color: '#25253E' },
  { name: 'midnight', label: 'Night', color: '#1B2838' },
  { name: 'monochrome', label: 'Mono', color: '#CCCCCC' },
];

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onSelect: (theme: ThemeName) => void;
}

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  const { ollie } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard }]}>
      {THEMES.map((t) => (
        <Pressable
          key={t.name}
          onPress={() => onSelect(t.name)}
          style={styles.item}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor: t.color,
                borderColor: currentTheme === t.name ? ollie.accent : ollie.border,
                borderWidth: currentTheme === t.name ? 3 : 2,
              },
            ]}
          />
          <Text
            style={[
              styles.label,
              { color: currentTheme === t.name ? ollie.textPrimary : ollie.textLight },
            ]}
          >
            {t.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
  },
});

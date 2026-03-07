import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppTheme } from '@/src/theme';
import { ThemeName } from '@/src/types';

const THEME_COLORS: Record<ThemeName, string> = {
  pastel: '#FDDEDE',
  earthy: '#F5E6D3',
  minimal: '#F0EEEB',
};

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onSelect: (theme: ThemeName) => void;
}

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  const { ollie } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard }]}>
      {(Object.keys(THEME_COLORS) as ThemeName[]).map((theme) => (
        <Pressable
          key={theme}
          onPress={() => onSelect(theme)}
          style={[
            styles.dot,
            {
              backgroundColor: THEME_COLORS[theme],
              borderColor: currentTheme === theme ? ollie.accent : ollie.border,
              borderWidth: currentTheme === theme ? 3 : 2,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

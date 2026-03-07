import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  activeColor?: string;
  activeTextColor?: string;
}

export function SegmentedControl({
  options,
  selectedValue,
  onChange,
  activeColor,
  activeTextColor,
}: SegmentedControlProps) {
  const { ollie } = useAppTheme();
  const activeBg = activeColor ?? ollie.accentLight;
  const activeText = activeTextColor ?? ollie.accent;

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = opt.value === selectedValue;
        return (
          <Pressable
            key={opt.value}
            style={[
              styles.option,
              {
                backgroundColor: isActive ? activeBg : ollie.bgSecondary,
                borderRadius: ollie.radiusSm,
              },
            ]}
            onPress={() => onChange(opt.value)}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? activeText : ollie.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
});

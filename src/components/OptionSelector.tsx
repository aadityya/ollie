import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';

interface Option {
  value: string;
  label: string;
  color?: string;
  bgColor?: string;
}

interface OptionSelectorProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}

export function OptionSelector({ options, selected, onChange }: OptionSelectorProps) {
  const { ollie } = useAppTheme();

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            style={[
              styles.option,
              {
                backgroundColor: isActive
                  ? (opt.bgColor ?? ollie.accentLight)
                  : ollie.bgSecondary,
                borderRadius: ollie.radiusSm,
              },
            ]}
            onPress={() => onChange(opt.value)}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? (opt.color ?? ollie.accent)
                    : ollie.textSecondary,
                },
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
    gap: 6,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
});

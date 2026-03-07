import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';

interface SettingsItemProps {
  icon: string;
  label: string;
  type?: 'arrow' | 'toggle';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
  isOnly?: boolean;
}

export function SettingsItem({
  icon,
  label,
  type = 'arrow',
  value,
  onPress,
  onToggle,
  isFirst,
  isLast,
  isOnly,
}: SettingsItemProps) {
  const { ollie } = useAppTheme();

  const borderRadiusStyle = isOnly
    ? { borderRadius: ollie.radiusSm }
    : isFirst
      ? { borderTopLeftRadius: ollie.radiusSm, borderTopRightRadius: ollie.radiusSm }
      : isLast
        ? { borderBottomLeftRadius: ollie.radiusSm, borderBottomRightRadius: ollie.radiusSm }
        : {};

  return (
    <Pressable
      onPress={type === 'arrow' ? onPress : undefined}
      style={[
        styles.container,
        { backgroundColor: ollie.bgCard },
        borderRadiusStyle,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text
        style={[styles.label, { color: ollie.textPrimary, fontFamily: 'Nunito_600SemiBold' }]}
      >
        {label}
      </Text>
      {type === 'arrow' && (
        <Text style={[styles.arrow, { color: ollie.textLight }]}>›</Text>
      )}
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          color={ollie.accent}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 1,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
  arrow: {
    fontSize: 18,
  },
});

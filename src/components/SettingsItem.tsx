import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { IconComponent } from '@/src/constants/icons';

interface SettingsItemProps {
  icon: string | IconComponent;
  label: string;
  type?: 'arrow' | 'toggle';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
  isOnly?: boolean;
  iconScale?: number;
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
  iconScale = 1,
}: SettingsItemProps) {
  const { ollie } = useAppTheme();

  const borderRadiusStyle = isOnly
    ? { borderRadius: ollie.radiusSm }
    : isFirst
      ? { borderTopLeftRadius: ollie.radiusSm, borderTopRightRadius: ollie.radiusSm }
      : isLast
        ? { borderBottomLeftRadius: ollie.radiusSm, borderBottomRightRadius: ollie.radiusSm }
        : {};

  const emojiSize = 22 * iconScale;
  const svgSize = 36 * iconScale;
  const iconBoxSize = svgSize;

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <Text style={[styles.iconEmoji, { fontSize: emojiSize }]}>{icon}</Text>;
    }
    const Icon = icon;
    return (
      <View style={[styles.iconContainer, { width: iconBoxSize, height: iconBoxSize }]}>
        <Icon width={svgSize} height={svgSize} />
      </View>
    );
  };

  return (
    <Pressable
      onPress={type === 'arrow' ? onPress : undefined}
      style={[
        styles.container,
        { backgroundColor: ollie.bgCard },
        borderRadiusStyle,
        iconScale > 1 && { paddingVertical: 4, paddingHorizontal: 8, gap: 8 },
      ]}
    >
      {renderIcon()}
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
  iconEmoji: {
    fontSize: 22,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
  arrow: {
    fontSize: 18,
  },
});

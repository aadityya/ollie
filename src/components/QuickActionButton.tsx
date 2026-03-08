import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { IconComponent } from '@/src/constants/icons';

interface QuickActionButtonProps {
  icon: IconComponent;
  label: string;
  bgColor: string;
  textColor: string;
  onPress: () => void;
}

export function QuickActionButton({ icon: Icon, label, bgColor, textColor, onPress }: QuickActionButtonProps) {
  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Icon width={48} height={48} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
    minWidth: 64,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
});

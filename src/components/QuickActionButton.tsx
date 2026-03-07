import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  bgColor: string;
  textColor: string;
  onPress: () => void;
}

export function QuickActionButton({ icon, label, bgColor, textColor, onPress }: QuickActionButtonProps) {
  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
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
  icon: {
    fontSize: 26,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
});

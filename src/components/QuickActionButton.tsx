import React from 'react';
import { StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { Text } from 'react-native-paper';

interface QuickActionButtonProps {
  icon: ImageSourcePropType;
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
      <Image source={icon} style={styles.icon} resizeMode="contain" />
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
    width: 36,
    height: 36,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
});

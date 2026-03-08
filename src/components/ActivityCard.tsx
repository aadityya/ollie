import React from 'react';
import { StyleSheet, Pressable, View, Image, ImageSourcePropType } from 'react-native';
import { Text } from 'react-native-paper';

interface ActivityCardProps {
  icon: ImageSourcePropType;
  label: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  onPress: () => void;
  fullWidth?: boolean;
}

export function ActivityCard({ icon, label, subtitle, bgColor, textColor, onPress, fullWidth }: ActivityCardProps) {
  if (fullWidth) {
    return (
      <Pressable
        style={[styles.containerFull, { backgroundColor: bgColor }]}
        onPress={onPress}
      >
        <Image source={icon} style={styles.iconFull} resizeMode="contain" />
        <View>
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{subtitle}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  containerFull: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  icon: {
    width: 56,
    height: 56,
  },
  iconFull: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 11,
  },
});

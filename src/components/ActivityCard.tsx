import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ActivityCardProps {
  icon: string;
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
        <Text style={styles.iconFull}>{icon}</Text>
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
      <Text style={styles.icon}>{icon}</Text>
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
    fontSize: 40,
  },
  iconFull: {
    fontSize: 32,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 11,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface SummaryCardProps {
  icon: string;
  value: string;
  label: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
}

export function SummaryCard({ icon, value, label, subtitle, backgroundColor, textColor }: SummaryCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color: '#000' }]}>{value}</Text>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  icon: {
    fontSize: 24,
  },
  value: {
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  subtitle: {
    fontSize: 11,
  },
});

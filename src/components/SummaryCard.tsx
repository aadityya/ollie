import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { IconComponent } from '@/src/constants/icons';

interface SummaryCardProps {
  icon: IconComponent;
  value: string;
  label: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
}

export function SummaryCard({ icon: Icon, value, label, subtitle, backgroundColor, textColor }: SummaryCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon width={108} height={108} />
      <Text style={[styles.value, { color: '#000' }]}>{value}</Text>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 8,
    gap: 2,
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Nunito_800ExtraBold',
  },
  label: {
    fontSize: 9,
    fontFamily: 'Nunito_600SemiBold',
  },
  subtitle: {
    fontSize: 8,
  },
});

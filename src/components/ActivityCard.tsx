import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { IconComponent } from '@/src/constants/icons';

interface ActivityCardProps {
  icon: IconComponent;
  label: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  onPress: () => void;
  fullWidth?: boolean;
  count?: number | string;
}

export function ActivityCard({ icon: Icon, label, subtitle, bgColor, textColor, onPress, fullWidth, count }: ActivityCardProps) {
  const badge = count !== undefined && count !== 0 ? (
    <View style={[styles.badge, { backgroundColor: textColor }]}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  ) : null;

  if (fullWidth) {
    return (
      <Pressable
        style={[styles.containerFull, { backgroundColor: bgColor }]}
        onPress={onPress}
      >
        <Icon width={112} height={112} />
        <View style={styles.fullContent}>
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{subtitle}</Text>
        </View>
        {badge}
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      {badge}
      <Icon width={157} height={157} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
    gap: 7,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  containerFull: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  fullContent: { flex: 1 },
  label: {
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
});

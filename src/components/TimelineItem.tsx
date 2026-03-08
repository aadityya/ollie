import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { Activity } from '@/src/types';
import { activityMeta, getActivityTitle, getActivityDetail } from '@/src/utils/activityHelpers';
import { formatTime } from '@/src/utils/dateHelpers';

interface TimelineItemProps {
  activity: Activity;
}

export function TimelineItem({ activity }: TimelineItemProps) {
  const { ollie } = useAppTheme();
  const meta = activityMeta[activity.type];
  const colors = meta.getColors(ollie);

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm, shadowColor: ollie.shadow }]}>
      <View style={[styles.icon, { backgroundColor: colors.bg, borderRadius: 12 }]}>
        <Image source={meta.icon} style={styles.iconImg} resizeMode="contain" />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: ollie.textPrimary }]}>
          {getActivityTitle(activity)}
        </Text>
        <Text style={[styles.detail, { color: ollie.textSecondary }]} numberOfLines={1}>
          {getActivityDetail(activity)}
        </Text>
      </View>
      <Text style={[styles.time, { color: ollie.textLight }]}>
        {formatTime(activity.startedAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 28,
    height: 28,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  detail: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
});

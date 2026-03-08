import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { Activity } from '@/src/types';
import { getMetaForType, getActivityTitle, getActivityDetail } from '@/src/utils/activityHelpers';
import { formatTime } from '@/src/utils/dateHelpers';

interface TimelineItemProps {
  activity: Activity;
  onDelete?: () => void;
}

export function TimelineItem({ activity, onDelete }: TimelineItemProps) {
  const { ollie } = useAppTheme();
  const meta = getMetaForType(activity.type);
  const colors = meta.getColors(ollie);
  const Icon = meta.icon;

  const handleDelete = () => {
    Alert.alert('Delete Activity', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm, shadowColor: ollie.shadow }]}>
      <View style={[styles.icon, { backgroundColor: colors.bg, borderRadius: 12 }]}>
        <Icon width={40} height={40} />
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
      {onDelete && (
        <Pressable onPress={handleDelete} hitSlop={8}>
          <Text style={[styles.deleteBtn, { color: ollie.textLight }]}>×</Text>
        </Pressable>
      )}
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  deleteBtn: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 4,
  },
});

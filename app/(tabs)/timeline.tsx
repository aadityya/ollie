import React, { useCallback, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { DatePicker } from '@/src/components/DatePicker';
import { TimelineItem } from '@/src/components/TimelineItem';
import { EmptyState } from '@/src/components/EmptyState';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useTimelineStore } from '@/src/stores/useTimelineStore';
import { useActivityStore } from '@/src/stores/useActivityStore';
import { getTimeOfDayGroup, getTimeOfDayLabel } from '@/src/utils/dateHelpers';
import { Activity } from '@/src/types';

function groupByTimeOfDay(activities: Activity[]): Record<string, Activity[]> {
  const groups: Record<string, Activity[]> = {};
  for (const activity of activities) {
    const group = getTimeOfDayGroup(activity.startedAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(activity);
  }
  return groups;
}

const TIME_ORDER = ['morning', 'afternoon', 'evening', 'night'];

export default function TimelineScreen() {
  const { ollie } = useAppTheme();
  const babyId = useBabyStore((s) => s.activeBaby?.id);
  const babyName = useBabyStore((s) => s.activeBaby?.name ?? 'your baby');
  const { selectedDate, activities, isLoading, goToPreviousDay, goToNextDay, loadActivities } =
    useTimelineStore();
  const deleteActivity = useActivityStore((s) => s.deleteActivity);

  useFocusEffect(
    useCallback(() => {
      if (babyId) loadActivities(babyId);
    }, [babyId, selectedDate, loadActivities])
  );

  const grouped = useMemo(() => groupByTimeOfDay(activities), [activities]);

  const sortedGroups = useMemo(
    () => TIME_ORDER.filter((g) => grouped[g]?.length),
    [grouped]
  );

  const handleDelete = async (activityId: string) => {
    await deleteActivity(activityId);
    if (babyId) loadActivities(babyId);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Timeline" subtitle={`${babyName}'s day at a glance`} />

        <DatePicker
          date={selectedDate}
          onPrevious={goToPreviousDay}
          onNext={goToNextDay}
        />

        {isLoading ? (
          <EmptyState icon="..." title="Loading..." />
        ) : activities.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No activities recorded"
            subtitle="Log an activity to see it here"
          />
        ) : (
          sortedGroups.map((group) => (
            <View key={group} style={styles.group}>
              <Text style={[styles.groupLabel, { color: ollie.textSecondary }]}>
                {getTimeOfDayLabel(group)}
              </Text>
              {grouped[group].map((activity) => (
                <TimelineItem
                  key={activity.id}
                  activity={activity}
                  onDelete={() => handleDelete(activity.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  group: { marginBottom: 20 },
  groupLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 10,
  },
});

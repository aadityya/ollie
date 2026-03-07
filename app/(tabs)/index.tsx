import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SummaryCard } from '@/src/components/SummaryCard';
import { QuickActionButton } from '@/src/components/QuickActionButton';
import { TimelineItem } from '@/src/components/TimelineItem';
import { EmptyState } from '@/src/components/EmptyState';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useTodaySummary } from '@/src/hooks/useTodaySummary';
import { getGreeting, calculateAge, formatTimeAgo } from '@/src/utils/dateHelpers';
import { activityMeta } from '@/src/utils/activityHelpers';
import { formatDuration } from '@/src/utils/dateHelpers';
import { ActivityType } from '@/src/types';

export default function HomeScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const babyName = baby?.name ?? 'your baby';
  const age = baby?.dateOfBirth ? calculateAge(baby.dateOfBirth) : '';

  const { summary, refresh } = useTodaySummary(baby?.id ?? null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const quickActions: ActivityType[] = ['feed', 'sleep', 'pee', 'poop', 'colic'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={`${getGreeting()} ${babyName}`}
          subtitle={age}
        />

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon="🍼"
                value={String(summary.feedCount)}
                label="Feedings"
                subtitle="today"
                backgroundColor={ollie.feed.bg}
                textColor={ollie.feed.color}
              />
            </View>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon="😴"
                value={summary.sleepMinutes > 0 ? formatDuration(summary.sleepMinutes * 60) : '0m'}
                label="Sleep"
                subtitle="today"
                backgroundColor={ollie.sleep.bg}
                textColor={ollie.sleep.color}
              />
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon="💧"
                value={String(summary.peeCount)}
                label="Wet Diapers"
                subtitle="today"
                backgroundColor={ollie.pee.bg}
                textColor={ollie.pee.color}
              />
            </View>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon="💩"
                value={String(summary.poopCount)}
                label="Dirty Diapers"
                subtitle="today"
                backgroundColor={ollie.poop.bg}
                textColor={ollie.poop.color}
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: ollie.textPrimary }]}>Quick Log</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActions}
        >
          {quickActions.map((type) => {
            const meta = activityMeta[type];
            const c = meta.getColors(ollie);
            return (
              <QuickActionButton
                key={type}
                icon={meta.icon}
                label={meta.label}
                bgColor={c.bg}
                textColor={c.color}
                onPress={() => router.push(`/log/${type}`)}
              />
            );
          })}
        </ScrollView>

        {/* Last Activity */}
        <Text style={[styles.sectionTitle, { color: ollie.textPrimary, marginTop: 24 }]}>
          Last Activity
        </Text>
        {summary.lastActivity ? (
          <View>
            <TimelineItem activity={summary.lastActivity} />
            <Text style={[styles.timeAgo, { color: ollie.textLight }]}>
              {formatTimeAgo(summary.lastActivity.startedAt)}
            </Text>
          </View>
        ) : (
          <EmptyState
            icon="🌟"
            title="No activities yet today"
            subtitle="Tap Quick Log above to start tracking"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  summaryGrid: { gap: 12, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCell: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  quickActions: {
    gap: 10,
    paddingRight: 20,
  },
  timeAgo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

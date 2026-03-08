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
import { HappinessSlider } from '@/src/components/HappinessSlider';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useTodaySummary } from '@/src/hooks/useTodaySummary';
import { getGreeting, calculateAge, formatTimeAgo, todayDateStr } from '@/src/utils/dateHelpers';
import { activityMeta } from '@/src/utils/activityHelpers';
import { formatDuration } from '@/src/utils/dateHelpers';
import { getDailyPhrase } from '@/src/constants/motivationalPhrases';
import { ActivityType } from '@/src/types';
import { AppIcons } from '@/src/constants/icons';
import { APP_VERSION } from '@/src/constants/version';

export default function HomeScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const userName = useSettingsStore((s) => s.userName);
  const babyName = baby?.name ?? 'your baby';
  const age = baby?.dateOfBirth ? calculateAge(baby.dateOfBirth) : '';

  const { summary, refresh } = useTodaySummary(baby?.id ?? null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const quickActions: ActivityType[] = ['feed', 'sleep', 'pee', 'poop', 'colic', 'tummy_time', 'sun_time'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={`${getGreeting()} ${userName}!`}
          subtitle={`${babyName} is ${age}`}
          rightElement={<Text style={[styles.versionBadge, { color: ollie.textLight }]}>v{APP_VERSION}</Text>}
        />

        <Text style={[styles.motivational, { color: ollie.textLight }]}>
          {getDailyPhrase()}
        </Text>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon={AppIcons.feed}
                value={String(summary.feedCount)}
                label="Feedings"
                subtitle="today"
                backgroundColor={ollie.feed.bg}
                textColor={ollie.feed.color}
              />
            </View>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon={AppIcons.sleep}
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
                icon={AppIcons.pee}
                value={String(summary.peeCount)}
                label="Wet Diapers"
                subtitle="today"
                backgroundColor={ollie.pee.bg}
                textColor={ollie.pee.color}
              />
            </View>
            <View style={styles.summaryCell}>
              <SummaryCard
                icon={AppIcons.poop}
                value={String(summary.poopCount)}
                label="Dirty Diapers"
                subtitle="today"
                backgroundColor={ollie.poop.bg}
                textColor={ollie.poop.color}
              />
            </View>
          </View>
        </View>

        {/* Happiness */}
        <HappinessSlider babyId={baby?.id} date={todayDateStr()} />

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
  motivational: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -4,
  },
  summaryGrid: { gap: 12, marginBottom: 20 },
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
  versionBadge: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});

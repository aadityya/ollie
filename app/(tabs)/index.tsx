import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SummaryCard } from '@/src/components/SummaryCard';
import { ActivityCard } from '@/src/components/ActivityCard';
import { TimelineItem } from '@/src/components/TimelineItem';
import { EmptyState } from '@/src/components/EmptyState';
import { HappinessSlider } from '@/src/components/HappinessSlider';
import { BabySwitcher } from '@/src/components/BabySwitcher';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useTodaySummary } from '@/src/hooks/useTodaySummary';
import { getGreeting, calculateAge, formatTimeAgo, todayDateStr } from '@/src/utils/dateHelpers';
import { activityMeta, getMetaForType } from '@/src/utils/activityHelpers';
import { formatDuration } from '@/src/utils/dateHelpers';
import { getDailyPhrase } from '@/src/constants/motivationalPhrases';
import { ActivityType } from '@/src/types';
import { AppIcons } from '@/src/constants/icons';

export default function HomeScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const userName = useSettingsStore((s) => s.userName);
  const customActivityTypes = useSettingsStore((s) => s.customActivityTypes);
  const babyName = baby?.name ?? 'your baby';
  const age = baby?.dateOfBirth ? calculateAge(baby.dateOfBirth) : '';

  const { summary, refresh } = useTodaySummary(baby?.id ?? null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const getCount = (type: string): number | string => {
    switch (type) {
      case 'feed': return summary.feedCount;
      case 'pee': return summary.peeCount;
      case 'poop': return summary.poopCount;
      case 'sleep': return summary.sleepMinutes > 0 ? formatDuration(summary.sleepMinutes * 60) : 0;
      case 'colic': return summary.colicCount;
      case 'tummy_time': return summary.tummyTimeMinutes > 0 ? formatDuration(summary.tummyTimeMinutes * 60) : 0;
      case 'sun_time': return summary.sunTimeMinutes > 0 ? formatDuration(summary.sunTimeMinutes * 60) : 0;
      default: return 0;
    }
  };

  const gridItems: ActivityType[] = ['feed', 'sleep', 'pee', 'poop'];
  const extraItems: ActivityType[] = ['tummy_time', 'sun_time'];

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
          rightElement={<BabySwitcher compact />}
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
        <HappinessSlider babyId={baby?.id} date={todayDateStr()} babyName={baby?.name} />

        {/* Log Activity */}
        <Text style={[styles.sectionTitle, { color: ollie.textPrimary }]}>Log Activity</Text>
        <View style={styles.grid}>
          {gridItems.map((type) => {
            const meta = activityMeta[type];
            const colors = meta.getColors(ollie);
            return (
              <View key={type} style={styles.gridCell}>
                <ActivityCard
                  icon={meta.icon}
                  label={meta.label}
                  subtitle={meta.subtitle}
                  bgColor={colors.bg}
                  textColor={colors.color}
                  onPress={() => router.push(`/log/${type}`)}
                  count={getCount(type)}
                />
              </View>
            );
          })}
        </View>

        {/* Colic full-width */}
        <ActivityCard
          icon={activityMeta.colic.icon}
          label={activityMeta.colic.label}
          subtitle={activityMeta.colic.subtitle}
          bgColor={activityMeta.colic.getColors(ollie).bg}
          textColor={activityMeta.colic.getColors(ollie).color}
          onPress={() => router.push('/log/colic')}
          fullWidth
          count={getCount('colic')}
        />

        {/* Tummy Time & Sun Time */}
        <View style={styles.extraGrid}>
          {extraItems.map((type) => {
            const meta = activityMeta[type];
            const colors = meta.getColors(ollie);
            return (
              <View key={type} style={styles.gridCell}>
                <ActivityCard
                  icon={meta.icon}
                  label={meta.label}
                  subtitle={meta.subtitle}
                  bgColor={colors.bg}
                  textColor={colors.color}
                  onPress={() => router.push(`/log/${type}`)}
                  count={getCount(type)}
                />
              </View>
            );
          })}
        </View>

        {/* Custom Activity Types */}
        {customActivityTypes.length > 0 && (
          <>
            <Text style={[styles.customTitle, { color: ollie.textLight }]}>CUSTOM</Text>
            <View style={styles.grid}>
              {customActivityTypes.map((type) => {
                const meta = getMetaForType(type);
                const colors = meta.getColors(ollie);
                return (
                  <View key={type} style={styles.gridCell}>
                    <ActivityCard
                      icon={meta.icon}
                      label={meta.label}
                      subtitle={meta.subtitle}
                      bgColor={colors.bg}
                      textColor={colors.color}
                      onPress={() => router.push(`/log/${type}`)}
                    />
                  </View>
                );
              })}
            </View>
          </>
        )}

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
            subtitle="Tap an activity above to start tracking"
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 14,
  },
  extraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 14,
    marginBottom: 14,
  },
  gridCell: {
    width: '47%',
    flexGrow: 1,
  },
  customTitle: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  timeAgo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

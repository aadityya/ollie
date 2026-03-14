import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ActivityCard } from '@/src/components/ActivityCard';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useTodaySummary } from '@/src/hooks/useTodaySummary';
import { activityMeta } from '@/src/utils/activityHelpers';
import { ActivityType } from '@/src/types';
import { formatDuration } from '@/src/utils/dateHelpers';

export default function LogScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const babyName = baby?.name ?? 'your baby';

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
        <ScreenHeader title="Log Activity" subtitle={`What's happening with ${babyName}?`} />

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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16 },
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
});

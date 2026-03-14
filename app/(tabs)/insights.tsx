import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { BabySwitcher } from '@/src/components/BabySwitcher';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useInsightsData, InsightRange } from '@/src/hooks/useInsightsData';

const RANGE_LABELS: Record<InsightRange, string> = {
  day: 'Today',
  week: 'Week',
  month: 'Month',
};

export default function InsightsScreen() {
  const { ollie } = useAppTheme();
  const baby = useBabyStore((s) => s.activeBaby);
  const [range, setRange] = useState<InsightRange>('week');

  const { data, refresh } = useInsightsData(baby?.id ?? null, range);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const barWidth = range === 'day' ? 60 : range === 'week' ? 24 : 40;
  const spacing = range === 'day' ? 20 : range === 'week' ? 14 : 16;

  const feedData = data.map((d) => ({
    value: d.feedCount,
    label: d.label,
    frontColor: ollie.feed.color,
    gradientColor: ollie.feed.bg,
    showGradient: true,
  }));

  const diaperData = data.map((d) => ({
    value: d.peeCount + d.poopCount,
    label: d.label,
    frontColor: ollie.pee.color,
    gradientColor: ollie.pee.bg,
    showGradient: true,
  }));

  const sleepData = data.map((d) => ({
    value: Math.round(d.sleepMinutes / 60 * 10) / 10,
    label: d.label,
    frontColor: ollie.sleep.color,
    gradientColor: ollie.sleep.bg,
    showGradient: true,
  }));

  const happinessData = data.map((d) => ({
    value: d.happinessScore ?? 0,
    label: d.label,
    frontColor: d.happinessScore ? ollie.accent : 'transparent',
    gradientColor: ollie.accentLight,
    showGradient: !!d.happinessScore,
  }));

  const maxFeed = Math.max(...feedData.map((d) => d.value), 1);
  const maxDiaper = Math.max(...diaperData.map((d) => d.value), 1);
  const maxSleep = Math.max(...sleepData.map((d) => d.value), 1);

  const chartProps = {
    barWidth,
    spacing,
    roundedTop: true as const,
    roundedBottom: true as const,
    yAxisThickness: 0,
    xAxisThickness: 0,
    xAxisLabelTextStyle: { color: ollie.textLight, fontSize: 11, fontFamily: 'Nunito_600SemiBold' },
    yAxisTextStyle: { color: ollie.textLight, fontSize: 11 },
    hideRules: true,
    barBorderRadius: 6,
    isAnimated: true,
    height: 120,
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Insights" subtitle={baby?.name ? `${baby.name}'s trends` : 'Activity trends'} />
        <View style={styles.badgeWrap}>
          <BabySwitcher />
        </View>

        {/* Range Selector */}
        <View style={styles.rangeRow}>
          {(['day', 'week', 'month'] as InsightRange[]).map((r) => (
            <Pressable
              key={r}
              style={[
                styles.rangeBtn,
                {
                  backgroundColor: range === r ? ollie.accent : ollie.bgSecondary,
                  borderRadius: ollie.radiusSm,
                },
              ]}
              onPress={() => setRange(r)}
            >
              <Text
                style={[
                  styles.rangeBtnText,
                  { color: range === r ? '#FFFFFF' : ollie.textSecondary },
                ]}
              >
                {RANGE_LABELS[r]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Feedings Chart */}
        <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>Feedings</Text>
          {feedData.length > 0 && (
            <BarChart
              data={feedData}
              {...chartProps}
              noOfSections={Math.min(maxFeed, 4)}
              maxValue={Math.ceil(maxFeed * 1.2) || 1}
            />
          )}
        </View>

        {/* Diapers Chart */}
        <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>Diapers</Text>
          {diaperData.length > 0 && (
            <BarChart
              data={diaperData}
              {...chartProps}
              noOfSections={Math.min(maxDiaper, 4)}
              maxValue={Math.ceil(maxDiaper * 1.2) || 1}
            />
          )}
        </View>

        {/* Sleep Chart */}
        <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>Sleep (hours)</Text>
          {sleepData.length > 0 && (
            <BarChart
              data={sleepData}
              {...chartProps}
              noOfSections={Math.min(Math.ceil(maxSleep), 4)}
              maxValue={Math.ceil(maxSleep * 1.2) || 1}
            />
          )}
        </View>

        {/* Happiness Chart */}
        <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>Happiness</Text>
{happinessData.length > 0 && (
            <BarChart
              data={happinessData}
              {...chartProps}
              noOfSections={3}
              maxValue={5}
              stepValue={2}
              formatYLabel={(val: string) => {
                const n = Number(val);
                if (n <= 2) return 'Hard';
                if (n <= 3) return 'Okay';
                return 'Great';
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  badgeWrap: { marginTop: 4, marginBottom: 16 },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rangeBtnText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  happinessLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});

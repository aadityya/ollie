import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useInsightsData, InsightRange } from '@/src/hooks/useInsightsData';

export default function InsightsScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);
  const [range, setRange] = useState<InsightRange>('week');

  const { data, refresh } = useInsightsData(baby?.id ?? null, range);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const feedData = data.map((d) => ({
    value: d.feedCount,
    label: d.label,
    frontColor: ollie.feed.color,
  }));

  const diaperData = data.map((d) => ({
    value: d.peeCount + d.poopCount,
    label: d.label,
    frontColor: ollie.pee.color,
  }));

  const sleepData = data.map((d) => ({
    value: Math.round(d.sleepMinutes / 60 * 10) / 10,
    label: d.label,
    frontColor: ollie.sleep.color,
  }));

  const maxFeed = Math.max(...feedData.map((d) => d.value), 1);
  const maxDiaper = Math.max(...diaperData.map((d) => d.value), 1);
  const maxSleep = Math.max(...sleepData.map((d) => d.value), 1);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Insights" subtitle={baby?.name ? `${baby.name}'s trends` : 'Activity trends'} />

        {/* Range Selector */}
        <View style={styles.rangeRow}>
          {(['day', 'week'] as InsightRange[]).map((r) => (
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
                {r === 'day' ? 'Today' : 'This Week'}
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
              barWidth={range === 'day' ? 60 : 24}
              spacing={range === 'day' ? 20 : 14}
              roundedTop
              roundedBottom
              noOfSections={Math.min(maxFeed, 4)}
              maxValue={Math.ceil(maxFeed * 1.2) || 1}
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{ color: ollie.textLight, fontSize: 11, fontFamily: 'Nunito_600SemiBold' }}
              yAxisTextStyle={{ color: ollie.textLight, fontSize: 11 }}
              hideRules
              barBorderRadius={6}
              isAnimated
              height={120}
            />
          )}
        </View>

        {/* Diapers Chart */}
        <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>Diapers</Text>
          {diaperData.length > 0 && (
            <BarChart
              data={diaperData}
              barWidth={range === 'day' ? 60 : 24}
              spacing={range === 'day' ? 20 : 14}
              roundedTop
              roundedBottom
              noOfSections={Math.min(maxDiaper, 4)}
              maxValue={Math.ceil(maxDiaper * 1.2) || 1}
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{ color: ollie.textLight, fontSize: 11, fontFamily: 'Nunito_600SemiBold' }}
              yAxisTextStyle={{ color: ollie.textLight, fontSize: 11 }}
              hideRules
              barBorderRadius={6}
              isAnimated
              height={120}
            />
          )}
        </View>

        {/* Sleep Chart */}
        <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>Sleep (hours)</Text>
          {sleepData.length > 0 && (
            <BarChart
              data={sleepData}
              barWidth={range === 'day' ? 60 : 24}
              spacing={range === 'day' ? 20 : 14}
              roundedTop
              roundedBottom
              noOfSections={Math.min(Math.ceil(maxSleep), 4)}
              maxValue={Math.ceil(maxSleep * 1.2) || 1}
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{ color: ollie.textLight, fontSize: 11, fontFamily: 'Nunito_600SemiBold' }}
              yAxisTextStyle={{ color: ollie.textLight, fontSize: 11 }}
              hideRules
              barBorderRadius={6}
              isAnimated
              height={120}
            />
          )}
        </View>

        {/* Measurements Link */}
        <Pressable
          style={[styles.measureBtn, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}
          onPress={() => router.push('/measurements')}
        >
          <Text style={[styles.measureTitle, { color: ollie.textPrimary }]}>Measurements</Text>
          <Text style={[styles.measureSub, { color: ollie.textLight }]}>
            Track weight, height & head circumference
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
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
  measureBtn: {
    padding: 20,
    alignItems: 'center',
  },
  measureTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  measureSub: {
    fontSize: 13,
  },
});

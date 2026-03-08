import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-gifted-charts';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import * as growthRepo from '@/src/db/repositories/growthRepository';
import { GrowthRecord } from '@/src/types';

type MeasureType = 'weight' | 'height' | 'head';

const TABS: { key: MeasureType; label: string; unit: string }[] = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'height', label: 'Height', unit: 'cm' },
  { key: 'head', label: 'Head', unit: 'cm' },
];

export default function MeasurementsScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const baby = useBabyStore((s) => s.activeBaby);

  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [activeTab, setActiveTab] = useState<MeasureType>('weight');
  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!baby?.id) return;
    const data = await growthRepo.getGrowthRecords(baby.id);
    setRecords(data);
  }, [baby?.id]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleSave = async () => {
    if (!baby?.id || !value || saving) return;
    setSaving(true);

    const numVal = parseFloat(value);
    if (isNaN(numVal)) {
      Alert.alert('Invalid', 'Please enter a valid number');
      setSaving(false);
      return;
    }

    try {
      await growthRepo.insertGrowthRecord({
        babyId: baby.id,
        recordedAt: date,
        weightKg: activeTab === 'weight' ? numVal : undefined,
        heightCm: activeTab === 'height' ? numVal : undefined,
        headCircumferenceCm: activeTab === 'head' ? numVal : undefined,
      });
      setValue('');
      setShowForm(false);
      await loadRecords();
    } catch (e) {
      Alert.alert('Error', 'Failed to save measurement');
    }
    setSaving(false);
  };

  const getChartData = () => {
    const sorted = [...records].reverse();
    return sorted
      .map((r) => {
        let val = 0;
        if (activeTab === 'weight' && r.weightKg) val = r.weightKg;
        else if (activeTab === 'height' && r.heightCm) val = r.heightCm;
        else if (activeTab === 'head' && r.headCircumferenceCm) val = r.headCircumferenceCm;
        else return null;

        const d = new Date(r.recordedAt);
        const label = `${d.getMonth() + 1}/${d.getDate()}`;
        return { value: val, label, dataPointText: String(val) };
      })
      .filter(Boolean) as { value: number; label: string; dataPointText: string }[];
  };

  const chartData = getChartData();
  const tabInfo = TABS.find((t) => t.key === activeTab)!;

  const latestVal = chartData.length > 0 ? chartData[chartData.length - 1].value : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: ollie.textSecondary }]}>{'< Back'}</Text>
        </Pressable>

        <Text style={[styles.title, { color: ollie.textPrimary }]}>
          {baby?.name ? `${baby.name}'s Measurements` : 'Measurements'}
        </Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === tab.key ? ollie.accent : ollie.bgSecondary,
                  borderRadius: ollie.radiusSm,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? '#FFFFFF' : ollie.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Current Value */}
        {latestVal !== null && (
          <View style={[styles.currentCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.currentLabel, { color: ollie.textLight }]}>Latest {tabInfo.label}</Text>
            <Text style={[styles.currentValue, { color: ollie.textPrimary }]}>
              {latestVal} {tabInfo.unit}
            </Text>
          </View>
        )}

        {/* Chart */}
        {chartData.length >= 2 ? (
          <View style={[styles.chartCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.chartTitle, { color: ollie.textPrimary }]}>
              {tabInfo.label} Progress ({tabInfo.unit})
            </Text>
            <LineChart
              data={chartData}
              height={160}
              spacing={60}
              color={ollie.accent}
              thickness={3}
              dataPointsColor={ollie.accent}
              dataPointsRadius={5}
              textColor={ollie.textLight}
              textFontSize={10}
              yAxisTextStyle={{ color: ollie.textLight, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: ollie.textLight, fontSize: 10, fontFamily: 'Nunito_600SemiBold' }}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              curved
              isAnimated
              textShiftY={-8}
              textShiftX={-4}
            />
          </View>
        ) : (
          <View style={[styles.emptyChart, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.emptyText, { color: ollie.textLight }]}>
              {chartData.length === 0
                ? `No ${tabInfo.label.toLowerCase()} records yet`
                : 'Add one more record to see the chart'}
            </Text>
          </View>
        )}

        {/* Record History */}
        {records.length > 0 && (
          <View style={styles.history}>
            <Text style={[styles.historyTitle, { color: ollie.textPrimary }]}>Recent Records</Text>
            {records.slice(0, 10).map((r) => {
              const vals: string[] = [];
              if (r.weightKg) vals.push(`${r.weightKg} kg`);
              if (r.heightCm) vals.push(`${r.heightCm} cm`);
              if (r.headCircumferenceCm) vals.push(`Head: ${r.headCircumferenceCm} cm`);
              return (
                <View key={r.id} style={[styles.recordRow, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}>
                  <Text style={[styles.recordDate, { color: ollie.textSecondary }]}>
                    {new Date(r.recordedAt).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.recordVals, { color: ollie.textPrimary }]}>
                    {vals.join(' | ')}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Add Form */}
        {showForm ? (
          <View style={[styles.formCard, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.formTitle, { color: ollie.textPrimary }]}>
              Add {tabInfo.label} ({tabInfo.unit})
            </Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={value}
              onChangeText={setValue}
              placeholder={activeTab === 'weight' ? '4.5' : '55'}
              placeholderTextColor={ollie.textLight}
              keyboardType="decimal-pad"
              autoFocus
            />
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={ollie.textLight}
            />
            <View style={styles.formButtons}>
              <Pressable
                style={[styles.formBtn, { backgroundColor: ollie.bgSecondary }]}
                onPress={() => setShowForm(false)}
              >
                <Text style={[styles.formBtnText, { color: ollie.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.formBtn, { backgroundColor: ollie.accent }]}
                onPress={handleSave}
              >
                <Text style={[styles.formBtnText, { color: '#FFFFFF' }]}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={[styles.addBtn, { backgroundColor: ollie.accent, borderRadius: ollie.radiusSm }]}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.addBtnText}>+ Add Measurement</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  currentCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  currentLabel: { fontSize: 13, marginBottom: 4 },
  currentValue: {
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  emptyChart: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: { fontSize: 14, textAlign: 'center' },
  history: { marginBottom: 16 },
  historyTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 6,
  },
  recordDate: { fontSize: 13 },
  recordVals: { fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  formCard: {
    padding: 16,
    gap: 10,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  formBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  formBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  addBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

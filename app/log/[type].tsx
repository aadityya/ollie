import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { Timer } from '@/src/components/Timer';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { OptionSelector } from '@/src/components/OptionSelector';
import { DateField } from '@/src/components/DateField';
import { TimeField } from '@/src/components/TimeField';
import { useTimer } from '@/src/hooks/useTimer';
import { useActivityStore } from '@/src/stores/useActivityStore';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { getMetaForType } from '@/src/utils/activityHelpers';
import {
  ActivityType,
  FeedType,
  PeeAmount,
  PoopColor,
  PoopConsistency,
  SleepType,
  ColicIntensity,
} from '@/src/types';

const titles: Record<string, string> = {
  feed: 'Log Feeding',
  sleep: 'Log Sleep',
  pee: 'Log Wet Diaper',
  poop: 'Log Dirty Diaper',
  colic: 'Log Colic Episode',
  tummy_time: 'Log Tummy Time',
  sun_time: 'Log Sun Time',
};

const timerTypes = ['feed', 'sleep', 'colic', 'tummy_time', 'sun_time'];
const hasTimerFn = (type: string) => timerTypes.includes(type);

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function formatTimeHHMM(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function nowTimeStr(): string {
  const now = new Date();
  return formatTimeHHMM(now.getHours(), now.getMinutes());
}

function oneHourAgoTimeStr(): string {
  const now = new Date();
  now.setHours(now.getHours() - 1);
  return formatTimeHHMM(now.getHours(), now.getMinutes());
}

export default function ActivityFormScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { ollie } = useAppTheme();
  const router = useRouter();
  const saveActivity = useActivityStore((s) => s.saveActivity);
  const babyId = useBabyStore((s) => s.activeBaby?.id);

  const activityType = type ?? 'feed';
  const meta = getMetaForType(activityType);
  const colors = meta.getColors(ollie);
  const isTimedActivity = hasTimerFn(activityType);

  const timer = useTimer();
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  // Date picker state
  const [activityDate, setActivityDate] = useState(todayStr);
  const [showDateInput, setShowDateInput] = useState(false);

  // Manual time entry state (for timed activities)
  const [timeMode, setTimeMode] = useState<'timer' | 'manual'>('timer');
  const [manualStartTime, setManualStartTime] = useState(oneHourAgoTimeStr);
  const [manualEndTime, setManualEndTime] = useState(nowTimeStr);

  // Feed state
  const [feedType, setFeedType] = useState<FeedType>('breast_left');
  const [bottleAmount, setBottleAmount] = useState('');

  // Pee state
  const [peeAmount, setPeeAmount] = useState<PeeAmount>('normal');

  // Poop state
  const [poopColor, setPoopColor] = useState<PoopColor>('yellow');
  const [poopConsistency, setPoopConsistency] = useState<PoopConsistency>('soft');

  // Sleep state
  const [sleepType, setSleepType] = useState<SleepType>('nap');

  // Colic state
  const [colicIntensity, setColicIntensity] = useState<ColicIntensity>('mild');
  const [colicWhatHelped, setColicWhatHelped] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSave = async () => {
    if (!babyId) return;
    if (isTimedActivity && timeMode === 'timer' && timer.isRunning) {
      timer.stop();
    }
    setSaving(true);

    let startedAt: string;
    let endedAt: string;
    let durationSeconds: number | undefined;
    const today = todayStr();

    if (isTimedActivity && timeMode === 'manual') {
      const [sh, sm] = manualStartTime.split(':').map(Number);
      const [eh, em] = manualEndTime.split(':').map(Number);
      const startDate = new Date(activityDate + 'T00:00:00');
      startDate.setHours(sh, sm, 0, 0);
      const endDate = new Date(activityDate + 'T00:00:00');
      endDate.setHours(eh, em, 0, 0);
      if (endDate <= startDate) {
        Alert.alert('Invalid Time', 'End time must be after start time.');
        setSaving(false);
        return;
      }
      startedAt = startDate.toISOString();
      endedAt = endDate.toISOString();
      durationSeconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
    } else if (isTimedActivity && timeMode === 'timer') {
      const elapsed = timer.elapsed;
      if (activityDate === today) {
        endedAt = new Date().toISOString();
        startedAt = new Date(Date.now() - elapsed * 1000).toISOString();
      } else {
        const baseDate = new Date(activityDate + 'T12:00:00');
        startedAt = new Date(baseDate.getTime() - elapsed * 1000).toISOString();
        endedAt = baseDate.toISOString();
      }
      durationSeconds = elapsed || undefined;
    } else {
      if (activityDate === today) {
        startedAt = new Date().toISOString();
      } else {
        startedAt = new Date(activityDate + 'T12:00:00').toISOString();
      }
      endedAt = startedAt;
    }

    try {
      await saveActivity({
        babyId,
        type: activityType as ActivityType,
        startedAt,
        endedAt,
        durationSeconds,
        feedType: activityType === 'feed' ? feedType : undefined,
        bottleAmountMl:
          activityType === 'feed' && feedType === 'bottle' && bottleAmount
            ? parseInt(bottleAmount, 10)
            : undefined,
        peeAmount: activityType === 'pee' ? peeAmount : undefined,
        poopColor: activityType === 'poop' ? poopColor : undefined,
        poopConsistency: activityType === 'poop' ? poopConsistency : undefined,
        sleepType: activityType === 'sleep' ? sleepType : undefined,
        colicIntensity: activityType === 'colic' ? colicIntensity : undefined,
        colicWhatHelped:
          activityType === 'colic' && colicWhatHelped ? colicWhatHelped : undefined,
        notes: notes || undefined,
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save activity. Please try again.');
      console.error('Save activity error:', e);
    }
    setSaving(false);
  };

  const renderFeedForm = () => (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Type</Text>
      <SegmentedControl
        options={[
          { value: 'breast_left', label: 'Left' },
          { value: 'breast_right', label: 'Right' },
          { value: 'bottle', label: 'Bottle' },
        ]}
        selectedValue={feedType}
        onChange={(v) => setFeedType(v as FeedType)}
        activeColor={colors.bg}
        activeTextColor={colors.color}
      />
      {feedType === 'bottle' && (
        <View style={styles.inputRow}>
          <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Amount (ml)</Text>
          <TextInput
            style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
            value={bottleAmount}
            onChangeText={setBottleAmount}
            placeholder="120"
            placeholderTextColor={ollie.textLight}
            keyboardType="numeric"
            onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
          />
        </View>
      )}
    </View>
  );

  const renderPeeForm = () => (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Amount</Text>
      <OptionSelector
        options={[
          { value: 'light', label: 'Light', bgColor: colors.bg, color: colors.color },
          { value: 'normal', label: 'Normal', bgColor: colors.bg, color: colors.color },
          { value: 'heavy', label: 'Heavy', bgColor: colors.bg, color: colors.color },
        ]}
        selected={peeAmount}
        onChange={(v) => setPeeAmount(v as PeeAmount)}
      />
    </View>
  );

  const renderPoopForm = () => (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Color</Text>
      <OptionSelector
        options={[
          { value: 'yellow', label: 'Yellow', bgColor: colors.bg, color: colors.color },
          { value: 'brown', label: 'Brown', bgColor: colors.bg, color: colors.color },
          { value: 'green', label: 'Green', bgColor: colors.bg, color: colors.color },
        ]}
        selected={poopColor}
        onChange={(v) => setPoopColor(v as PoopColor)}
      />
      <Text style={[styles.fieldLabel, { color: ollie.textSecondary, marginTop: 16 }]}>
        Consistency
      </Text>
      <OptionSelector
        options={[
          { value: 'liquid', label: 'Liquid', bgColor: colors.bg, color: colors.color },
          { value: 'soft', label: 'Soft', bgColor: colors.bg, color: colors.color },
          { value: 'formed', label: 'Formed', bgColor: colors.bg, color: colors.color },
        ]}
        selected={poopConsistency}
        onChange={(v) => setPoopConsistency(v as PoopConsistency)}
      />
    </View>
  );

  const renderSleepForm = () => (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Type</Text>
      <SegmentedControl
        options={[
          { value: 'nap', label: 'Nap' },
          { value: 'night', label: 'Night' },
        ]}
        selectedValue={sleepType}
        onChange={(v) => setSleepType(v as SleepType)}
        activeColor={colors.bg}
        activeTextColor={colors.color}
      />
    </View>
  );

  const renderColicForm = () => (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Intensity</Text>
      <OptionSelector
        options={[
          { value: 'mild', label: 'Mild', bgColor: colors.bg, color: colors.color },
          { value: 'moderate', label: 'Moderate', bgColor: colors.bg, color: colors.color },
          { value: 'severe', label: 'Severe', bgColor: colors.bg, color: colors.color },
        ]}
        selected={colicIntensity}
        onChange={(v) => setColicIntensity(v as ColicIntensity)}
      />
      <View style={styles.inputRow}>
        <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>What helped?</Text>
        <TextInput
          style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
          value={colicWhatHelped}
          onChangeText={setColicWhatHelped}
          placeholder="Rocking, swaddling..."
          placeholderTextColor={ollie.textLight}
          onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
        />
      </View>
    </View>
  );

  const renderForm = () => {
    switch (activityType) {
      case 'feed': return renderFeedForm();
      case 'pee': return renderPeeForm();
      case 'poop': return renderPoopForm();
      case 'sleep': return renderSleepForm();
      case 'colic': return renderColicForm();
      default: return null;
    }
  };

  const isToday = activityDate === todayStr();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: ollie.textSecondary }]}>{'Back'}</Text>
        </Pressable>

        <View style={[styles.header, { backgroundColor: colors.bg }]}>
          {meta?.icon && (() => { const Icon = meta.icon; return <Icon width={160} height={160} />; })()}
          <Text style={[styles.headerTitle, { color: colors.color }]}>
            {titles[activityType] ?? `Log ${activityType}`}
          </Text>
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Date</Text>
          <View style={styles.dateRow}>
            <Pressable
              style={[styles.dateChip, { backgroundColor: isToday && !showDateInput ? colors.bg : ollie.bgSecondary, borderRadius: ollie.radiusSm }]}
              onPress={() => { setActivityDate(todayStr()); setShowDateInput(false); }}
            >
              <Text style={[styles.dateChipText, { color: isToday && !showDateInput ? colors.color : ollie.textSecondary }]}>Today</Text>
            </Pressable>
            <Pressable
              style={[styles.dateChip, { backgroundColor: showDateInput ? colors.bg : ollie.bgSecondary, borderRadius: ollie.radiusSm }]}
              onPress={() => setShowDateInput(true)}
            >
              <Text style={[styles.dateChipText, { color: showDateInput ? colors.color : ollie.textSecondary }]}>
                {showDateInput && activityDate !== todayStr() ? activityDate : 'Other Date'}
              </Text>
            </Pressable>
          </View>
          {showDateInput && (
            <DateField value={activityDate} onChange={setActivityDate} maximumDate={new Date()} />
          )}
        </View>

        {/* Timer vs Manual mode toggle for timed activities */}
        {isTimedActivity && (
          <View style={styles.section}>
            <SegmentedControl
              options={[
                { value: 'timer', label: 'Timer' },
                { value: 'manual', label: 'Start / Stop Time' },
              ]}
              selectedValue={timeMode}
              onChange={(v) => setTimeMode(v as 'timer' | 'manual')}
              activeColor={colors.bg}
              activeTextColor={colors.color}
            />
          </View>
        )}

        {isTimedActivity && timeMode === 'timer' && (
          <Timer
            elapsed={timer.elapsed}
            isRunning={timer.isRunning}
            onStart={timer.start}
            onStop={timer.stop}
            onReset={timer.reset}
            accentColor={colors.color}
          />
        )}

        {isTimedActivity && timeMode === 'manual' && (
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Start & End Time</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <TimeField value={manualStartTime} onChange={setManualStartTime} label="Start" />
              </View>
              <Text style={[styles.timeSeparator, { color: ollie.textLight }]}>to</Text>
              <View style={styles.timeField}>
                <TimeField value={manualEndTime} onChange={setManualEndTime} label="End" />
              </View>
            </View>
          </View>
        )}

        {renderForm()}

        <View style={styles.section}>
          <Text style={[styles.fieldLabel, { color: ollie.textSecondary }]}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional notes..."
            placeholderTextColor={ollie.textLight}
            multiline
            numberOfLines={3}
            onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
          />
        </View>

      </ScrollView>
      <View style={[styles.bottomBar, { backgroundColor: ollie.bg }]}>
        <Pressable
          style={[styles.saveBtn, { backgroundColor: colors.color }]}
          onPress={() => { Keyboard.dismiss(); handleSave(); }}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  header: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Nunito_800ExtraBold' },
  section: { marginTop: 20 },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  inputRow: { marginTop: 16 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateChipText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeField: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  timeInput: {
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Alert, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Timer } from '@/src/components/Timer';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { OptionSelector } from '@/src/components/OptionSelector';
import { useTimer } from '@/src/hooks/useTimer';
import { useActivityStore } from '@/src/stores/useActivityStore';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { activityMeta } from '@/src/utils/activityHelpers';
import { VersionBadge } from '@/src/components/VersionBadge';
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
};

const hasTimer = (type: string) => ['feed', 'sleep', 'colic'].includes(type);

export default function ActivityFormScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { ollie } = useAppTheme();
  const router = useRouter();
  const saveActivity = useActivityStore((s) => s.saveActivity);
  const babyId = useBabyStore((s) => s.activeBaby?.id);

  const activityType = (type as ActivityType) ?? 'feed';
  const meta = activityMeta[activityType];
  const colors = meta?.getColors(ollie) ?? { bg: ollie.accentLight, color: ollie.accent };

  const timer = useTimer();
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

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

  const handleSave = async () => {
    if (!babyId) return;
    if (hasTimer(activityType) && timer.isRunning) {
      timer.stop();
    }
    setSaving(true);

    const now = new Date().toISOString();
    const durationSeconds = hasTimer(activityType) ? timer.elapsed : undefined;
    const startedAt = durationSeconds
      ? new Date(Date.now() - durationSeconds * 1000).toISOString()
      : now;

    try {
      await saveActivity({
        babyId,
        type: activityType,
        startedAt,
        endedAt: now,
        durationSeconds: durationSeconds || undefined,
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

        <View style={[styles.header, { backgroundColor: colors.bg }]}>
          {meta?.icon && <Image source={meta.icon} style={styles.headerIcon} resizeMode="contain" />}
          <Text style={[styles.headerTitle, { color: colors.color }]}>
            {titles[activityType] ?? 'Log Activity'}
          </Text>
        </View>

        {hasTimer(activityType) && (
          <Timer
            elapsed={timer.elapsed}
            isRunning={timer.isRunning}
            onStart={timer.start}
            onStop={timer.stop}
            onReset={timer.reset}
            accentColor={colors.color}
          />
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
          />
        </View>

        <Pressable
          style={[styles.saveBtn, { backgroundColor: colors.color }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>

        <VersionBadge />
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
  header: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerIcon: { width: 56, height: 56 },
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
  saveBtn: {
    marginTop: 28,
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

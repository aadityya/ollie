import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { WelcomeScreenLogo } from '@/src/constants/icons';
import { generateMockData } from '@/src/utils/mockData';

interface BabyEntry {
  name: string;
  dob: string;
  gender: string;
}

export default function OnboardingScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const addBaby = useBabyStore((s) => s.addBaby);
  const setOnboardingCompleted = useSettingsStore((s) => s.setOnboardingCompleted);

  const loadBabies = useBabyStore((s) => s.loadBabies);

  const [babies, setBabies] = useState<BabyEntry[]>([{ name: '', dob: '', gender: '' }]);
  const [saving, setSaving] = useState(false);
  const [loadingMock, setLoadingMock] = useState(false);

  const isEntryValid = (entry: BabyEntry) =>
    entry.name.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(entry.dob);

  const hasAtLeastOneValid = babies.some(isEntryValid);

  const updateBaby = (index: number, field: keyof BabyEntry, value: string) => {
    const updated = [...babies];
    updated[index] = { ...updated[index], [field]: value };
    setBabies(updated);
  };

  const addEntry = () => {
    setBabies([...babies, { name: '', dob: '', gender: '' }]);
  };

  const removeEntry = (index: number) => {
    if (babies.length <= 1) return;
    setBabies(babies.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!hasAtLeastOneValid || saving) return;
    setSaving(true);
    try {
      const validBabies = babies.filter(isEntryValid);
      for (const baby of validBabies) {
        await addBaby({ name: baby.name.trim(), dateOfBirth: baby.dob, gender: baby.gender || undefined });
      }
      setOnboardingCompleted(true);
      router.replace('/');
    } catch (e) {
      console.error('Onboarding error:', e);
    }
    setSaving(false);
  };

  const handleMockData = async () => {
    if (loadingMock) return;
    setLoadingMock(true);
    try {
      await generateMockData();
      await loadBabies();
      setOnboardingCompleted(true);
      router.replace('/');
    } catch (e) {
      console.error('Mock data error:', e);
    }
    setLoadingMock(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroImage}>
            <WelcomeScreenLogo width={220} height={220} />
          </View>
          <Text style={[styles.title, { color: ollie.textPrimary }]}>
            Welcome to Ollie
          </Text>
          <Text style={[styles.subtitle, { color: ollie.textSecondary }]}>
            Add your little ones to get started
          </Text>

          {babies.map((baby, index) => (
            <View key={index} style={[styles.babyCard, { backgroundColor: ollie.bgCard, borderColor: ollie.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: ollie.textSecondary }]}>
                  Baby {index + 1}
                </Text>
                {babies.length > 1 && (
                  <Pressable onPress={() => removeEntry(index)}>
                    <Text style={[styles.removeBtn, { color: ollie.textLight }]}>Remove</Text>
                  </Pressable>
                )}
              </View>

              <Text style={[styles.label, { color: ollie.textSecondary }]}>Name</Text>
              <TextInput
                style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
                value={baby.name}
                onChangeText={(v) => updateBaby(index, 'name', v)}
                placeholder="Emma"
                placeholderTextColor={ollie.textLight}
                autoFocus={index === 0}
              />

              <Text style={[styles.label, { color: ollie.textSecondary }]}>Date of Birth</Text>
              <TextInput
                style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
                value={baby.dob}
                onChangeText={(v) => updateBaby(index, 'dob', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={ollie.textLight}
                keyboardType="numbers-and-punctuation"
              />

              <Text style={[styles.label, { color: ollie.textSecondary }]}>Gender</Text>
              <View style={styles.genderRow}>
                {(['boy', 'girl'] as const).map((g) => (
                  <Pressable
                    key={g}
                    style={[
                      styles.genderBtn,
                      {
                        backgroundColor: baby.gender === g ? ollie.accent : ollie.bgSecondary,
                        borderRadius: 10,
                      },
                    ]}
                    onPress={() => updateBaby(index, 'gender', g)}
                  >
                    <Text style={[styles.genderText, { color: baby.gender === g ? '#FFFFFF' : ollie.textSecondary }]}>
                      {g === 'boy' ? 'Boy' : 'Girl'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          <Pressable
            style={[styles.addMoreBtn, { borderColor: ollie.accent }]}
            onPress={addEntry}
          >
            <Text style={[styles.addMoreText, { color: ollie.accent }]}>+ Add Another Baby</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: hasAtLeastOneValid ? ollie.accent : ollie.bgSecondary }]}
            onPress={handleSave}
            disabled={!hasAtLeastOneValid || saving || loadingMock}
          >
            <Text style={[styles.buttonText, { color: hasAtLeastOneValid ? '#FFFFFF' : ollie.textLight }]}>
              {saving ? 'Setting up...' : "Let's Go!"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.mockBtn, { borderColor: ollie.textLight }]}
            onPress={handleMockData}
            disabled={saving || loadingMock}
          >
            <Text style={[styles.mockBtnText, { color: ollie.textSecondary }]}>
              {loadingMock ? 'Generating data...' : 'Try with Mock Data'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  heroImage: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  babyCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  removeBtn: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  genderText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  addMoreBtn: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  addMoreText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  mockBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  mockBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
});

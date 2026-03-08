import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/src/theme';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { WelcomeBg } from '@/src/constants/icons';

export default function OnboardingScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const addBaby = useBabyStore((s) => s.addBaby);
  const setOnboardingCompleted = useSettingsStore((s) => s.setOnboardingCompleted);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [saving, setSaving] = useState(false);

  const isValid = name.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(dob);

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await addBaby({ name: name.trim(), dateOfBirth: dob });
      setOnboardingCompleted(true);
      router.replace('/');
    } catch (e) {
      console.error('Onboarding error:', e);
    }
    setSaving(false);
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
          <Image source={WelcomeBg} style={styles.heroImage} resizeMode="contain" />
          <Text style={[styles.title, { color: ollie.textPrimary }]}>
            Welcome to Ollie
          </Text>
          <Text style={[styles.subtitle, { color: ollie.textSecondary }]}>
            Let's get to know your little one
          </Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: ollie.textSecondary }]}>Baby's Name</Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
              value={name}
              onChangeText={setName}
              placeholder="Emma"
              placeholderTextColor={ollie.textLight}
              autoFocus
            />

            <Text style={[styles.label, { color: ollie.textSecondary }]}>Date of Birth</Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bgCard }]}
              value={dob}
              onChangeText={setDob}
              placeholder="2025-10-21"
              placeholderTextColor={ollie.textLight}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={[styles.hint, { color: ollie.textLight }]}>
              Format: YYYY-MM-DD
            </Text>
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: isValid ? ollie.accent : ollie.bgSecondary }]}
            onPress={handleSave}
            disabled={!isValid || saving}
          >
            <Text style={[styles.buttonText, { color: isValid ? '#FFFFFF' : ollie.textLight }]}>
              {saving ? 'Setting up...' : "Let's Go!"}
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
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: 260,
    alignSelf: 'center',
    marginBottom: 16,
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
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
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
});

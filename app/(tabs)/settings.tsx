import React, { useState, useRef } from 'react';
import { ScrollView, View, StyleSheet, Alert, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SettingsItem } from '@/src/components/SettingsItem';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { BabySwitcher } from '@/src/components/BabySwitcher';
import { DateField } from '@/src/components/DateField';
import { useAppTheme } from '@/src/theme';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { resetDatabase } from '@/src/db/database';
import { APP_VERSION } from '@/src/constants/version';
import { ThemeName } from '@/src/types';
import { AppIcons } from '@/src/constants/icons';

export default function SettingsScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const {
    theme,
    setTheme,
    setOnboardingCompleted,
    userName,
    setUserName,
  } = useSettingsStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  // Baby profile editing
  const [editingBaby, setEditingBaby] = useState(false);
  const [babyNameInput, setBabyNameInput] = useState('');
  const [babyDobInput, setBabyDobInput] = useState('');
  const [addingBaby, setAddingBaby] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBabyDob, setNewBabyDob] = useState('');
  const [newBabyGender, setNewBabyGender] = useState<string>('girl');

  const babies = useBabyStore((s) => s.babies);
  const activeBaby = useBabyStore((s) => s.activeBaby);
  const updateBaby = useBabyStore((s) => s.updateBaby);
  const addBaby = useBabyStore((s) => s.addBaby);
  const deleteBaby = useBabyStore((s) => s.deleteBaby);
  const setBabyTheme = useBabyStore((s) => s.setBabyTheme);
  const clearAll = useBabyStore((s) => s.clearAll);

  const currentTheme = activeBaby?.theme ?? theme;

  const handleThemeSelect = (t: ThemeName) => {
    if (activeBaby) {
      setBabyTheme(activeBaby.id, t);
    } else {
      setTheme(t);
    }
  };

  const startEditBaby = () => {
    if (!activeBaby) return;
    setBabyNameInput(activeBaby.name);
    setBabyDobInput(activeBaby.dateOfBirth);
    setEditingBaby(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const handleSaveBaby = async () => {
    if (!activeBaby || !babyNameInput.trim() || !babyDobInput.trim()) return;
    await updateBaby(activeBaby.id, {
      name: babyNameInput.trim(),
      dateOfBirth: babyDobInput.trim(),
    });
    setEditingBaby(false);
  };

  const handleDeleteBaby = () => {
    if (!activeBaby) return;
    if (babies.length <= 1) {
      Alert.alert('Cannot Delete', 'You need at least one baby profile.');
      return;
    }
    Alert.alert('Delete Baby', `Delete "${activeBaby.name}" and all their data? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteBaby(activeBaby.id);
          setEditingBaby(false);
        },
      },
    ]);
  };

  const handleAddBaby = async () => {
    if (!newBabyName.trim() || !newBabyDob.trim()) return;
    await addBaby({
      name: newBabyName.trim(),
      dateOfBirth: newBabyDob.trim(),
      gender: newBabyGender,
    });
    setNewBabyName('');
    setNewBabyDob('');
    setNewBabyGender('girl');
    setAddingBaby(false);
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will delete ALL data including baby profiles, activities, and measurements. This cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetDatabase();
              clearAll();
              setOnboardingCompleted(false);
              router.replace('/onboarding');
            } catch (e) {
              Alert.alert('Error', 'Failed to reset app. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        ref={scrollRef}
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Settings" subtitle="Customize your experience" />
        <View style={styles.badgeWrap}>
          <BabySwitcher />
        </View>

        {/* User Profile */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>YOUR PROFILE</Text>
        {editingName ? (
          <View style={[styles.nameEditRow, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}>
            <TextInput
              style={[styles.nameInput, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Your name"
              placeholderTextColor={ollie.textLight}
              autoFocus
            />
            <Pressable
              style={[styles.nameSaveBtn, { backgroundColor: ollie.accent }]}
              onPress={() => {
                if (nameInput.trim()) setUserName(nameInput.trim());
                setEditingName(false);
              }}
            >
              <Text style={styles.nameSaveBtnText}>Save</Text>
            </Pressable>
          </View>
        ) : (
          <SettingsItem
            icon="👤"
            label={`Name: ${userName}`}
            onPress={() => { setNameInput(userName); setEditingName(true); }}
            isOnly
          />
        )}

        {/* Baby Profile */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>BABY PROFILE</Text>
        {activeBaby && !editingBaby && (
          <>
            <View style={[styles.iconPickerRow, { backgroundColor: ollie.bgCard, borderTopLeftRadius: ollie.radiusSm, borderTopRightRadius: ollie.radiusSm }]}>
              {([
                { key: 'boy', label: 'Boy', icon: AppIcons.boy },
                { key: 'girl', label: 'Girl', icon: AppIcons.girl },
              ] as const).map(({ key, label, icon: Icon }) => {
                const isSelected = activeBaby.gender === key;
                return (
                  <Pressable
                    key={key}
                    style={[
                      styles.iconPickerItem,
                      isSelected && { backgroundColor: ollie.accentLight, borderRadius: ollie.radiusSm },
                    ]}
                    onPress={() => updateBaby(activeBaby.id, { gender: key })}
                  >
                    <Icon width={72} height={72} />
                    <Text style={[styles.iconPickerLabel, { color: isSelected ? ollie.accent : ollie.textLight }]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={[styles.babyActions, { backgroundColor: ollie.bgCard, borderBottomLeftRadius: ollie.radiusSm, borderBottomRightRadius: ollie.radiusSm }]}>
              <Pressable onPress={startEditBaby}>
                <Text style={[styles.babyActionText, { color: ollie.accent }]}>Edit</Text>
              </Pressable>
              <Pressable onPress={handleDeleteBaby}>
                <Text style={[styles.babyActionText, { color: ollie.textLight }]}>Delete</Text>
              </Pressable>
            </View>
          </>
        )}

        {activeBaby && editingBaby && (
          <View style={[styles.form, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.formTitle, { color: ollie.textPrimary }]}>Edit Baby</Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={babyNameInput}
              onChangeText={setBabyNameInput}
              placeholder="Baby's name"
              placeholderTextColor={ollie.textLight}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <View style={{ marginBottom: 10 }}>
              <DateField value={babyDobInput} onChange={setBabyDobInput} label="Date of Birth" />
            </View>
            <View style={styles.formActions}>
              <Pressable onPress={() => setEditingBaby(false)}>
                <Text style={[styles.cancelBtn, { color: ollie.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, { backgroundColor: ollie.accent }]}
                onPress={handleSaveBaby}
                disabled={!babyNameInput.trim() || !babyDobInput.trim()}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        )}

        {!addingBaby ? (
          <Pressable
            style={[styles.addBtn, { borderColor: ollie.accent }]}
            onPress={() => { setAddingBaby(true); setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300); }}
          >
            <Text style={[styles.addBtnText, { color: ollie.accent }]}>+ Add Baby</Text>
          </Pressable>
        ) : (
          <View style={[styles.form, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
            <Text style={[styles.formTitle, { color: ollie.textPrimary }]}>New Baby</Text>
            <TextInput
              style={[styles.input, { color: ollie.textPrimary, borderColor: ollie.border, backgroundColor: ollie.bg }]}
              value={newBabyName}
              onChangeText={setNewBabyName}
              placeholder="Baby's name"
              placeholderTextColor={ollie.textLight}
              autoFocus
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
            <View style={{ marginBottom: 10 }}>
              <DateField value={newBabyDob} onChange={setNewBabyDob} label="Date of Birth" />
            </View>
            <View style={styles.genderRow}>
              {([
                { key: 'boy', label: 'Boy', icon: AppIcons.boy },
                { key: 'girl', label: 'Girl', icon: AppIcons.girl },
              ] as const).map(({ key, label, icon: Icon }) => (
                <Pressable
                  key={key}
                  style={[
                    styles.genderOption,
                    newBabyGender === key && { backgroundColor: ollie.accentLight },
                    { borderRadius: ollie.radiusSm },
                  ]}
                  onPress={() => setNewBabyGender(key)}
                >
                  <Icon width={54} height={54} />
                  <Text style={[styles.genderLabel, { color: newBabyGender === key ? ollie.accent : ollie.textLight }]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.formActions}>
              <Pressable onPress={() => setAddingBaby(false)}>
                <Text style={[styles.cancelBtn, { color: ollie.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, { backgroundColor: ollie.accent }]}
                onPress={handleAddBaby}
                disabled={!newBabyName.trim() || !newBabyDob.trim()}
              >
                <Text style={styles.saveBtnText}>Add</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Appearance */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>APPEARANCE</Text>
        <View style={[styles.themeRow, { backgroundColor: ollie.bgCard, borderTopLeftRadius: ollie.radiusSm, borderTopRightRadius: ollie.radiusSm }]}>
          <Text style={styles.themeIcon}>🎨</Text>
          <Text style={[styles.themeLabel, { color: ollie.textPrimary }]}>
            Theme{activeBaby ? ` for ${activeBaby.name}` : ''}
          </Text>
        </View>
        <ThemeSelector currentTheme={currentTheme} onSelect={handleThemeSelect} />

        {/* Data */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>DATA</Text>
        <SettingsItem
          icon="🗑️"
          label="Reset App"
          onPress={handleResetApp}
          isOnly
        />

        {/* About */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>ABOUT</Text>
        <SettingsItem
          icon="❓"
          label="Help & Support"
          onPress={() => router.push('/help-support')}
          isFirst
        />
        <SettingsItem
          icon="📋"
          label="Privacy Policy"
          onPress={() => router.push('/privacy-policy')}
          isLast
        />

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: ollie.textPrimary }]}>Ollie</Text>
          <Text style={[styles.appVersion, { color: ollie.textLight }]}>Version {APP_VERSION}</Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  badgeWrap: { marginTop: 4, marginBottom: 16 },
  groupTitle: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    paddingLeft: 4,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  themeIcon: { fontSize: 22 },
  themeLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Nunito_800ExtraBold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  nameInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  nameSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nameSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  iconPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
  },
  iconPickerItem: {
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  iconPickerLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  babyActions: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0e8df',
  },
  babyActionText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  form: { padding: 16, marginTop: 8 },
  formTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', marginBottom: 12 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 10,
  },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 8 },
  cancelBtn: { fontSize: 15, fontFamily: 'Nunito_600SemiBold' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
  addBtn: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 8 },
  addBtnText: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
  },
  genderOption: {
    alignItems: 'center',
    padding: 10,
    gap: 4,
  },
  genderLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});

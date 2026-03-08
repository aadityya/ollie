import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, TextInput, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SettingsItem } from '@/src/components/SettingsItem';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { BabySwitcher } from '@/src/components/BabySwitcher';
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
  const {
    theme,
    setTheme,
    setOnboardingCompleted,
    userName,
    setUserName,
    customActivityTypes,
    addCustomActivityType,
    removeCustomActivityType,
  } = useSettingsStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [newActivity, setNewActivity] = useState('');

  const activeBaby = useBabyStore((s) => s.activeBaby);
  const updateBaby = useBabyStore((s) => s.updateBaby);
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
      <ScrollView
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
        {activeBaby && (
          <>
            <Text style={[styles.groupTitle, { color: ollie.textLight }]}>BABY PROFILE</Text>
            <View style={[styles.iconPickerRow, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}>
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
                    <Icon width={48} height={48} />
                    <Text style={[styles.iconPickerLabel, { color: isSelected ? ollie.accent : ollie.textLight }]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* Custom Activities */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>CUSTOM ACTIVITIES</Text>
        {customActivityTypes.map((type, i) => (
          <SettingsItem
            key={type}
            icon="🏷️"
            label={type}
            onPress={() => {
              Alert.alert('Remove Activity', `Remove "${type}"?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeCustomActivityType(type) },
              ]);
            }}
            isFirst={i === 0}
            isLast={i === customActivityTypes.length - 1}
            isOnly={customActivityTypes.length === 1}
          />
        ))}
        <View style={[styles.addActivityRow, { backgroundColor: ollie.bgCard, borderRadius: ollie.radiusSm }]}>
          <TextInput
            style={[styles.addActivityInput, { color: ollie.textPrimary }]}
            value={newActivity}
            onChangeText={setNewActivity}
            placeholder="New activity name..."
            placeholderTextColor={ollie.textLight}
          />
          <Pressable
            onPress={() => {
              if (newActivity.trim()) {
                addCustomActivityType(newActivity.trim());
                setNewActivity('');
              }
            }}
          >
            <Text style={[styles.addActivityBtn, { color: ollie.accent }]}>+ Add</Text>
          </Pressable>
        </View>

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
        <SettingsItem icon="📤" label="Export Data" isFirst />
        <SettingsItem icon="☁️" label="Backup & Sync" />
        <SettingsItem
          icon="🗑️"
          label="Reset App"
          onPress={handleResetApp}
          isLast
        />

        {/* About */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>ABOUT</Text>
        <SettingsItem icon="❓" label="Help & Support" isFirst />
        <SettingsItem icon="📋" label="Privacy Policy" isLast />

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: ollie.textPrimary }]}>Ollie</Text>
          <Text style={[styles.appVersion, { color: ollie.textLight }]}>Version {APP_VERSION}</Text>
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
  addActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    marginTop: 2,
  },
  addActivityInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  addActivityBtn: {
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
});

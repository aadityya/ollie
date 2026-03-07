import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SettingsItem } from '@/src/components/SettingsItem';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { useAppTheme } from '@/src/theme';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { APP_VERSION } from '@/src/constants/version';

export default function SettingsScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();
  const {
    theme,
    setTheme,
    feedReminderEnabled,
    napReminderEnabled,
    medicineReminderEnabled,
    toggleFeedReminder,
    toggleNapReminder,
    toggleMedicineReminder,
  } = useSettingsStore();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Settings" subtitle="Customize your experience" />

        {/* Baby */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>BABY</Text>
        <SettingsItem
          icon="👶"
          label="Baby Profile"
          onPress={() => {}}
          isOnly
        />

        {/* Notifications */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>NOTIFICATIONS</Text>
        <SettingsItem
          icon="🍼"
          label="Feed Reminders"
          type="toggle"
          value={feedReminderEnabled}
          onToggle={toggleFeedReminder}
          isFirst
        />
        <SettingsItem
          icon="😴"
          label="Nap Reminders"
          type="toggle"
          value={napReminderEnabled}
          onToggle={toggleNapReminder}
        />
        <SettingsItem
          icon="💊"
          label="Medicine Reminders"
          type="toggle"
          value={medicineReminderEnabled}
          onToggle={toggleMedicineReminder}
          isLast
        />

        {/* Appearance */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>APPEARANCE</Text>
        <View style={[styles.themeRow, { backgroundColor: ollie.bgCard, borderTopLeftRadius: ollie.radiusSm, borderTopRightRadius: ollie.radiusSm }]}>
          <Text style={styles.themeIcon}>🎨</Text>
          <Text style={[styles.themeLabel, { color: ollie.textPrimary }]}>Theme</Text>
        </View>
        <ThemeSelector currentTheme={theme} onSelect={setTheme} />

        {/* Data */}
        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>DATA</Text>
        <SettingsItem icon="📤" label="Export Data" isFirst />
        <SettingsItem icon="☁️" label="Backup & Sync" isLast />

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
});

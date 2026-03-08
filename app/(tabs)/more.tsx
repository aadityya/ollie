import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SettingsItem } from '@/src/components/SettingsItem';
import { useAppTheme } from '@/src/theme';
import { AppIcons } from '@/src/constants/icons';

export default function MoreScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="More" />

        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>TRACKING</Text>
        <SettingsItem
          icon="📏"
          label="Measurements"
          onPress={() => router.push('/measurements')}
          isFirst
        />
        <SettingsItem
          icon="📅"
          label="Appointments"
          onPress={() => router.push('/appointments')}
        />
        <SettingsItem
          icon="💝"
          label="Memories"
          onPress={() => router.push('/memories')}
          isLast
        />

        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>APP</Text>
        <SettingsItem
          icon={AppIcons.settings}
          label="Settings"
          onPress={() => router.push('/(tabs)/settings')}
          isOnly
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16 },
  groupTitle: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },
});

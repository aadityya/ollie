import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SettingsItem } from '@/src/components/SettingsItem';
import { BabySwitcher } from '@/src/components/BabySwitcher';
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
        <View style={styles.badgeWrap}>
          <BabySwitcher />
        </View>

        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>TRACKING</Text>
        <SettingsItem
          icon={AppIcons.measurements}
          label="Measurements"
          onPress={() => router.push('/measurements')}
          isFirst
          iconScale={1.5}
        />
        <SettingsItem
          icon={AppIcons.appointments}
          label="Appointments"
          onPress={() => router.push('/appointments')}
          iconScale={1.5}
        />
        <SettingsItem
          icon={AppIcons.memories}
          label="Memories"
          onPress={() => router.push('/memories')}
          isLast
          iconScale={1.5}
        />

        <Text style={[styles.groupTitle, { color: ollie.textLight }]}>APP</Text>
        <SettingsItem
          icon={AppIcons.settings}
          label="Settings"
          onPress={() => router.push('/(tabs)/settings')}
          isOnly
          iconScale={1.5}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 14, paddingTop: 12 },
  badgeWrap: { marginTop: 4, marginBottom: 16 },
  groupTitle: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },
});

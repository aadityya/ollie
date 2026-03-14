import React from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/src/theme';

export default function PrivacyPolicyScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();

  const Section = ({ title, children }: { title: string; children: string }) => (
    <>
      <Text style={[styles.sectionTitle, { color: ollie.textPrimary }]}>{title}</Text>
      <Text style={[styles.body, { color: ollie.textSecondary }]}>{children}</Text>
    </>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: ollie.accent }]}>Back</Text>
        </Pressable>

        <Text style={[styles.title, { color: ollie.textPrimary }]}>Privacy Policy</Text>
        <Text style={[styles.lastUpdated, { color: ollie.textLight }]}>Last updated: March 2026</Text>

        <Section title="Your Privacy Matters">
          Ollie is designed with your family's privacy as the top priority. We believe your baby's data belongs to you and only you.
        </Section>

        <Section title="Data Storage">
          All data you enter into Ollie — including feeding logs, sleep records, measurements, milestones, appointments, and memories — is stored exclusively on your device. Your data never leaves your phone.
        </Section>

        <Section title="No Data Collection by the App Creator">
          We do not collect, transmit, store, or have access to any of your personal information or your baby's data. The app creator has no servers, databases, or analytics services that receive your data. We simply cannot see your data — by design.
        </Section>

        <Section title="No Third-Party Sharing">
          Your data is not shared with any third parties. There are no advertising networks, analytics platforms, or data brokers integrated into Ollie.
        </Section>

        <Section title="No Account Required">
          Ollie does not require you to create an account, provide an email address, or sign in. You can use the app fully without providing any personal information.
        </Section>

        <Section title="No Internet Required">
          Ollie works entirely offline. No internet connection is needed to log activities, view insights, or manage your baby's profile.
        </Section>

        <Section title="Data Deletion">
          Since all data is stored locally on your device, you have full control. You can reset all data from Settings at any time. Uninstalling the app will also remove all data permanently.
        </Section>

        <Section title="Children's Privacy">
          We are committed to protecting the privacy of children. Ollie does not knowingly collect any data from children or about children beyond what a parent voluntarily enters for tracking purposes — and that data stays on the parent's device.
        </Section>

        <Section title="Changes to This Policy">
          If we update this privacy policy, the changes will be reflected within the app. We encourage you to review this page periodically.
        </Section>

        <Section title="Contact Us">
          If you have any questions about this privacy policy, please reach out to us at olliebaby.app@gmail.com.
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  title: { fontSize: 28, fontFamily: 'Nunito_800ExtraBold', marginBottom: 4 },
  lastUpdated: { fontSize: 13, fontFamily: 'Nunito_400Regular', marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontFamily: 'Nunito_700Bold', marginTop: 16, marginBottom: 6 },
  body: { fontSize: 15, fontFamily: 'Nunito_400Regular', lineHeight: 22 },
});

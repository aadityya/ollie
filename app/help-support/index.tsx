import React from 'react';
import { ScrollView, View, StyleSheet, Linking, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/src/theme';

export default function HelpSupportScreen() {
  const { ollie } = useAppTheme();
  const router = useRouter();

  const handleEmail = () => {
    Linking.openURL('mailto:olliebaby.app@gmail.com?subject=Ollie%20App%20Feedback');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: ollie.accent }]}>Back</Text>
        </Pressable>

        <Text style={[styles.title, { color: ollie.textPrimary }]}>Help & Support</Text>

        <View style={[styles.card, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.emoji]}>👋</Text>
          <Text style={[styles.heading, { color: ollie.textPrimary }]}>Hi there!</Text>
          <Text style={[styles.body, { color: ollie.textSecondary }]}>
            We built Ollie with love to help parents like you track and cherish every moment of your little one's journey.
          </Text>
          <Text style={[styles.body, { color: ollie.textSecondary }]}>
            Got a question, found a bug, or have an idea to make Ollie even better? We'd love to hear from you!
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.cardTitle, { color: ollie.textPrimary }]}>Send us feedback</Text>
          <Text style={[styles.body, { color: ollie.textSecondary }]}>
            Drop us an email anytime — we read every message and try to respond as quickly as we can.
          </Text>
          <Pressable
            style={[styles.emailBtn, { backgroundColor: ollie.accent, borderRadius: ollie.radiusSm }]}
            onPress={handleEmail}
          >
            <Text style={styles.emailBtnText}>✉️  olliebaby.app@gmail.com</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: ollie.bgCard, borderRadius: ollie.radius }]}>
          <Text style={[styles.cardTitle, { color: ollie.textPrimary }]}>Tips</Text>
          <Text style={[styles.body, { color: ollie.textSecondary }]}>
            • Tap any activity card on the home screen to quickly log an entry{'\n'}
            • Swipe through the timeline to review your baby's day{'\n'}
            • Check Insights weekly for patterns and trends{'\n'}
            • Add custom activities for anything unique to your routine
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 16, fontFamily: 'Nunito_600SemiBold' },
  title: { fontSize: 28, fontFamily: 'Nunito_800ExtraBold', marginBottom: 20 },
  card: { padding: 20, marginBottom: 16 },
  emoji: { fontSize: 36, marginBottom: 8 },
  heading: { fontSize: 20, fontFamily: 'Nunito_700Bold', marginBottom: 8 },
  cardTitle: { fontSize: 17, fontFamily: 'Nunito_700Bold', marginBottom: 8 },
  body: { fontSize: 15, fontFamily: 'Nunito_400Regular', lineHeight: 22, marginBottom: 8 },
  emailBtn: { paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', marginTop: 8 },
  emailBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
});

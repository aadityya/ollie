import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { useAppTheme } from '@/src/theme';
import { VersionBadge } from '@/src/components/VersionBadge';

export default function MilestonesScreen() {
  const { ollie } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]} edges={['top']}>
      <ScrollView
        style={[styles.container, { backgroundColor: ollie.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Milestones" subtitle="Emma's development journey" />
        <Text style={[styles.placeholder, { color: ollie.textLight }]}>
          Milestones coming in Phase 3
        </Text>
        <VersionBadge />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 16 },
  placeholder: { fontSize: 14, textAlign: 'center', marginTop: 40 },
});

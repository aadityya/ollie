import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/src/theme';
import { ScreenHeader } from '@/src/components/ScreenHeader';

export default function ProfileScreen() {
  const { ollie } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: ollie.bg }]}>
      <View style={styles.content}>
        <ScreenHeader title="Baby Profile" />
        <Text style={[styles.placeholder, { color: ollie.textLight }]}>
          Profile coming in Phase 3
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingTop: 16 },
  placeholder: { fontSize: 14, textAlign: 'center', marginTop: 40 },
});

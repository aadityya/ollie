import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useOlliePaperTheme } from '@/src/theme';
import { getDatabase } from '@/src/db/database';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useBabyStore } from '@/src/stores/useBabyStore';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const theme = useOlliePaperTheme();

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.ollie.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="log/[type]"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="stats/index" />
        <Stack.Screen name="onboarding/index" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [dbReady, setDbReady] = useState(false);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadBabies = useBabyStore((s) => s.loadBabies);

  useEffect(() => {
    async function init() {
      try {
        await getDatabase();
        await loadSettings();
        await loadBabies();
      } catch (e) {
        console.error('Init error:', e);
      }
      setDbReady(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return <AppContent />;
}

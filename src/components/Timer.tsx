import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { formatTimerDisplay } from '@/src/utils/dateHelpers';

interface TimerProps {
  elapsed: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  accentColor?: string;
}

export function Timer({ elapsed, isRunning, onStart, onStop, onReset, accentColor }: TimerProps) {
  const { ollie } = useAppTheme();
  const color = accentColor ?? ollie.accent;

  return (
    <View style={styles.container}>
      <Text style={[styles.display, { color: ollie.textPrimary }]}>
        {formatTimerDisplay(elapsed)}
      </Text>
      <View style={styles.controls}>
        <Pressable
          style={[styles.btn, { backgroundColor: ollie.bgSecondary }]}
          onPress={onReset}
        >
          <Text style={[styles.btnText, { color: ollie.textSecondary }]}>Reset</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: isRunning ? ollie.bgSecondary : color }]}
          onPress={isRunning ? onStop : onStart}
        >
          <Text style={[styles.btnText, { color: isRunning ? ollie.textSecondary : '#FFFFFF' }]}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  display: {
    fontSize: 48,
    fontFamily: 'Nunito_800ExtraBold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

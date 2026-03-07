import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/src/theme';
import { APP_VERSION } from '@/src/constants/version';

export function VersionBadge() {
  const { ollie } = useAppTheme();

  return (
    <Text style={[styles.version, { color: ollie.textLight }]}>
      v{APP_VERSION}
    </Text>
  );
}

const styles = StyleSheet.create({
  version: {
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 12,
    fontFamily: 'Nunito_400Regular',
  },
});

import React, { createContext, useContext, useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { palettes } from './palettes';
import { createPaperTheme, OllieTheme } from './paperTheme';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { ThemeName } from '@/src/types';

export function useOlliePaperTheme(): OllieTheme {
  const themeName = useSettingsStore((s) => s.theme);
  return useMemo(() => createPaperTheme(palettes[themeName]), [themeName]);
}

export function useAppTheme(): OllieTheme {
  return useTheme<OllieTheme>();
}

export { palettes } from './palettes';
export { createPaperTheme } from './paperTheme';
export type { OllieTheme } from './paperTheme';

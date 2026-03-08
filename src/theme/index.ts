import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { palettes } from './palettes';
import { createPaperTheme, OllieTheme } from './paperTheme';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useBabyStore } from '@/src/stores/useBabyStore';
import { ThemeName } from '@/src/types';

const DARK_THEMES: ThemeName[] = ['dark', 'midnight'];

export function useOlliePaperTheme(): OllieTheme {
  const globalTheme = useSettingsStore((s) => s.theme);
  const babyTheme = useBabyStore((s) => s.activeBaby?.theme);
  const themeName = babyTheme ?? globalTheme;
  return useMemo(() => createPaperTheme(palettes[themeName]), [themeName]);
}

export function useAppTheme(): OllieTheme {
  return useTheme<OllieTheme>();
}

export function useIsDarkTheme(): boolean {
  const globalTheme = useSettingsStore((s) => s.theme);
  const babyTheme = useBabyStore((s) => s.activeBaby?.theme);
  const themeName = babyTheme ?? globalTheme;
  return DARK_THEMES.includes(themeName);
}

export { palettes } from './palettes';
export { createPaperTheme } from './paperTheme';
export type { OllieTheme } from './paperTheme';

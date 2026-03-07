import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { OlliePalette } from '@/src/types';

const fontConfig = {
  fontFamily: 'Nunito_400Regular',
};

export interface OllieTheme extends MD3Theme {
  ollie: OlliePalette;
}

export function createPaperTheme(palette: OlliePalette): OllieTheme {
  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: palette.accent,
      onPrimary: '#FFFFFF',
      primaryContainer: palette.accentLight,
      onPrimaryContainer: palette.textPrimary,
      background: palette.bg,
      onBackground: palette.textPrimary,
      surface: palette.bgCard,
      onSurface: palette.textPrimary,
      surfaceVariant: palette.bgSecondary,
      onSurfaceVariant: palette.textSecondary,
      outline: palette.border,
      outlineVariant: palette.border,
    },
    roundness: palette.radiusSm,
    fonts: configureFonts({ config: fontConfig }),
    ollie: palette,
  };
}

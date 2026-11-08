'use client';

import { useTheme } from 'next-themes';

export function useThemeMode() {
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme();
  return { theme, resolvedTheme, systemTheme, isDark: resolvedTheme === 'dark', setTheme };
}

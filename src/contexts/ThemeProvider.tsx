'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { env } from '@/config/env';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme={env.defaultTheme} enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}

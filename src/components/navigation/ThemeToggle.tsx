'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = resolvedTheme === 'dark';
  return <button type="button" aria-label={mounted ? (isDark ? 'Activar modo claro' : 'Activar modo oscuro') : 'Cambiar tema'} disabled={!mounted} onClick={() => setTheme(isDark ? 'light' : 'dark')} className="group inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 transition-all duration-200 hover:border-violet-300 hover:text-violet-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-violet-300">
    {mounted && (isDark ? <Sun size={18} className="transition-transform duration-300 motion-safe:group-hover:rotate-45" /> : <Moon size={18} className="transition-transform duration-300 motion-safe:group-hover:-rotate-12" />)}
  </button>;
}

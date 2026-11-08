const toBoolean = (value: string | undefined, fallback = false) => value === undefined ? fallback : value === 'true';

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'StreamFlow',
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api').replace(/\/$/, ''),
  defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME ?? 'dark',
  useMocks: toBoolean(process.env.NEXT_PUBLIC_USE_MOCKS, true),
} as const;

const available = () => typeof window !== 'undefined';

export const storageService = {
  get<T>(key: string): T | null {
    if (!available()) return null;
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : null; } catch { return null; }
  },
  set<T>(key: string, value: T) { if (available()) localStorage.setItem(key, JSON.stringify(value)); },
  remove(key: string) { if (available()) localStorage.removeItem(key); },
};

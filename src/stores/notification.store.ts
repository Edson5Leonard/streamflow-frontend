import { create } from 'zustand';

export type AppNotification = { id: string; title: string; description?: string; createdAt: number };
type NotificationState = { notifications: AppNotification[]; add: (item: Omit<AppNotification, 'id' | 'createdAt'>) => void; remove: (id: string) => void; clear: () => void };
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (item) => set((state) => ({ notifications: [...state.notifications, { ...item, id: crypto.randomUUID(), createdAt: Date.now() }] })),
  remove: (id) => set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
  clear: () => set({ notifications: [] }),
}));

import { create } from 'zustand';
import type { Session } from '../types/auth.types';
type AuthState = { session: Session | null; setSession: (session: Session | null) => void; clearSession: () => void };
export const useAuthStore = create<AuthState>((set) => ({ session: null, setSession: (session) => set({ session }), clearSession: () => set({ session: null }) }));

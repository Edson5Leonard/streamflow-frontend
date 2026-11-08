'use client';

import Cookies from 'js-cookie';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { handleLogout } from '@/lib/auth';
import type { UserRole } from '@/constants/roles.constants';

type AuthContextValue = { isAuthenticated: boolean; role: UserRole | null; userId: string | null; distributorId: string | null; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(() => {
    const role = Cookies.get('role')?.replace(/^ROLE_/, '') as UserRole | undefined;
    const token = Cookies.get('token');
    return {
      isAuthenticated: Boolean(token), role: role ?? null,
      userId: Cookies.get('usuarioId') ?? null,
      distributorId: Cookies.get('distribuidorId') ?? null,
      logout: handleLogout,
    };
  }, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return value;
}

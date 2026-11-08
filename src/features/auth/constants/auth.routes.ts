import type { UserRole } from '../types/auth.types';

export const AUTH_ROUTES = { login: '/login', register: '/registro', home: '/' } as const;
export const ROLE_DASHBOARD: Record<UserRole, string> = { COMPRADOR: '/dashboard', DISTRIBUIDOR: '/admin', SUPER_ADMIN: '/superadmin' };
export function authUrl(path: string, distributorId?: string) { return distributorId ? `${path}?distribuidorId=${encodeURIComponent(distributorId)}` : path; }

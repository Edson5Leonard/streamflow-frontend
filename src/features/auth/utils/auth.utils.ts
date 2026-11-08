import type { UserRole } from '../types/auth.types';
export const normalizeRole = (role: string): UserRole => role.replace(/^ROLE_/, '') as UserRole;

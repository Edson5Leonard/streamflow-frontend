import type { UserRole } from '@/constants/roles.constants';

export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: '/superadmin',
  DISTRIBUIDOR: '/admin',
  COMPRADOR: '/dashboard',
};

export function canAccessRole(role: string | null | undefined, allowed: UserRole[]) {
  return role != null && allowed.includes(role.replace(/^ROLE_/, '') as UserRole);
}

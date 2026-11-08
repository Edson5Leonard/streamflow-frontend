export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DISTRIBUIDOR: 'DISTRIBUIDOR',
  COMPRADOR: 'COMPRADOR',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

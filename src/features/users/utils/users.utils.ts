import type { User } from '../types/users.types';
export const getUserDisplayName = (user: User) => user.nombreCompleto || user.correo;

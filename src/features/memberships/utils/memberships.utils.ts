import type { Membership } from '../types/memberships.types';
export const getPendingMemberships = (items: Membership[]) => items.filter((item) => item.estado === 'PENDIENTE');

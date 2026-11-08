import type { Account } from '../types/accounts.types';
export const countAvailableAccounts = (items: Account[]) => items.filter((item) => item.estado === 'DISPONIBLE').length;

import { fetchApi } from '@/lib/api';
import type { Account, AccountInput, AccountScope, AccountUpdate, AvailableAccount } from '../types/accounts.types';
const base = (scope: AccountScope) => scope === 'global' ? '/cuentas/global' : '/cuentas';
export const accountsApi = {
  list: () => fetchApi<Account[]>('/cuentas'),
  listGlobal: () => fetchApi<Account[]>('/cuentas/global'),
  listAvailable: () => fetchApi<AvailableAccount[]>('/cuentas/disponibles'),
  create: (scope: AccountScope, input: AccountInput) => fetchApi<Account>(base(scope), { method: 'POST', body: JSON.stringify(input) }),
  update: (scope: AccountScope, id: string, input: AccountUpdate) => fetchApi<Account>(`${base(scope)}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) }),
  remove: (scope: AccountScope, id: string) => fetchApi<void>(`${base(scope)}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

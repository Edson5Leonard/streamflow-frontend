import { fetchApi } from '@/lib/api';
import type { Account, AccountInput, AccountScope, AccountUpdate, AvailableAccount } from '../types/accounts.types';
const base = (scope: AccountScope) => scope === 'global' ? '/cuentas/global' : '/cuentas';
const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
  const str = sp.toString();
  return str ? `?${str}` : '';
};
export const accountsApi = {
  list: () => fetchApi<Account[]>('/cuentas'),
  listGlobal: () => fetchApi<Account[]>('/cuentas/global'),
  listAvailable: () => fetchApi<AvailableAccount[]>('/cuentas/disponibles'),
  create: (scope: AccountScope, input: AccountInput) => fetchApi<Account>(base(scope), { method: 'POST', body: JSON.stringify(input) }),
  update: (scope: AccountScope, id: string, input: AccountUpdate) => fetchApi<Account>(`${base(scope)}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) }),
  remove: (scope: AccountScope, id: string) => fetchApi<void>(`${base(scope)}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  filter: (params: { servicioId?: string; estado?: string; desde?: string; hasta?: string; page?: number; size?: number } = {}) =>
    fetchApi<{ cuentas: unknown[]; total: number; resumen: { disponibles: number; vendidas: number; expiradas: number } }>(`/cuentas-stock/filtrar${qs(params)}`),
  importCsv: (servicioId: string, file: File) => {
    const form = new FormData();
    form.set('servicioId', servicioId);
    form.set('file', file);
    return fetchApi<{ importadas: number; errores: number; detalleErrores: { fila: number; motivo: string }[] }>('/cuentas-stock/importar', { method: 'POST', body: form });
  },
  alerts: (umbral = 5) => fetchApi<{ alertas: unknown[] }>(`/cuentas-stock/alertas?umbral=${umbral}`),
  configureAlert: (input: { servicioId: string; umbralMinimo: number; notificarWhatsapp: boolean; notificarEmail: boolean }) =>
    fetchApi<unknown>('/cuentas-stock/alertas/configuracion', { method: 'PUT', body: JSON.stringify(input) }),
  movements: (params: { servicioId?: string; tipo?: string; desde?: string; page?: number; size?: number } = {}) =>
    fetchApi<{ movimientos: unknown[]; total: number }>(`/cuentas-stock/movimientos${qs(params)}`),
  transfer: (input: { cuentaIds: string[]; distribuidorDestinoId: string; motivo?: string }) =>
    fetchApi<{ transferidas: number; mensaje: string }>('/cuentas-stock/transferir', { method: 'POST', body: JSON.stringify(input) }),
};

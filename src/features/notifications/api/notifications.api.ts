import { fetchApi } from '@/lib/api';

export const notificationsApi = {
  list: (params: { page?: number; size?: number; leidas?: boolean } = {}) => {
    const sp = new URLSearchParams();
    if (params.page !== undefined) sp.set('page', String(params.page));
    if (params.size !== undefined) sp.set('size', String(params.size));
    if (params.leidas !== undefined) sp.set('leidas', String(params.leidas));
    const q = sp.toString();
    return fetchApi<{ notificaciones: unknown[]; noLeidas: number }>(`/notificaciones${q ? `?${q}` : ''}`);
  },
  markRead: (input: { ids?: string[]; todasLeidas?: boolean }) =>
    fetchApi<{ actualizadas: number }>('/notificaciones/leer', { method: 'PATCH', body: JSON.stringify(input) }),
  getPreferences: () => fetchApi<Record<string, unknown>>('/notificaciones/preferencias'),
  updatePreferences: (input: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>('/notificaciones/preferencias', { method: 'PUT', body: JSON.stringify(input) }),
};

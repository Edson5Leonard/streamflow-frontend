import { fetchApi } from '@/lib/api';
import type { AuditEvent } from '../types/audit.types';
export const auditApi = {
  listObservedClaims: () => fetchApi<AuditEvent[]>('/reclamos/observados'),
  discard: (id: string) => fetchApi<AuditEvent>(`/reclamos/${encodeURIComponent(id)}/descartar`, { method: 'PUT' }),
  compensate: (id: string) => fetchApi<AuditEvent>(`/reclamos/${encodeURIComponent(id)}/compensar`, { method: 'PUT' }),
  recover: (id: string, nuevaClave: string) => fetchApi<AuditEvent>(`/reclamos/${encodeURIComponent(id)}/recuperar`, { method: 'PUT', body: JSON.stringify({ nuevaClave }) }),
  listLogs: (params: { accion?: string; usuarioId?: string; desde?: string; hasta?: string; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ registros: unknown[]; total: number }>(`/auditoria${q ? `?${q}` : ''}`);
  },
  loginHistory: (params: { usuarioId?: string; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ registros: unknown[] }>(`/auditoria/login-history${q ? `?${q}` : ''}`);
  },
  securityEvents: () => fetchApi<{ eventosRecientes: unknown[] }>('/auditoria/seguridad'),
};

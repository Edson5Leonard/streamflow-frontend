import { fetchApi } from '@/lib/api';
import type { AuditEvent } from '../types/audit.types';
export const auditApi = {
  listObservedClaims: () => fetchApi<AuditEvent[]>('/reclamos/observados'),
  discard: (id: string) => fetchApi<AuditEvent>(`/reclamos/${encodeURIComponent(id)}/descartar`, { method: 'PUT' }),
  recover: (id: string, nuevaClave: string) => fetchApi<AuditEvent>(`/reclamos/${encodeURIComponent(id)}/recuperar`, { method: 'PUT', body: JSON.stringify({ nuevaClave }) }),
};

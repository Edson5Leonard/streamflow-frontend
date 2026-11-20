import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { AutoGuaranteeResult, Claim, ClaimInput, ClaimStatusUpdate, PublicClaimInput, ReplacementInput } from '../types/claims.types';
export const claimsApi = {
  listPending: () => fetchApi<Claim[]>('/reclamos/pendientes'),
  listObserved: () => fetchApi<Claim[]>('/reclamos/observados'),
  listMine: () => fetchApi<Array<{
    id: string;
    ventaId: string;
    servicio?: string;
    categoriaFallo: string;
    motivo: string;
    estado: string;
    fechaCreacion: string;
    reemplazo?: { correo: string; password: string; perfilPin: string | null };
  }>>('/reclamos/mis-reclamos'),
  async create(input: ClaimInput) { const file = new FormData(); file.append('archivo', input.archivo); const { url } = await fetchApi<{ url: string }>('/reclamos/evidencia', { method: 'POST', body: file }); return fetchApi<AutoGuaranteeResult>('/reclamos/auto-garantia', { method: 'POST', body: JSON.stringify({ ventaId: input.ventaId, categoriaFallo: input.categoriaFallo, motivo: input.motivo, comprobanteFalloUrl: url }) }); },
  createPublic(input: PublicClaimInput) { const form = new FormData(); Object.entries(input).forEach(([key, value]) => form.append(key, value)); return fetchApi<AutoGuaranteeResult>('/reclamos/auto-garantia/publica', { method: 'POST', body: form }); },
  updateStatus: ({ id, estado }: ClaimStatusUpdate) => fetchApi<Claim>(`/reclamos/${encodeURIComponent(id)}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  replace: (input: ReplacementInput) => fetchApi<Claim>('/reclamos/express', { method: 'POST', body: JSON.stringify(input) }),
  evidence: (name: string) => fetchApiBlob(`/reclamos/comprobantes/${encodeURIComponent(name)}`),
  filter: (params: { estado?: string; servicioId?: string; desde?: string; hasta?: string; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ reclamos: unknown[]; total: number }>(`/reclamos/filtrar${q ? `?${q}` : ''}`);
  },
  statistics: (params: { desde?: string; hasta?: string } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<Record<string, unknown>>(`/reclamos/estadisticas${q ? `?${q}` : ''}`);
  },
  resolutionMetrics: (params: { distribuidorId?: string; desde?: string; hasta?: string } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<Record<string, unknown>>(`/reclamos/metricas-resolucion${q ? `?${q}` : ''}`);
  },
  exportCsv: (params: { desde?: string; hasta?: string } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApiBlob(`/reclamos/exportar${q ? `?${q}` : ''}`);
  },
};

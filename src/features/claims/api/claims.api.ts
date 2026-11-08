import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { Claim, ClaimInput, ClaimStatusUpdate, PublicClaimInput, ReplacementInput } from '../types/claims.types';
export const claimsApi = {
  listPending: () => fetchApi<Claim[]>('/reclamos/pendientes'),
  listObserved: () => fetchApi<Claim[]>('/reclamos/observados'),
  async create(input: ClaimInput) { const file = new FormData(); file.append('archivo', input.archivo); const { url } = await fetchApi<{ url: string }>('/reclamos/evidencia', { method: 'POST', body: file }); return fetchApi<Claim>('/reclamos', { method: 'POST', body: JSON.stringify({ ventaId: input.ventaId, categoriaFallo: input.categoriaFallo, motivo: input.motivo, comprobanteFalloUrl: url }) }); },
  createPublic(input: PublicClaimInput) { const form = new FormData(); Object.entries(input).forEach(([key, value]) => form.append(key, value)); return fetchApi<Claim>('/reclamos/publica', { method: 'POST', body: form }); },
  updateStatus: ({ id, estado }: ClaimStatusUpdate) => fetchApi<Claim>(`/reclamos/${encodeURIComponent(id)}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  replace: (input: ReplacementInput) => fetchApi<Claim>('/reclamos/express', { method: 'POST', body: JSON.stringify(input) }),
  evidence: (name: string) => fetchApiBlob(`/reclamos/comprobantes/${encodeURIComponent(name)}`),
};

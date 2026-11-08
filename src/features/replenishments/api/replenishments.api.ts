import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { Replenishment, ReplenishmentInput, ReplenishmentPayment } from '../types/replenishments.types';
export const replenishmentsApi = {
  listMine: () => fetchApi<Replenishment[]>('/reposiciones/mias'),
  list: () => fetchApi<Replenishment[]>('/reposiciones'),
  create: (input: ReplenishmentInput) => fetchApi<Replenishment>('/reposiciones', { method: 'POST', body: JSON.stringify(input) }),
  pay: ({ id, metodoPago, codigoOperacion, comprobante }: ReplenishmentPayment) => { const data = new FormData(); data.append('metodoPago', metodoPago); if (codigoOperacion) data.append('codigoOperacion', codigoOperacion); data.append('comprobante', comprobante); return fetchApi<Replenishment>(`/reposiciones/${encodeURIComponent(id)}/pago`, { method: 'POST', body: data }); },
  approve: (id: string) => fetchApi<Replenishment>(`/reposiciones/${encodeURIComponent(id)}/aprobar-pago`, { method: 'PATCH' }),
  fulfill: (id: string, nota?: string) => fetchApi<Replenishment>(`/reposiciones/${encodeURIComponent(id)}/atender`, { method: 'PATCH', body: JSON.stringify({ nota: nota ?? '' }) }),
  reject: (id: string, nota?: string) => fetchApi<Replenishment>(`/reposiciones/${encodeURIComponent(id)}/rechazar`, { method: 'PATCH', body: JSON.stringify({ nota: nota ?? '' }) }),
  voucher: (id: string) => fetchApiBlob(`/reposiciones/${encodeURIComponent(id)}/comprobante`),
};

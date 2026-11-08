import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { Membership, MembershipPaymentInput } from '../types/memberships.types';
export const membershipsApi = {
  listMine: () => fetchApi<Membership[]>('/membresias/mis-pagos'),
  listPending: () => fetchApi<Membership[]>('/membresias/pendientes'),
  create: ({ metodoPago, codigoOperacion, comprobante }: MembershipPaymentInput) => { const data = new FormData(); data.append('metodoPago', metodoPago); if (codigoOperacion) data.append('codigoOperacion', codigoOperacion); data.append('comprobante', comprobante); return fetchApi<Membership>('/membresias/solicitar', { method: 'POST', body: data }); },
  approve: (id: string) => fetchApi<Membership>(`/membresias/${encodeURIComponent(id)}/aprobar`, { method: 'PUT' }),
  reject: (id: string, motivo: string) => fetchApi<Membership>(`/membresias/${encodeURIComponent(id)}/rechazar`, { method: 'PUT', body: JSON.stringify({ motivo }) }),
  voucher: (name: string) => fetchApiBlob(`/membresias/comprobantes/${encodeURIComponent(name)}`),
};

import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { BuyerOrder, CartPaymentRequest, Payment, PaymentRequest, PaymentSubmission, PaymentTracking, PublicPaymentRequest } from '../types/payments.types';

function toFormData(input: PaymentRequest | PublicPaymentRequest) {
  const data = new FormData();
  Object.entries(input).forEach(([key, value]) => { if (value !== undefined && value !== '') data.append(key, value); });
  return data;
}
export const paymentsApi = {
  list: (distribuidorId: string) => fetchApi<Payment[]>(`/pagos/distribuidor?distribuidorId=${encodeURIComponent(distribuidorId)}`),
  listMyOrders: () => fetchApi<BuyerOrder[]>('/pagos/mis-pedidos'),
  get: (id: string) => fetchApi<Payment>(`/pagos/${encodeURIComponent(id)}`),
  track: (id: string, token: string) => fetchApi<PaymentTracking>(`/pagos/publico/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`),
  create: (input: PaymentRequest) => fetchApi<Payment>('/pagos', { method: 'POST', body: toFormData(input) }),
  createPublic: (input: PublicPaymentRequest) => fetchApi<PaymentSubmission>('/pagos/solicitar', { method: 'POST', body: toFormData(input) }),
  createCart: (input: CartPaymentRequest) => { const { servicioIds, ...rest } = input; const data = new FormData(); Object.entries(rest).forEach(([key, value]) => { if (value !== undefined && value !== '') data.append(key, value); }); servicioIds.forEach((id) => data.append('servicioIds', id)); return fetchApi<PaymentSubmission[]>('/pagos/solicitar-carrito', { method: 'POST', body: data }); },
  approve: (id: string) => fetchApi<Payment>(`/pagos/${encodeURIComponent(id)}/aprobar`, { method: 'PUT' }),
  reject: (id: string, motivo: string) => fetchApi<Payment>(`/pagos/${encodeURIComponent(id)}/rechazar`, { method: 'PUT', body: JSON.stringify({ motivo }) }),
  getVoucher: (name: string) => fetchApiBlob(`/pagos/comprobantes/${encodeURIComponent(name)}`),
  listAllAdmin: (params: { estado?: string; distribuidorId?: string; desde?: string; hasta?: string; metodoPago?: string; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ pagos: unknown[]; total: number; montoTotal: number }>(`/pagos${q ? `?${q}` : ''}`);
  },
  cancel: (id: string, motivo?: string) => fetchApi<{ id: string; estado: string; mensaje: string }>(`/pagos/${encodeURIComponent(id)}/cancelar`, {
    method: 'PATCH',
    body: JSON.stringify({ motivo: motivo ?? '' }),
  }),
  refund: (id: string, input: { monto: number; motivo: string; metodoPago?: string; referencia?: string }) =>
    fetchApi<{ reembolsoId: string; pagoId: string; monto: number; estado: string; creadoEn: string }>(`/pagos/${encodeURIComponent(id)}/reembolso`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  listMyHistory: (params: { desde?: string; hasta?: string; estado?: string; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ pedidos: unknown[]; montoTotal: number; total: number }>(`/pagos/mis-pedidos/historial${q ? `?${q}` : ''}`);
  },
};

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
};

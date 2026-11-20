import { fetchApi } from '@/lib/api';
import { saleSchema, purchaseSchema } from '../schemas/sale.schema';
export const salesApi = {
  async list() { return saleSchema.array().parse(await fetchApi<unknown>('/ventas')); },
  async listMyPurchases() { return purchaseSchema.array().parse(await fetchApi<unknown>('/ventas/mis-compras')); },
  async getByPayment(paymentId: string) { return purchaseSchema.parse(await fetchApi<unknown>(`/ventas/pago/${encodeURIComponent(paymentId)}`)); },
  filter: (params: { desde?: string; hasta?: string; servicioId?: string; compradorId?: string; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ ventas: unknown[]; total: number; montoTotal: number }>(`/ventas/filtrar${q ? `?${q}` : ''}`);
  },
};

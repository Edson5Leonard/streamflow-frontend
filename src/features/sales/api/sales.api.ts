import { fetchApi } from '@/lib/api';
import { saleSchema, purchaseSchema } from '../schemas/sale.schema';
export const salesApi = {
  async list() { return saleSchema.array().parse(await fetchApi<unknown>('/ventas')); },
  async listMyPurchases() { return purchaseSchema.array().parse(await fetchApi<unknown>('/ventas/mis-compras')); },
  async getByPayment(paymentId: string) { return purchaseSchema.parse(await fetchApi<unknown>(`/ventas/pago/${encodeURIComponent(paymentId)}`)); },
};

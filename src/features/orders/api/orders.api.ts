import { fetchApi } from '@/lib/api';
import type { DistributorOrder, OrderApproval, OrderWhatsAppLink } from '../types/orders.types';

export const ordersApi = {
  list: () => fetchApi<DistributorOrder[]>('/pedidos/distribuidor'),
  approve: (id: string) => fetchApi<OrderApproval>(`/pedidos/${encodeURIComponent(id)}/aprobar`, { method: 'PUT' }),
  reject: (id: string, motivo: string) => fetchApi<unknown>(`/pedidos/${encodeURIComponent(id)}/rechazar`, {
    method: 'PUT',
    body: JSON.stringify({ motivo }),
  }),
  regeneratePin: (id: string) => fetchApi<OrderApproval>(`/pedidos/${encodeURIComponent(id)}/pin-temporal`, { method: 'POST' }),
  createWhatsAppLink: (id: string, pinTemporal?: string) => fetchApi<OrderWhatsAppLink>(
    `/pedidos/${encodeURIComponent(id)}/whatsapp`,
    { method: 'POST', body: JSON.stringify({ pinTemporal: pinTemporal || null }) },
  ),
  markDelivered: (id: string) => fetchApi<unknown>(`/pedidos/${encodeURIComponent(id)}/entregado`, { method: 'PUT' }),
};

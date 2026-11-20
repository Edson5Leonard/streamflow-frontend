import { fetchApi } from '@/lib/api';
import { serviceResponseSchema } from '../schemas/service.schema';
import type { CreateServiceInput, UpdateServiceMinimumPriceInput, UpdateServicePriceInput } from '../types/services.types';

export const servicesApi = {
  async list() { return serviceResponseSchema.array().parse(await fetchApi<unknown>('/servicios')); },
  async listActive() { return serviceResponseSchema.array().parse(await fetchApi<unknown>('/servicios/activos')); },
  async create(input: CreateServiceInput) { return serviceResponseSchema.parse(await fetchApi<unknown>('/servicios', { method: 'POST', body: JSON.stringify(input) })); },
  async updatePrice({ id, precioReposicion }: UpdateServicePriceInput) { return serviceResponseSchema.parse(await fetchApi<unknown>(`/servicios/${encodeURIComponent(id)}/precio-reposicion`, { method: 'PATCH', body: JSON.stringify({ precioReposicion }) })); },
  async updateMinimumPrice({ id, precioMinimoVenta }: UpdateServiceMinimumPriceInput) { return serviceResponseSchema.parse(await fetchApi<unknown>(`/servicios/${encodeURIComponent(id)}/precio-minimo-venta`, { method: 'PATCH', body: JSON.stringify({ precioMinimoVenta }) })); },
  search: (params: { q?: string; activo?: boolean; precioMin?: number; precioMax?: number; page?: number; size?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<{ resultados: unknown[]; total: number }>(`/servicios/buscar${q ? `?${q}` : ''}`);
  },
};

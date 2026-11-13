import { fetchApi } from '@/lib/api';
import { serviceResponseSchema } from '../schemas/service.schema';
import type { CreateServiceInput, UpdateServiceMinimumPriceInput, UpdateServicePriceInput } from '../types/services.types';

export const servicesApi = {
  async list() { return serviceResponseSchema.array().parse(await fetchApi<unknown>('/servicios')); },
  async listActive() { return serviceResponseSchema.array().parse(await fetchApi<unknown>('/servicios/activos')); },
  async create(input: CreateServiceInput) { return serviceResponseSchema.parse(await fetchApi<unknown>('/servicios', { method: 'POST', body: JSON.stringify(input) })); },
  async updatePrice({ id, precioReposicion }: UpdateServicePriceInput) { return serviceResponseSchema.parse(await fetchApi<unknown>(`/servicios/${encodeURIComponent(id)}/precio-reposicion`, { method: 'PATCH', body: JSON.stringify({ precioReposicion }) })); },
  async updateMinimumPrice({ id, precioMinimoVenta }: UpdateServiceMinimumPriceInput) { return serviceResponseSchema.parse(await fetchApi<unknown>(`/servicios/${encodeURIComponent(id)}/precio-minimo-venta`, { method: 'PATCH', body: JSON.stringify({ precioMinimoVenta }) })); },
};

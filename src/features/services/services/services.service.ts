import { env } from '@/config/env';
import { servicesApi } from '../api/services.api';
import { servicesMock } from '../mocks/services.mock';
import { serviceSchema, serviceResponseSchema, updateServicePriceSchema } from '../schemas/service.schema';
import type { CreateServiceInput, Service, UpdateServicePriceInput } from '../types/services.types';

const storageKey = 'streamflow:mock-services:v1';
function readServices(): Service[] {
  if (typeof window === 'undefined') return structuredClone(servicesMock);
  try { const raw = localStorage.getItem(storageKey); if (raw) { const result = serviceResponseSchema.array().safeParse(JSON.parse(raw)); if (result.success) return result.data; } } catch { /* invalid saved data uses the seed */ }
  return structuredClone(servicesMock);
}
function saveServices(items: Service[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }
export const servicesService = {
  async list() { return env.useMocks ? readServices() : servicesApi.list(); },
  async listActive() { return env.useMocks ? readServices().filter((item) => item.activo) : servicesApi.listActive(); },
  async create(input: CreateServiceInput) {
    const valid = serviceSchema.parse(input);
    if (!env.useMocks) return servicesApi.create(valid);
    const items = readServices();
    const item: Service = { ...valid, id: crypto.randomUUID(), descripcion: valid.descripcion || null, precioReposicion: valid.precioReposicion ?? null };
    items.push(item); saveServices(items); return item;
  },
  async updatePrice(input: UpdateServicePriceInput) {
    const valid = updateServicePriceSchema.parse(input);
    if (!env.useMocks) return servicesApi.updatePrice(valid);
    const items = readServices(); const index = items.findIndex((item) => item.id === valid.id);
    if (index < 0) throw new Error('El servicio no existe.');
    items[index] = { ...items[index], precioReposicion: valid.precioReposicion }; saveServices(items); return items[index];
  },
};

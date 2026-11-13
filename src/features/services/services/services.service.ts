import { env } from '@/config/env';
import { servicesApi } from '../api/services.api';
import { servicesMock } from '../mocks/services.mock';
import { serviceInputSchema, serviceResponseSchema, updateServiceMinimumPriceSchema, updateServicePriceSchema } from '../schemas/service.schema';
import type { CreateServiceInput, Service, UpdateServiceMinimumPriceInput, UpdateServicePriceInput } from '../types/services.types';

const storageKey = 'streamflow:mock-services:v1';
const legacyPlanNames = new Set(['Netflix Premium', 'Netflix cuenta completa', 'Disney+ Standard', 'Disney+', 'Disney premium con ESPN', 'Max', 'Max (HBO)', 'Max estándar', 'MAX standar', 'Max Standard', 'Primevideo', 'Prime Video']);
function readServices(): Service[] {
  if (typeof window === 'undefined') return structuredClone(servicesMock);
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const result = serviceResponseSchema.array().safeParse(JSON.parse(raw));
      if (result.success) {
        const services = result.data;
        const knownIds = new Set(services.map((item) => item.id));
        let changed = false;
        for (const service of services) {
          if (service.activo && legacyPlanNames.has(service.nombre)) {
            service.activo = false;
            changed = true;
          }
        }
        for (const seed of servicesMock) {
          if (seed.claveCatalogo && !knownIds.has(seed.id)) {
            services.push(structuredClone(seed));
            changed = true;
          }
        }
        if (changed) saveServices(services);
        return services;
      }
    }
  } catch { /* invalid saved data uses the seed */ }
  return structuredClone(servicesMock);
}
function saveServices(items: Service[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }
export const servicesService = {
  async list() { return env.useMocks ? readServices() : servicesApi.list(); },
  async listActive() { return env.useMocks ? readServices().filter((item) => item.activo) : servicesApi.listActive(); },
  async create(input: CreateServiceInput) {
    const valid = serviceInputSchema.parse(input);
    if (!env.useMocks) return servicesApi.create(valid);
    const items = readServices();
    const item: Service = { ...valid, id: crypto.randomUUID(), descripcion: valid.descripcion || null, precioReposicion: valid.precioReposicion ?? null, claveCatalogo: null, plataforma: valid.plataforma ?? null, tipoPlan: valid.tipoPlan ?? null, cantidadDispositivos: valid.cantidadDispositivos ?? null, cantidadPerfiles: valid.cantidadPerfiles ?? null, duracionMeses: valid.duracionMeses ?? null, precioMinimoVenta: valid.precioMinimoVenta ?? null };
    items.push(item); saveServices(items); return item;
  },
  async updatePrice(input: UpdateServicePriceInput) {
    const valid = updateServicePriceSchema.parse(input);
    if (!env.useMocks) return servicesApi.updatePrice(valid);
    const items = readServices(); const index = items.findIndex((item) => item.id === valid.id);
    if (index < 0) throw new Error('El servicio no existe.');
    items[index] = { ...items[index], precioReposicion: valid.precioReposicion }; saveServices(items); return items[index];
  },
  async updateMinimumPrice(input: UpdateServiceMinimumPriceInput) {
    const valid = updateServiceMinimumPriceSchema.parse(input);
    if (!env.useMocks) return servicesApi.updateMinimumPrice(valid);
    const items = readServices(); const index = items.findIndex((item) => item.id === valid.id);
    if (index < 0) throw new Error('El servicio no existe.');
    items[index] = { ...items[index], precioMinimoVenta: valid.precioMinimoVenta }; saveServices(items); return items[index];
  },
};

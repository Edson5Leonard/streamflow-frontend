import { fetchApi } from '@/lib/api';
import { storeCatalogSchema, storesSchema } from '../schemas/store.schema';

export const storesApi = {
  async listAvailable() { return storesSchema.parse(await fetchApi<unknown>('/tiendas/disponibles')); },
  async getCatalog(distributorId: string) {
    return storeCatalogSchema.parse(await fetchApi<unknown>(`/tiendas/${encodeURIComponent(distributorId)}/catalogo`));
  },
};

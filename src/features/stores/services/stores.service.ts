import { env } from '@/config/env';
import { storesApi } from '../api/stores.api';
import { storeCatalogMocks, storesMock } from '../mocks/stores.mock';
import { storeIdSchema } from '../schemas/store.schema';
import type { Store, StoreCatalog } from '../types/stores.types';

export const storesService = {
  async listAvailable(): Promise<Store[]> {
    return env.useMocks ? structuredClone(storesMock) : storesApi.listAvailable();
  },
  async getCatalog(distributorId: string): Promise<StoreCatalog> {
    const id = storeIdSchema.parse(distributorId);
    if (!env.useMocks) return storesApi.getCatalog(id);
    const catalog = storeCatalogMocks[id];
    if (!catalog) throw new Error('La tienda no está disponible.');
    return structuredClone(catalog);
  },
};

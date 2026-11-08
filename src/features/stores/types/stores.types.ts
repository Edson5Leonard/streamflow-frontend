import { z } from 'zod';
import type { storeSchema, storeCatalogSchema, storeProductSchema } from '../schemas/store.schema';

export type Store = z.infer<typeof storeSchema>;
export type StoreProduct = z.infer<typeof storeProductSchema>;
export type StoreCatalog = z.infer<typeof storeCatalogSchema>;

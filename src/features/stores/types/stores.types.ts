import { z } from 'zod';
import type {
  adminStoreSchema,
  storeAuditSchema,
  storeCatalogSchema,
  storeManagementSchema,
  storePaymentMethodSchema,
  storeProductSchema,
  storeSchema,
} from '../schemas/store.schema';

export type Store = z.infer<typeof storeSchema>;
export type StoreProduct = z.infer<typeof storeProductSchema>;
export type StoreCatalog = z.infer<typeof storeCatalogSchema>;
export type StoreManagement = z.infer<typeof storeManagementSchema>;
export type StorePaymentMethod = z.infer<typeof storePaymentMethodSchema>;
export type StoreAudit = z.infer<typeof storeAuditSchema>;
export type AdminStore = z.infer<typeof adminStoreSchema>;

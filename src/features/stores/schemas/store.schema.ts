import { z } from 'zod';

export const storeIdSchema = z.string().uuid('Identificador de tienda inválido.');
export const storeSchema = z.object({ id: storeIdSchema, nombreTienda: z.string() });
export const storeProductSchema = z.object({
  servicioId: z.string().uuid(), nombre: z.string(), categoria: z.string(),
  descripcion: z.string().nullable(), precio: z.number().nonnegative(),
  stockDisponible: z.number().int().nonnegative(),
});
export const storeCatalogSchema = z.object({
  nombreTienda: z.string(), whatsapp: z.string().nullable(), productos: z.array(storeProductSchema),
});
export const storesSchema = z.array(storeSchema);

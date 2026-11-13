import { z } from 'zod';

export const storeIdSchema = z.string().uuid('Identificador de tienda inválido.');
export const storeSchema = z.object({ id: storeIdSchema, nombreTienda: z.string() });
export const storePaymentMethodSchema = z.object({
  metodo: z.enum(['YAPE', 'PLIN', 'BCP', 'INTERBANK', 'INTERNACIONAL']),
  imagenQrUrl: z.string().nullable(),
  numeroCuenta: z.string().nullable(),
  cci: z.string().nullable(),
  titular: z.string().nullable(),
  activo: z.boolean(),
});
export const storeProductSchema = z.object({
  servicioId: z.string().uuid(), nombre: z.string(), categoria: z.string(),
  descripcion: z.string().nullable(), precio: z.number().nonnegative(),
  stockDisponible: z.number().int().nonnegative(),
  plataforma: z.string().nullable().default(null),
  tipoPlan: z.enum(['COMPLETA', 'PERFIL']).nullable().default(null),
  cantidadDispositivos: z.number().int().nullable().default(null),
  cantidadPerfiles: z.number().int().nullable().default(null),
  duracionMeses: z.number().int().nullable().default(null),
  imagenUrl: z.string().nullable().default(null),
});
export const storeCatalogSchema = z.object({
  nombreTienda: z.string(),
  whatsapp: z.string().nullable(),
  productos: z.array(storeProductSchema),
  descripcion: z.string().nullable().default(null),
  logoUrl: z.string().nullable().default(null),
  metodosPago: z.array(storePaymentMethodSchema).default([]),
});
export const storeManagementSchema = z.object({
  nombreTienda: z.string(),
  descripcion: z.string().nullable(),
  logoUrl: z.string().nullable(),
  whatsapp: z.string().nullable(),
  productos: z.array(storeProductSchema),
  metodosPago: z.array(storePaymentMethodSchema),
});
export const storeAuditSchema = z.object({
  id: z.string().uuid(),
  distribuidorId: z.string().uuid(),
  actorId: z.string().uuid(),
  campo: z.string(),
  valorAnterior: z.string().nullable(),
  valorNuevo: z.string().nullable(),
  fecha: z.string(),
});
export const adminStoreSchema = z.object({
  distribuidorId: z.string().uuid(),
  nombreDistribuidor: z.string(),
  correoDistribuidor: z.string(),
  activa: z.boolean(),
  membresiaHasta: z.string().nullable(),
  nombreTienda: z.string(),
  descripcion: z.string().nullable(),
  logoUrl: z.string().nullable(),
  whatsapp: z.string().nullable(),
});
export const storesSchema = z.array(storeSchema);

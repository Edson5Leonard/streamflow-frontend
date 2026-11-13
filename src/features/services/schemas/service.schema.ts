import { z } from 'zod';

export const serviceSchema = z.object({ nombre: z.string().trim().min(2, 'Ingresa al menos 2 caracteres.'), categoria: z.string().trim().min(1, 'Ingresa una categoría.'), descripcion: z.string().trim().max(255).optional(), precioMayorista: z.number().nonnegative('El precio no puede ser negativo.'), precioReposicion: z.number().positive('El precio debe ser mayor a cero.').nullable().optional(), activo: z.boolean() });
export const serviceResponseSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  categoria: z.string(),
  descripcion: z.string().nullable(),
  precioMayorista: z.number(),
  precioReposicion: z.number().nullable(),
  claveCatalogo: z.string().nullable().default(null),
  plataforma: z.string().nullable().default(null),
  tipoPlan: z.enum(['COMPLETA', 'PERFIL']).nullable().default(null),
  cantidadDispositivos: z.number().int().nullable().default(null),
  cantidadPerfiles: z.number().int().nullable().default(null),
  duracionMeses: z.number().int().nullable().default(null),
  precioMinimoVenta: z.number().nullable().default(null),
  activo: z.boolean(),
});
export const updateServicePriceSchema = z.object({ id: z.string().uuid(), precioReposicion: z.number().positive('El precio debe ser mayor a cero.') });
export const updateServiceMinimumPriceSchema = z.object({ id: z.string().uuid(), precioMinimoVenta: z.number().nonnegative().nullable() });
export const serviceInputSchema = serviceSchema.extend({
  plataforma: z.string().trim().max(80).nullable().optional(),
  tipoPlan: z.enum(['COMPLETA', 'PERFIL']).nullable().optional(),
  cantidadDispositivos: z.number().int().positive().nullable().optional(),
  cantidadPerfiles: z.number().int().positive().nullable().optional(),
  duracionMeses: z.number().int().positive().nullable().optional(),
  precioMinimoVenta: z.number().nonnegative().nullable().optional(),
});
export type ServiceInput = z.infer<typeof serviceInputSchema>;

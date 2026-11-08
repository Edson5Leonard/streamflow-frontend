import { z } from 'zod';

export const serviceSchema = z.object({ nombre: z.string().trim().min(2, 'Ingresa al menos 2 caracteres.'), categoria: z.string().trim().min(1, 'Ingresa una categoría.'), descripcion: z.string().trim().max(255).optional(), precioMayorista: z.number().nonnegative('El precio no puede ser negativo.'), precioReposicion: z.number().positive('El precio debe ser mayor a cero.').nullable().optional(), activo: z.boolean() });
export const serviceResponseSchema = z.object({ id: z.string().uuid(), nombre: z.string(), categoria: z.string(), descripcion: z.string().nullable(), precioMayorista: z.number(), precioReposicion: z.number().nullable(), activo: z.boolean() });
export const updateServicePriceSchema = z.object({ id: z.string().uuid(), precioReposicion: z.number().positive('El precio debe ser mayor a cero.') });
export type ServiceInput = z.infer<typeof serviceSchema>;

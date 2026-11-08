import { z } from 'zod';
export const saleIdSchema = z.string().uuid();
export const saleSchema = z.object({ id: saleIdSchema, compradorId: saleIdSchema, cuentaStockId: saleIdSchema, precioPagado: z.number(), pagoId: saleIdSchema.nullable(), fechaVenta: z.string() });
export const purchaseSchema = z.object({ id: saleIdSchema, cuentaStockId: saleIdSchema, servicio: z.string(), correo: z.string(), password: z.string(), perfilPin: z.string().nullable(), precioPagado: z.number(), fechaVenta: z.string() });

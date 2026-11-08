import { z } from 'zod';
export const accountSchema = z.object({ servicioId: z.string().uuid('Selecciona un servicio.'), correo: z.string().trim().min(1, 'Ingresa el correo.').max(150), password: z.string().trim().min(1, 'Ingresa la contraseña.').max(100), perfilPin: z.string().trim().max(20).nullable().optional(), precioVenta: z.number().positive('El precio debe ser mayor a cero.').optional(), tipoStock: z.enum(['VENTA', 'GARANTIA']) });
export type AccountInput = z.infer<typeof accountSchema>;

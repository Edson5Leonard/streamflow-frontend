import { z } from 'zod';
export const userSchema = z.object({ nombreCompleto: z.string().trim().min(1, 'El nombre es obligatorio.').max(120), correo: z.email('Ingresa un correo válido.').max(150), whatsapp: z.string().trim().max(20).optional(), password: z.string().max(100).optional() });
export type UserInput = z.infer<typeof userSchema>;

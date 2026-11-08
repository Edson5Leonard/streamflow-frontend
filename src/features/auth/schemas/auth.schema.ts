import { z } from 'zod';
export const loginSchema = z.object({ correo: z.email('Ingresa un correo válido.'), password: z.string().min(1, 'La contraseña es obligatoria.') });
export const registerSchema = z.object({ nombreCompleto: z.string().trim().min(2), correo: z.email(), password: z.string().min(8), whatsapp: z.string().optional(), distribuidorId: z.string().uuid().optional() });
export type LoginFormValues = z.infer<typeof loginSchema>;

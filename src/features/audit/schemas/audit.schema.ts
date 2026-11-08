import { z } from 'zod';
export const auditActionSchema = z.enum(['descartar', 'recuperar']);
export const recoverAccountSchema = z.object({ id: z.string().uuid(), nuevaClave: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres.').max(100) });

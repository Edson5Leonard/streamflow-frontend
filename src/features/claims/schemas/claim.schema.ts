import { z } from 'zod';
const evidenceSchema = z.file().max(5 * 1024 * 1024, 'La evidencia no debe superar 5 MB.').mime(['image/png', 'image/jpeg', 'application/pdf'], 'Usa PNG, JPG o PDF.');
const fields = { categoriaFallo: z.string().trim().min(1, 'Selecciona una categoría.'), motivo: z.string().trim().min(1, 'Describe el problema.').max(500), archivo: evidenceSchema };
export const claimSchema = z.object({ ventaId: z.string().uuid(), ...fields });
export const publicClaimSchema = z.object({ pagoId: z.string().uuid(), token: z.string().uuid(), ...fields });
export const replacementSchema = z.object({ ventaId: z.string().uuid(), categoriaFallo: z.string().trim().min(1), motivo: z.string().trim().min(1).max(500), comprobanteFalloUrl: z.string().min(1) });

import { z } from 'zod';

export const uploadSchema = z.file().max(5 * 1024 * 1024, 'El archivo no debe superar 5 MB.').mime(['image/png', 'image/jpeg', 'application/pdf'], 'Usa una imagen PNG/JPG o un PDF.');

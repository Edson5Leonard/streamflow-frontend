import { z } from 'zod';

export const idSchema = z.string().trim().min(1, 'El identificador es obligatorio.');
export const nonEmptyStringSchema = z.string().trim().min(1, 'Este campo es obligatorio.');
export const emailSchema = z.email('Ingresa un correo válido.');

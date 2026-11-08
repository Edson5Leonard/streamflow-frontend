import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(value: string | Date, pattern = 'dd MMM yyyy') {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return isValid(date) ? format(date, pattern, { locale: es }) : 'Fecha no disponible';
}

'use client';

import { Calendar } from './calendar';

export function DatePicker({ value, onChange, placeholder, ...props }: Omit<React.ComponentProps<typeof Calendar>, 'value' | 'onChange'> & { value?: Date; onChange?: (value?: Date) => void; placeholder?: string }) {
  const formatted = value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : '';
  return <Calendar aria-label={placeholder ?? 'Seleccionar fecha'} value={formatted} onChange={(next) => onChange?.(next ? new Date(`${next}T00:00:00`) : undefined)} {...props} />;
}

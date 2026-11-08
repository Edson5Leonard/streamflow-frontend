'use client';

import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Calendar({ value, onChange, min, max, className, ...props }: Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange'> & { value?: string; onChange?: (value: string) => void; min?: string; max?: string }) {
  return <div className={`relative ${className ?? ''}`}><CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input type="date" value={value} min={min} max={max} onChange={(event) => onChange?.(event.target.value)} className="pl-9" {...props} /></div>;
}

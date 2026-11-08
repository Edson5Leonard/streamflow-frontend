import type { InputHTMLAttributes, ReactNode } from 'react';
import { Input } from '@/components/ui/input';

export function FormField({ id, label, description, error, required, ...inputProps }: InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string; error?: string; trailing?: ReactNode }) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return <div className="space-y-1.5"><label htmlFor={id} className="text-sm font-medium">{label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}</label><Input id={id} required={required} aria-invalid={Boolean(error)} aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined} {...inputProps} />{description && <p id={descriptionId} className="text-xs text-muted-foreground">{description}</p>}{error && <p id={errorId} role="alert" className="text-xs text-destructive">{error}</p>}</div>;
}

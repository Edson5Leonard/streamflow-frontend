'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyButton({ value, label = 'Copiar' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); toast.success('Copiado al portapapeles'); window.setTimeout(() => setCopied(false), 1600); } catch { toast.error('No se pudo copiar el contenido'); } };
  return <Button type="button" variant="ghost" size="sm" onClick={copy} aria-label={label}>{copied ? <Check /> : <Copy />}{label}</Button>;
}

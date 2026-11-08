'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({ title = 'No se pudo cargar esta información', description = 'Inténtalo de nuevo en unos momentos.', onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return <section role="alert" className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center"><span className="mb-4 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"><AlertTriangle /></span><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p>{onRetry && <Button variant="outline" className="mt-5" onClick={onRetry}><RefreshCw /> Reintentar</Button>}</section>;
}

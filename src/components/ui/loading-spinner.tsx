import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, label = 'Cargando' }: { className?: string; label?: string }) { return <span role="status" aria-label={label} className="inline-flex items-center"><LoaderCircle className={cn('size-5 animate-spin text-primary', className)} /><span className="sr-only">{label}</span></span>; }

import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormMessageProps = { type?: 'error' | 'success' | 'info'; children: React.ReactNode; className?: string };
export function FormMessage({ type = 'error', children, className }: FormMessageProps) {
  const Icon = type === 'success' ? CheckCircle2 : type === 'info' ? Info : TriangleAlert;
  return <p role={type === 'error' ? 'alert' : 'status'} className={cn('flex items-start gap-2 text-sm', type === 'error' ? 'text-destructive' : type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground', className)}><Icon size={16} className="mt-0.5 shrink-0" />{children}</p>;
}

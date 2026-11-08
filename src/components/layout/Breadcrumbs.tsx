import Link from 'next/link';
import { ChevronRight, House } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = { label: string; href?: string };
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return <nav aria-label="Ruta de navegación" className={cn('mb-6', className)}><ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"><li><Link href="/" aria-label="Inicio" className="flex size-8 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-violet-300 hover:text-violet-600"><House size={14} /></Link></li>{items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-2"><ChevronRight size={13} className="text-slate-400" aria-hidden="true" />{item.href && index < items.length - 1 ? <Link href={item.href} className="transition-colors hover:text-violet-600">{item.label}</Link> : <span aria-current="page" className="text-foreground">{item.label}</span>}</li>)}</ol></nav>;
}

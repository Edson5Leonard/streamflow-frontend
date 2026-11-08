import type { ReactNode } from 'react';

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; eyebrow?: string; actions?: ReactNode }) {
  return <header className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">{eyebrow && <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />{eyebrow}</p>}<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>;
}

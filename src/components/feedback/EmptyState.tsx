import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <section className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800"><h2 className="font-semibold">{title}</h2>{description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}{action && <div className="mt-4">{action}</div>}</section>;
}

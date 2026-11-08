import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCard } from '@/components/animation/AnimatedCard';

export function StatCard({ label, value, detail, icon: Icon, trend }: { label: string; value: string | number; detail?: string; icon?: LucideIcon; trend?: string }) {
  return <AnimatedCard><Card className="transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p></div>{Icon && <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></span>}</div>{(detail || trend) && <p className="mt-3 text-xs text-muted-foreground">{trend && <span className="mr-1 font-medium text-emerald-600">{trend}</span>}{detail}</p>}</CardContent></Card></AnimatedCard>;
}

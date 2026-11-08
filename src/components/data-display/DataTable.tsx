'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type DataTableColumn<T> = { id: string; header: ReactNode; cell: (row: T) => ReactNode; className?: string };
export function DataTable<T>({ columns, data, getRowId, emptyTitle = 'No hay datos para mostrar', emptyDescription }: { columns: DataTableColumn<T>[]; data: T[]; getRowId: (row: T) => string; emptyTitle?: string; emptyDescription?: string }) {
  const reduceMotion = useReducedMotion();
  if (!data.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <div className="overflow-hidden rounded-xl border border-border bg-card"><Table><TableHeader><TableRow className="bg-muted/50 hover:bg-muted/50">{columns.map((column) => <TableHead key={column.id} className={column.className}>{column.header}</TableHead>)}</TableRow></TableHeader><TableBody>{data.map((row, index) => <motion.tr key={getRowId(row)} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.18, delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.16) }} className="border-b transition-colors hover:bg-muted/50">{columns.map((column) => <TableCell key={column.id} className={column.className}>{column.cell(row)}</TableCell>)}</motion.tr>)}</TableBody></Table></div>;
}

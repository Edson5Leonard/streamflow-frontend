import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  return <nav aria-label="Paginación" className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Página {page} de {Math.max(pageCount, 1)}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft />Anterior</Button><Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>Siguiente<ChevronRight /></Button></div></nav>;
}

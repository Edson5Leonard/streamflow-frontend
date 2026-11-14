'use client';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Sale } from '../types/sales.types';
export function SalesTable({ sales, onSelect }: { sales: Sale[]; onSelect?: (sale: Sale) => void }) {
  const columns: DataTableColumn<Sale>[] = [{ id: 'id', header: 'Venta', cell: (item) => item.id.slice(0, 8) }, { id: 'date', header: 'Fecha', cell: (item) => formatDate(item.fechaVenta) }, { id: 'buyer', header: 'Comprador', cell: (item) => item.compradorId?.slice(0, 8) ?? 'Sin usuario vinculado' }, { id: 'price', header: 'Total', cell: (item) => formatCurrency(item.precioPagado) }];
  if (onSelect) columns.push({ id: 'action', header: 'Acción', cell: (item) => <button type="button" onClick={() => onSelect(item)} className="font-semibold text-violet-600 hover:underline">Ver detalle</button> });
  return <DataTable columns={columns} data={sales} getRowId={(item) => item.id} emptyTitle="Aún no hay ventas" />;
}

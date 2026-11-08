'use client';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { formatDate } from '@/utils/format-date';
import type { AuditEvent } from '../types/audit.types';
import { AuditStatusBadge } from './AuditStatusBadge';
export function AuditTable({ events, onSelect }: { events: AuditEvent[]; onSelect?: (event: AuditEvent) => void }) { const columns: DataTableColumn<AuditEvent>[] = [{ id: 'date', header: 'Fecha', cell: (item) => formatDate(item.fechaCreacion) }, { id: 'category', header: 'Categoría', cell: (item) => item.categoriaFallo.replaceAll('_', ' ') }, { id: 'sale', header: 'Venta', cell: (item) => item.ventaId.slice(0, 8) }, { id: 'status', header: 'Estado', cell: (item) => <AuditStatusBadge status={item.estado} /> }]; if (onSelect) columns.push({ id: 'action', header: 'Acción', cell: (item) => <button type="button" onClick={() => onSelect(item)} className="font-semibold text-violet-600 hover:underline dark:text-violet-300">Revisar</button> }); return <DataTable columns={columns} data={events} getRowId={(item) => item.id} emptyTitle="No hay reclamos para auditar" />; }

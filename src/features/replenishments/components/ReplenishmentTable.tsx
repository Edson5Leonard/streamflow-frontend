'use client';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Replenishment } from '../types/replenishments.types';
import { ReplenishmentStatusBadge } from './ReplenishmentStatusBadge';
export function ReplenishmentTable({ requests, onSelect }: { requests: Replenishment[]; onSelect?: (request: Replenishment) => void }) { const columns: DataTableColumn<Replenishment>[] = [{ id: 'date', header: 'Fecha', cell: (item) => formatDate(item.fechaCreacion) }, { id: 'service', header: 'Servicio', cell: (item) => item.nombreServicio }, { id: 'distributor', header: 'Distribuidor', cell: (item) => item.nombreDistribuidor }, { id: 'units', header: 'Unidades', cell: (item) => item.unidadesSolicitadas }, { id: 'amount', header: 'Total', cell: (item) => formatCurrency(item.montoCotizado) }, { id: 'status', header: 'Estado', cell: (item) => <ReplenishmentStatusBadge status={item.estado} /> }]; if (onSelect) columns.push({ id: 'action', header: 'Acción', cell: (item) => <button type="button" onClick={() => onSelect(item)} className="font-semibold text-violet-600 hover:underline">Ver solicitud</button> }); return <DataTable columns={columns} data={requests} getRowId={(item) => item.id} emptyTitle="No hay solicitudes de reposición" />; }

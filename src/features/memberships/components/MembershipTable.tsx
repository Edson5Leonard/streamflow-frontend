'use client';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Membership } from '../types/memberships.types';
import { MembershipStatusBadge } from './MembershipStatusBadge';
export function MembershipTable({ memberships, onSelect }: { memberships: Membership[]; onSelect?: (membership: Membership) => void }) { const columns: DataTableColumn<Membership>[] = [{ id: 'distributor', header: 'Distribuidor', cell: (item) => item.distribuidorNombre }, { id: 'date', header: 'Fecha', cell: (item) => formatDate(item.fechaSolicitud) }, { id: 'method', header: 'Método', cell: (item) => item.metodoPago }, { id: 'amount', header: 'Monto', cell: (item) => formatCurrency(item.monto) }, { id: 'status', header: 'Estado', cell: (item) => <MembershipStatusBadge status={item.estado} /> }]; if (onSelect) columns.push({ id: 'action', header: 'Acción', cell: (item) => <button type="button" onClick={() => onSelect(item)} className="font-semibold text-violet-600 hover:underline">Ver solicitud</button> }); return <DataTable columns={columns} data={memberships} getRowId={(item) => item.id} emptyTitle="No hay pagos de membresía" />; }

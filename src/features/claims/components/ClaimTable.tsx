'use client';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { formatDate } from '@/utils/format-date';
import type { Claim } from '../types/claims.types';
import { ClaimStatusBadge } from './ClaimStatusBadge';
export function ClaimTable({ claims, onSelect }: { claims: Claim[]; onSelect?: (claim: Claim) => void }) { const columns: DataTableColumn<Claim>[] = [{ id: 'date', header: 'Fecha', cell: (claim) => formatDate(claim.fechaCreacion) }, { id: 'category', header: 'Categoría', cell: (claim) => claim.categoriaFallo.replaceAll('_', ' ') }, { id: 'sale', header: 'Venta', cell: (claim) => claim.ventaId.slice(0, 8) }, { id: 'status', header: 'Estado', cell: (claim) => <ClaimStatusBadge status={claim.estado} /> }]; if (onSelect) columns.push({ id: 'actions', header: 'Acción', cell: (claim) => <button type="button" onClick={() => onSelect(claim)} className="font-semibold text-violet-600 hover:underline">Ver detalle</button> }); return <DataTable columns={columns} data={claims} getRowId={(claim) => claim.id} emptyTitle="No hay reclamos" />; }

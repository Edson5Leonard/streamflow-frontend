'use client';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Payment } from '../types/payments.types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
export function PaymentTable({ payments, onSelect }: { payments: Payment[]; onSelect?: (payment: Payment) => void }) { const columns: DataTableColumn<Payment>[] = [{ id: 'date', header: 'Fecha', cell: (item) => formatDate(item.fechaSolicitud) }, { id: 'method', header: 'Método', cell: (item) => item.metodoPago }, { id: 'amount', header: 'Monto', cell: (item) => formatCurrency(item.monto) }, { id: 'status', header: 'Estado', cell: (item) => <PaymentStatusBadge status={item.estado} /> }]; if (onSelect) columns.push({ id: 'action', header: 'Acción', cell: (item) => <button type="button" onClick={() => onSelect(item)} className="font-semibold text-violet-600 hover:underline">Ver detalle</button> }); return <DataTable columns={columns} data={payments} getRowId={(item) => item.id} emptyTitle="Aún no hay pagos" />; }

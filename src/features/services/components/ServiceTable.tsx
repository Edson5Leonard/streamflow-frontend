'use client';
import { formatCurrency } from '@/utils/format-currency';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import type { Service } from '../types/services.types';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';

export function ServiceTable({ services, onUpdatePrice, onUpdateMinimumPrice }: { services: Service[]; onUpdatePrice?: (service: Service) => void; onUpdateMinimumPrice?: (service: Service) => void }) {
  const columns: DataTableColumn<Service>[] = [
    { id: 'name', header: 'Servicio', cell: (item) => <span className="font-semibold">{item.nombre}</span> },
    { id: 'plan', header: 'Plan', cell: (item) => [item.plataforma, item.tipoPlan === 'PERFIL' ? 'Perfil' : item.tipoPlan === 'COMPLETA' ? 'Completa' : null].filter(Boolean).join(' · ') || '—' },
    { id: 'category', header: 'Categoría', cell: (item) => <ServiceCategoryBadge category={item.categoria} /> },
    { id: 'wholesale', header: 'Mayorista', cell: (item) => formatCurrency(item.precioMayorista) },
    { id: 'replacement', header: 'Reposición', cell: (item) => item.precioReposicion == null ? 'Sin configurar' : formatCurrency(item.precioReposicion) },
    { id: 'minimum', header: 'Mínimo venta', cell: (item) => item.precioMinimoVenta == null ? 'Sin mínimo' : formatCurrency(item.precioMinimoVenta) },
    { id: 'status', header: 'Estado', cell: (item) => item.activo ? 'Activo' : 'Inactivo' },
  ];
  if (onUpdatePrice || onUpdateMinimumPrice) columns.push({ id: 'actions', header: 'Acciones', cell: (item) => <div className="flex flex-col items-start gap-1">{onUpdatePrice && <button type="button" onClick={() => onUpdatePrice(item)} className="font-semibold text-violet-600 hover:underline dark:text-violet-400">Editar reposición</button>}{onUpdateMinimumPrice && <button type="button" onClick={() => onUpdateMinimumPrice(item)} className="font-semibold text-violet-600 hover:underline dark:text-violet-400">Editar mínimo</button>}</div> });
  return <DataTable columns={columns} data={services} getRowId={(item) => item.id} emptyTitle="No hay servicios disponibles" />;
}

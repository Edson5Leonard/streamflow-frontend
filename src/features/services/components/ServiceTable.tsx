'use client';
import { formatCurrency } from '@/utils/format-currency';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import type { Service } from '../types/services.types';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';

export function ServiceTable({ services, onUpdatePrice }: { services: Service[]; onUpdatePrice?: (service: Service) => void }) {
  const columns: DataTableColumn<Service>[] = [
    { id: 'name', header: 'Servicio', cell: (item) => <span className="font-semibold">{item.nombre}</span> },
    { id: 'category', header: 'Categoría', cell: (item) => <ServiceCategoryBadge category={item.categoria} /> },
    { id: 'wholesale', header: 'Mayorista', cell: (item) => formatCurrency(item.precioMayorista) },
    { id: 'replacement', header: 'Reposición', cell: (item) => item.precioReposicion == null ? 'Sin configurar' : formatCurrency(item.precioReposicion) },
    { id: 'status', header: 'Estado', cell: (item) => item.activo ? 'Activo' : 'Inactivo' },
  ];
  if (onUpdatePrice) columns.push({ id: 'actions', header: 'Acciones', cell: (item) => <button type="button" onClick={() => onUpdatePrice(item)} className="font-semibold text-violet-600 hover:underline dark:text-violet-400">Editar precio</button> });
  return <DataTable columns={columns} data={services} getRowId={(item) => item.id} emptyTitle="No hay servicios disponibles" />;
}

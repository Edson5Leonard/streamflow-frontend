import { fetchApi, fetchApiBlob } from '@/lib/api';
import { distributorStatisticsSchema, globalStatisticsSchema } from '../schemas/statistics.schema';
const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
  const str = sp.toString();
  return str ? `?${str}` : '';
};
export const statisticsApi = {
  async distributor() { return distributorStatisticsSchema.parse(await fetchApi<unknown>('/estadisticas/distribuidor')); },
  async global() { return globalStatisticsSchema.parse(await fetchApi<unknown>('/estadisticas/admin')); },
  distributorDetail: (params: { desde?: string; hasta?: string; agrupacion?: 'diario' | 'semanal' | 'mensual' } = {}) =>
    fetchApi<Record<string, unknown>>(`/estadisticas/distribuidor/detalle${qs(params)}`),
  topServices: (params: { desde?: string; hasta?: string; limite?: number } = {}) =>
    fetchApi<{ topServicios: unknown[] }>(`/estadisticas/top-servicios${qs(params)}`),
  exportSales: (params: { desde?: string; hasta?: string; formato?: 'csv' | 'xlsx' } = {}) =>
    fetchApiBlob(`/estadisticas/exportar/ventas${qs(params)}`),
  adminRevenue: (params: { desde?: string; hasta?: string; distribuidorId?: string } = {}) =>
    fetchApi<Record<string, unknown>>(`/estadisticas/admin/ingresos${qs(params)}`),
};

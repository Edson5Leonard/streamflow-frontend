import { fetchApi } from '@/lib/api';

export const systemApi = {
  getConfig: () => fetchApi<Record<string, unknown>>('/configuracion'),
  updateConfig: (input: Record<string, unknown>) =>
    fetchApi<{ mensaje: string; configuracion: Record<string, unknown> }>('/configuracion', { method: 'PUT', body: JSON.stringify(input) }),
  getMaintenance: () => fetchApi<{ activo: boolean; mensaje: string }>('/configuracion/mantenimiento'),
  toggleMaintenance: (input: { activo: boolean; mensaje?: string; estimadoFinUTC?: string }) =>
    fetchApi<{ activo: boolean; mensaje: string }>('/configuracion/mantenimiento', { method: 'PATCH', body: JSON.stringify(input) }),
  getGatewaysStatus: () => fetchApi<Record<string, unknown>>('/configuracion/pasarelas'),
  updateExchangeRates: (input: { tasas: { monedaOrigen: string; monedaDestino: string; tasa: number }[]; actualizadoEn?: string }) =>
    fetchApi<Record<string, unknown>>('/configuracion/tipos-cambio', { method: 'PUT', body: JSON.stringify(input) }),
  listCategories: () => fetchApi<{ categorias: unknown[] }>('/categorias'),
  createCategory: (input: { nombre: string; slug?: string; icono?: string; color?: string; orden?: number }) =>
    fetchApi<Record<string, unknown>>('/categorias', { method: 'POST', body: JSON.stringify(input) }),
  updateCategory: (id: string, input: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>(`/categorias/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteCategory: (id: string) => fetchApi<void>(`/categorias/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  servicesByCategory: (slug: string) => fetchApi<Record<string, unknown>>(`/categorias/${encodeURIComponent(slug)}/servicios`),
  listCurrencies: () => fetchApi<{ monedas: unknown[] }>('/monedas'),
  omnisearch: (q: string, tipos = 'ventas,reclamos,clientes', limite = 5) =>
    fetchApi<{ clientes: unknown[]; ventas: unknown[]; reclamos: unknown[] }>(
      `/busqueda?q=${encodeURIComponent(q)}&tipos=${encodeURIComponent(tipos)}&limite=${limite}`,
    ),
};

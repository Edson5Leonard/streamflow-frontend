import { fetchApi } from '@/lib/api';
import {
  adminStoreSchema,
  storeAuditSchema,
  storeCatalogSchema,
  storeManagementSchema,
  storePaymentMethodSchema,
  storeProductSchema,
  storesSchema,
} from '../schemas/store.schema';
import type { StorePaymentMethod } from '../types/stores.types';

export const storesApi = {
  async listAvailable() { return storesSchema.parse(await fetchApi<unknown>('/tiendas/disponibles')); },
  async getCatalog(distributorId: string) {
    return storeCatalogSchema.parse(await fetchApi<unknown>(`/tiendas/${encodeURIComponent(distributorId)}/catalogo`));
  },
  async getMyStore() { return storeManagementSchema.parse(await fetchApi<unknown>('/tiendas/mi-tienda')); },
  async updateMyStore(input: { nombreTienda: string; descripcion: string | null; logoUrl: string | null; whatsapp: string | null }) {
    return storeManagementSchema.parse(await fetchApi<unknown>('/tiendas/mi-tienda', { method: 'PUT', body: JSON.stringify(input) }));
  },
  async updateProduct(serviceId: string, input: { precioVenta: number; descripcion: string | null; imagenUrl: string | null }) {
    return storeProductSchema.parse(await fetchApi<unknown>(
      `/tiendas/mi-tienda/productos/${encodeURIComponent(serviceId)}`,
      { method: 'PUT', body: JSON.stringify(input) },
    ));
  },
  async createProduct(input: { servicioId: string; precioVenta: number; descripcion: string | null; imagenUrl: string | null }) {
    return storeProductSchema.parse(await fetchApi<unknown>('/tiendas/mi-tienda/productos', {
      method: 'POST',
      body: JSON.stringify(input),
    }));
  },
  async deleteProduct(serviceId: string) {
    return fetchApi<void>(`/tiendas/mi-tienda/productos/${encodeURIComponent(serviceId)}`, { method: 'DELETE' });
  },
  async updatePaymentMethod(input: StorePaymentMethod) {
    return storePaymentMethodSchema.parse(await fetchApi<unknown>(
      `/tiendas/mi-tienda/metodos-pago/${encodeURIComponent(input.metodo)}`,
      { method: 'PUT', body: JSON.stringify(input) },
    ));
  },
  async uploadImage(file: File, tipo: 'logo' | 'producto' | 'metodo-pago', serviceId?: string, metodo?: StorePaymentMethod['metodo']) {
    const form = new FormData();
    form.set('imagen', file);
    form.set('tipo', tipo);
    if (serviceId) form.set('servicioId', serviceId);
    if (metodo) form.set('metodo', metodo);
    const result = await fetchApi<{ url: string }>('/tiendas/mi-tienda/imagenes', { method: 'POST', body: form });
    return result.url;
  },
  async listAdmin() { return adminStoreSchema.array().parse(await fetchApi<unknown>('/tiendas/admin')); },
  async listAudit(distributorId?: string) {
    const endpoint = distributorId
      ? `/tiendas/admin/auditoria?distribuidorId=${encodeURIComponent(distributorId)}`
      : '/tiendas/admin/auditoria';
    return storeAuditSchema.array().parse(await fetchApi<unknown>(endpoint));
  },
  async listMyAudit() { return storeAuditSchema.array().parse(await fetchApi<unknown>('/tiendas/mi-tienda/auditoria')); },
  updateStatus: (input: { activa: boolean; mensajeMantenimiento?: string }) =>
    fetchApi<{ activa: boolean; mensajeMantenimiento: string }>('/tiendas/mi-tienda/estado', { method: 'PATCH', body: JSON.stringify(input) }),
  updateSeo: (input: { metaTitulo?: string; metaDescripcion?: string; palabrasClave?: string[]; ogImagen?: string }) =>
    fetchApi<Record<string, unknown>>('/tiendas/mi-tienda/seo', { method: 'PUT', body: JSON.stringify(input) }),
  getAnalytics: (params: { desde?: string; hasta?: string } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return fetchApi<Record<string, unknown>>(`/tiendas/mi-tienda/analytics${q ? `?${q}` : ''}`);
  },
  updateDomain: (input: { dominio: string; subdominio: string }) =>
    fetchApi<{ dominio: string; estadoVerificacion: string; instrucciones: string }>('/tiendas/mi-tienda/dominio', { method: 'PUT', body: JSON.stringify(input) }),
  updateTheme: (input: { colorPrimario?: string; colorSecundario?: string; colorFondo?: string; fuente?: string; modoOscuro?: boolean }) =>
    fetchApi<Record<string, unknown>>('/tiendas/mi-tienda/tema', { method: 'PUT', body: JSON.stringify(input) }),
  updateCurrency: (input: { monedaCodigo: string; tasaCambioManual?: number; actualizacionAutomatica?: boolean }) =>
    fetchApi<{ monedaCodigo: string; tasaCambioManual: number }>('/tiendas/mi-tienda/moneda', { method: 'PUT', body: JSON.stringify(input) }),
};

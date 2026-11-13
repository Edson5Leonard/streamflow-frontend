import { ALL_CATEGORIES } from '../constants/stores.constants';
import type { Store, StoreProduct } from '../types/stores.types';
import { env } from '@/config/env';

export const getStoreLabel = (store: Store) => store.nombreTienda;
export const getStoreHref = (id: string) => `/tiendas/${encodeURIComponent(id)}`;
export function getStoreImageSrc(url: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith('/api/') ? `${env.apiUrl.replace(/\/api$/, '')}${url}` : url;
}
export const getCategories = (products: StoreProduct[]) => [ALL_CATEGORIES, ...Array.from(new Set(products.map((product) => product.categoria))).sort((a, b) => a.localeCompare(b, 'es'))];
export function getProductPlanSummary(product: StoreProduct): string | null {
  const details = [
    product.plataforma,
    product.tipoPlan === 'COMPLETA' ? 'Cuenta completa' : product.tipoPlan === 'PERFIL' ? 'Perfil' : null,
    product.tipoPlan === 'PERFIL' && product.cantidadPerfiles != null
      ? `${product.cantidadPerfiles} perfil${product.cantidadPerfiles === 1 ? '' : 'es'}`
      : null,
    product.cantidadDispositivos != null
      ? `${product.cantidadDispositivos} dispositivo${product.cantidadDispositivos === 1 ? '' : 's'}`
      : null,
    product.duracionMeses != null
      ? `${product.duracionMeses} mes${product.duracionMeses === 1 ? '' : 'es'}`
      : null,
  ].filter(Boolean);
  return details.length ? details.join(' · ') : null;
}
export function filterProducts(products: StoreProduct[], search: string, category: string) {
  const query = search.trim().toLocaleLowerCase('es');
  return products.filter((product) => (category === ALL_CATEGORIES || product.categoria === category) && `${product.nombre} ${product.descripcion ?? ''} ${product.categoria}`.toLocaleLowerCase('es').includes(query));
}

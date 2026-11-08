import { ALL_CATEGORIES } from '../constants/stores.constants';
import type { Store, StoreProduct } from '../types/stores.types';

export const getStoreLabel = (store: Store) => store.nombreTienda;
export const getStoreHref = (id: string) => `/tiendas/${encodeURIComponent(id)}`;
export const getCategories = (products: StoreProduct[]) => [ALL_CATEGORIES, ...Array.from(new Set(products.map((product) => product.categoria))).sort((a, b) => a.localeCompare(b, 'es'))];
export function filterProducts(products: StoreProduct[], search: string, category: string) {
  const query = search.trim().toLocaleLowerCase('es');
  return products.filter((product) => (category === ALL_CATEGORIES || product.categoria === category) && `${product.nombre} ${product.descripcion ?? ''} ${product.categoria}`.toLocaleLowerCase('es').includes(query));
}

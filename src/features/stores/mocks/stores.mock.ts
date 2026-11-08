import type { Store, StoreCatalog } from '../types/stores.types';

export const storesMock: Store[] = [
  { id: '22222222-2222-4222-8222-222222222222', nombreTienda: 'Stream Central' },
  { id: '44444444-4444-4444-8444-444444444444', nombreTienda: 'Universo Streaming' },
  { id: '55555555-5555-4555-8555-555555555555', nombreTienda: 'Tu Espacio Digital' },
];

const products: StoreCatalog['productos'] = [
  { servicioId: 'a1111111-1111-4111-8111-111111111111', nombre: 'Netflix Premium', categoria: 'Películas y series', descripcion: 'Historias para disfrutar en casa.', precio: 18.90, stockDisponible: 8 },
  { servicioId: 'a2222222-2222-4222-8222-222222222222', nombre: 'Disney+ Standard', categoria: 'Películas y series', descripcion: 'Películas, series y favoritos de siempre.', precio: 15.00, stockDisponible: 6 },
  { servicioId: 'a3333333-3333-4333-8333-333333333333', nombre: 'Max', categoria: 'Películas y series', descripcion: 'Descubre series y películas para cada momento.', precio: 13.50, stockDisponible: 4 },
  { servicioId: 'a4444444-4444-4444-8444-444444444444', nombre: 'Crunchyroll', categoria: 'Anime', descripcion: 'Historias de anime para descubrir.', precio: 12.00, stockDisponible: 0 },
  { servicioId: 'a5555555-5555-4555-8555-555555555555', nombre: 'Spotify Premium', categoria: 'Música', descripcion: 'Tu música y podcasts favoritos en un solo lugar.', precio: 11.90, stockDisponible: 5 },
];

export const storeCatalogMocks: Record<string, StoreCatalog> = {
  '22222222-2222-4222-8222-222222222222': { nombreTienda: 'Stream Central', whatsapp: null, productos: products },
  '44444444-4444-4444-8444-444444444444': { nombreTienda: 'Universo Streaming', whatsapp: null, productos: products.slice(0, 4) },
  '55555555-5555-4555-8555-555555555555': { nombreTienda: 'Tu Espacio Digital', whatsapp: null, productos: products.slice(1) },
};

import type { Service } from '../types/services.types';
export const servicesMock: Service[] = [
  { id: 'a1111111-1111-4111-8111-111111111111', nombre: 'Netflix Premium', categoria: 'Películas y series', descripcion: 'Historias para disfrutar en casa.', precioMayorista: 8, precioReposicion: 9, activo: true },
  { id: 'a2222222-2222-4222-8222-222222222222', nombre: 'Disney+ Standard', categoria: 'Películas y series', descripcion: 'Películas, series y favoritos de siempre.', precioMayorista: 6, precioReposicion: 7, activo: true },
  { id: 'a3333333-3333-4333-8333-333333333333', nombre: 'Max', categoria: 'Películas y series', descripcion: 'Descubre series y películas para cada momento.', precioMayorista: 5.5, precioReposicion: 6, activo: true },
  { id: 'a4444444-4444-4444-8444-444444444444', nombre: 'Crunchyroll', categoria: 'Anime', descripcion: 'Historias de anime para descubrir.', precioMayorista: 5, precioReposicion: null, activo: true },
  { id: 'a5555555-5555-4555-8555-555555555555', nombre: 'Spotify Premium', categoria: 'Música', descripcion: 'Tu música y podcasts favoritos en un solo lugar.', precioMayorista: 5, precioReposicion: 6, activo: true },
];

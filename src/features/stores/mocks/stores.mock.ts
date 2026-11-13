import type { Store, StoreCatalog } from '../types/stores.types';
import { servicesMock } from '@/features/services/mocks/services.mock';

export const storesMock: Store[] = [
  { id: '22222222-2222-4222-8222-222222222222', nombreTienda: 'Stream Central' },
  { id: '44444444-4444-4444-8444-444444444444', nombreTienda: 'Universo Streaming' },
  { id: '55555555-5555-4555-8555-555555555555', nombreTienda: 'Tu Espacio Digital' },
];

const products: StoreCatalog['productos'] = servicesMock.filter((service) => service.activo).map((service) => ({
  servicioId: service.id,
  nombre: service.nombre,
  categoria: service.categoria,
  descripcion: service.descripcion,
  precio: service.precioMayorista,
  stockDisponible: 4,
  imagenUrl: null,
  plataforma: service.plataforma,
  tipoPlan: service.tipoPlan,
  cantidadDispositivos: service.cantidadDispositivos,
  cantidadPerfiles: service.cantidadPerfiles,
  duracionMeses: service.duracionMeses,
}));

export const storeCatalogMocks: Record<string, StoreCatalog> = {
  '22222222-2222-4222-8222-222222222222': { nombreTienda: 'Stream Central', whatsapp: null, productos: products, descripcion: null, logoUrl: null, metodosPago: [] },
  '44444444-4444-4444-8444-444444444444': { nombreTienda: 'Universo Streaming', whatsapp: null, productos: products.slice(0, 4), descripcion: null, logoUrl: null, metodosPago: [] },
  '55555555-5555-4555-8555-555555555555': { nombreTienda: 'Tu Espacio Digital', whatsapp: null, productos: products.slice(1), descripcion: null, logoUrl: null, metodosPago: [] },
};

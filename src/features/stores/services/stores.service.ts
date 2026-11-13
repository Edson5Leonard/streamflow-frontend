import Cookies from 'js-cookie';
import { env } from '@/config/env';
import { servicesService } from '@/features/services/services/services.service';
import { storesApi } from '../api/stores.api';
import { adminStoreSchema, storeAuditSchema, storeIdSchema } from '../schemas/store.schema';
import { storeCatalogMocks, storesMock } from '../mocks/stores.mock';
import type {
  AdminStore,
  Store,
  StoreAudit,
  StoreCatalog,
  StoreManagement,
  StorePaymentMethod,
  StoreProduct,
} from '../types/stores.types';

const storageKey = 'streamflow:mock-store-settings:v1';
const paymentMethods: StorePaymentMethod['metodo'][] = ['YAPE', 'PLIN', 'BCP', 'INTERBANK', 'INTERNACIONAL'];

type MockState = {
  stores: Record<string, StoreCatalog>;
  audit: StoreAudit[];
};

function currentDistributorId() {
  return Cookies.get('usuarioId') ?? storesMock[0].id;
}

function readMockState(): MockState {
  if (typeof window === 'undefined') return { stores: structuredClone(storeCatalogMocks), audit: [] };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const state = JSON.parse(raw) as MockState;
      return {
        stores: { ...structuredClone(storeCatalogMocks), ...state.stores },
        audit: storeAuditSchema.array().parse(state.audit),
      };
    }
  } catch {
    return { stores: structuredClone(storeCatalogMocks), audit: [] };
  }
  return { stores: structuredClone(storeCatalogMocks), audit: [] };
}

function saveMockState(state: MockState) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function mockStore(state: MockState, id = currentDistributorId()): StoreCatalog {
  const catalog = state.stores[id];
  if (!catalog) throw new Error('No se encontró la tienda de esta cuenta.');
  return catalog;
}

function addAudit(state: MockState, storeId: string, field: string, previous: unknown, next: unknown) {
  if (JSON.stringify(previous) === JSON.stringify(next)) return;
  state.audit.unshift({
    id: crypto.randomUUID(),
    distribuidorId: storeId,
    actorId: storeId,
    campo: field,
    valorAnterior: previous == null ? null : String(previous),
    valorNuevo: next == null ? null : String(next),
    fecha: new Date().toISOString(),
  });
}

function management(catalog: StoreCatalog): StoreManagement {
  return {
    nombreTienda: catalog.nombreTienda,
    descripcion: catalog.descripcion,
    logoUrl: catalog.logoUrl,
    whatsapp: catalog.whatsapp,
    productos: catalog.productos,
    metodosPago: paymentMethods.map((method) =>
      catalog.metodosPago.find((item) => item.metodo === method)
      ?? { metodo: method, imagenQrUrl: null, numeroCuenta: null, cci: null, titular: null, activo: false }),
  };
}

function asDataUrl(file: File): Promise<string> {
  if (file.size > 1024 * 1024) {
    throw new Error('En modo demo, las imágenes deben ser de hasta 1 MB.');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer la imagen.'));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}

export const storesService = {
  async listAvailable(): Promise<Store[]> {
    return env.useMocks ? structuredClone(storesMock) : storesApi.listAvailable();
  },
  async getCatalog(distributorId: string): Promise<StoreCatalog> {
    const id = storeIdSchema.parse(distributorId);
    if (!env.useMocks) return storesApi.getCatalog(id);
    const state = readMockState();
    return structuredClone(mockStore(state, id));
  },
  async getMyStore(): Promise<StoreManagement> {
    if (!env.useMocks) return storesApi.getMyStore();
    return management(mockStore(readMockState()));
  },
  async updateMyStore(input: Pick<StoreManagement, 'nombreTienda' | 'descripcion' | 'logoUrl' | 'whatsapp'>) {
    if (!env.useMocks) return storesApi.updateMyStore(input);
    const state = readMockState();
    const id = currentDistributorId();
    const catalog = mockStore(state, id);
    addAudit(state, id, 'nombreTienda', catalog.nombreTienda, input.nombreTienda);
    addAudit(state, id, 'descripcion', catalog.descripcion, input.descripcion);
    addAudit(state, id, 'logoUrl', catalog.logoUrl, input.logoUrl);
    addAudit(state, id, 'whatsapp', catalog.whatsapp, input.whatsapp);
    state.stores[id] = { ...catalog, ...input };
    saveMockState(state);
    return management(state.stores[id]);
  },
  async updateProduct(serviceId: string, input: Pick<StoreProduct, 'precio' | 'descripcion' | 'imagenUrl'>) {
    if (!env.useMocks) {
      return storesApi.updateProduct(serviceId, {
        precioVenta: input.precio,
        descripcion: input.descripcion,
        imagenUrl: input.imagenUrl,
      });
    }
    const state = readMockState();
    const id = currentDistributorId();
    const catalog = mockStore(state, id);
    const index = catalog.productos.findIndex((product) => product.servicioId === serviceId);
    if (index < 0) throw new Error('El producto no existe en tu tienda.');
    const product = catalog.productos[index];
    addAudit(state, id, `producto.${serviceId}.precioVenta`, product.precio, input.precio);
    addAudit(state, id, `producto.${serviceId}.descripcion`, product.descripcion, input.descripcion);
    addAudit(state, id, `producto.${serviceId}.imagenUrl`, product.imagenUrl, input.imagenUrl);
    const productos = [...catalog.productos];
    productos[index] = { ...product, precio: input.precio, descripcion: input.descripcion, imagenUrl: input.imagenUrl };
    state.stores[id] = { ...catalog, productos };
    saveMockState(state);
    return productos[index];
  },
  async createProduct(serviceId: string, input: Pick<StoreProduct, 'precio' | 'descripcion' | 'imagenUrl'>) {
    if (!env.useMocks) {
      return storesApi.createProduct({
        servicioId: serviceId,
        precioVenta: input.precio,
        descripcion: input.descripcion,
        imagenUrl: input.imagenUrl,
      });
    }
    const state = readMockState();
    const id = currentDistributorId();
    const catalog = mockStore(state, id);
    if (catalog.productos.some((product) => product.servicioId === serviceId)) {
      throw new Error('Este servicio ya está en el catálogo de tu tienda.');
    }
    const service = (await servicesService.listActive()).find((item) => item.id === serviceId);
    if (!service) throw new Error('El servicio no existe o está inactivo.');
    const product: StoreProduct = {
      servicioId: service.id,
      nombre: service.nombre,
      categoria: service.categoria,
      descripcion: input.descripcion,
      precio: input.precio,
      stockDisponible: 0,
      plataforma: service.plataforma,
      tipoPlan: service.tipoPlan,
      cantidadDispositivos: service.cantidadDispositivos,
      cantidadPerfiles: service.cantidadPerfiles,
      duracionMeses: service.duracionMeses,
      imagenUrl: input.imagenUrl,
    };
    addAudit(state, id, `producto.${serviceId}.visible`, false, true);
    addAudit(state, id, `producto.${serviceId}.precioVenta`, service.precioMayorista, input.precio);
    addAudit(state, id, `producto.${serviceId}.descripcion`, service.descripcion, input.descripcion);
    addAudit(state, id, `producto.${serviceId}.imagenUrl`, null, input.imagenUrl);
    state.stores[id] = { ...catalog, productos: [...catalog.productos, product] };
    saveMockState(state);
    return product;
  },
  async deleteProduct(serviceId: string) {
    if (!env.useMocks) return storesApi.deleteProduct(serviceId);
    const state = readMockState();
    const id = currentDistributorId();
    const catalog = mockStore(state, id);
    const product = catalog.productos.find((item) => item.servicioId === serviceId);
    if (!product) throw new Error('El producto no está en tu catálogo.');
    addAudit(state, id, `producto.${serviceId}.visible`, true, false);
    state.stores[id] = {
      ...catalog,
      productos: catalog.productos.filter((item) => item.servicioId !== serviceId),
    };
    saveMockState(state);
  },
  async updatePaymentMethod(input: StorePaymentMethod) {
    if (!env.useMocks) return storesApi.updatePaymentMethod(input);
    const state = readMockState();
    const id = currentDistributorId();
    const catalog = mockStore(state, id);
    const previous = catalog.metodosPago.find((item) => item.metodo === input.metodo);
    for (const field of ['imagenQrUrl', 'numeroCuenta', 'cci', 'titular', 'activo'] as const) {
      addAudit(state, id, `pago.${input.metodo}.${field}`, previous?.[field], input[field]);
    }
    const metodosPago = [...catalog.metodosPago.filter((item) => item.metodo !== input.metodo), input];
    state.stores[id] = { ...catalog, metodosPago };
    saveMockState(state);
    return input;
  },
  async uploadImage(file: File, tipo: 'logo' | 'producto' | 'metodo-pago', serviceId?: string, metodo?: StorePaymentMethod['metodo']) {
    if (!env.useMocks) return storesApi.uploadImage(file, tipo, serviceId, metodo);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      throw new Error('La imagen debe ser PNG, JPG o WEBP.');
    }
    return asDataUrl(file);
  },
  async listAdmin(): Promise<AdminStore[]> {
    if (!env.useMocks) return storesApi.listAdmin();
    const state = readMockState();
    return adminStoreSchema.array().parse(storesMock.map((store) => ({
      distribuidorId: store.id,
      nombreDistribuidor: store.nombreTienda,
      correoDistribuidor: '',
      activa: true,
      membresiaHasta: null,
      nombreTienda: state.stores[store.id]?.nombreTienda ?? store.nombreTienda,
      descripcion: state.stores[store.id]?.descripcion ?? null,
      logoUrl: state.stores[store.id]?.logoUrl ?? null,
      whatsapp: state.stores[store.id]?.whatsapp ?? null,
    })));
  },
  async listAudit(distributorId?: string): Promise<StoreAudit[]> {
    return env.useMocks
      ? readMockState().audit.filter((entry) => !distributorId || entry.distribuidorId === distributorId)
      : storesApi.listAudit(distributorId);
  },
  async listMyAudit(): Promise<StoreAudit[]> {
    return env.useMocks
      ? readMockState().audit.filter((entry) => entry.distribuidorId === currentDistributorId())
      : storesApi.listMyAudit();
  },
};

import { http } from '@/services/http.service';
import { env } from '@/config/env';

function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (env.useMocks) {
    throw new Error('El portal de cliente requiere datos reales. Desactiva NEXT_PUBLIC_USE_MOCKS para usarlo.');
  }
  return http<T>(endpoint, options);
}

export type ClientLoginInput = {
  distribuidorId: string;
  whatsapp: string;
  pin: string;
};

export type ClientSession = {
  token: string;
  usuarioId: string;
  role: string;
  distribuidorId: string;
  tipoCuenta: 'CLIENTE';
  pinDebeCambiar: boolean;
};

export type ClientProfile = {
  usuarioId: string;
  nombreCompleto: string;
  correo: string;
  whatsapp: string;
  role: string;
  distribuidorId: string;
  distribuidorWhatsapp: string | null;
  tiendaNombre: string;
  pinDebeCambiar: boolean;
};

export type ClientPurchase = {
  ventaId: string;
  pedidoId: string;
  servicio: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  precioPagado: number | null;
  fechaVenta: string;
};

export type ClientOrder = {
  pedidoId: string;
  estado: string;
  montoTotal: number;
  fechaSolicitud: string;
  fechaEntrega: string | null;
  motivoRechazo: string | null;
  entregas: ClientPurchase[];
};

export type ManagedClient = {
  id: string;
  nombreCompleto: string;
  whatsapp: string;
  estado: string;
  pinDebeCambiar: boolean;
  pinExpiraEn: string | null;
  createdAt: string;
};

export type TemporaryPin = {
  clienteId: string;
  whatsapp: string;
  pinTemporal: string;
  enlaceWhatsApp: string;
  expiraEn: string;
};

export const clientPortalApi = {
  login: (input: ClientLoginInput) =>
    request<ClientSession>('/auth/cliente/login', { method: 'POST', body: JSON.stringify(input) }),
  profile: () => request<ClientProfile>('/cliente-portal/perfil'),
  orders: () => request<ClientOrder[]>('/cliente-portal/pedidos'),
  changePin: (pinActual: string, pinNuevo: string) =>
    request<void>('/cliente-portal/pin', {
      method: 'PUT',
      body: JSON.stringify({ pinActual, pinNuevo }),
    }),
  managedClients: () => request<ManagedClient[]>('/clientes/distribuidor'),
  resetPin: (id: string) =>
    request<TemporaryPin>(`/clientes/${encodeURIComponent(id)}/pin-temporal`, { method: 'POST' }),
  listPaginated: (params: { page?: number; size?: number; busqueda?: string; estado?: string; ordenPor?: string; direccion?: string } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return request<{ contenido: unknown[]; pagina: number; tamano: number; totalElementos: number; totalPaginas: number }>(`/clientes${q ? `?${q}` : ''}`);
  },
  history: (id: string, params: { page?: number; size?: number; desde?: string; hasta?: string } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    const q = sp.toString();
    return request<Record<string, unknown>>(`/clientes/${encodeURIComponent(id)}/historial${q ? `?${q}` : ''}`);
  },
  block: (id: string, bloqueado: boolean, motivo?: string) =>
    request<{ id: string; bloqueado: boolean; mensaje: string }>(`/clientes/${encodeURIComponent(id)}/bloquear`, {
      method: 'PATCH',
      body: JSON.stringify({ bloqueado, motivo: motivo ?? null }),
    }),
  clientProfile: (id: string) => request<Record<string, unknown>>(`/clientes/${encodeURIComponent(id)}/perfil`),
};

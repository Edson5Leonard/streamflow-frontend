import type { Account } from '../types/accounts.types';
export type MockAccount = Account & { distributorId: string | null };
export const accountsMock: MockAccount[] = [
  { id: 'c1111111-1111-4111-8111-111111111111', servicioId: 'a1111111-1111-4111-8111-111111111111', correo: 'netflix@ejemplo.com', password: 'Demo1234', perfilPin: 'Perfil 1 / 1234', precioVenta: 18.90, tipoStock: 'VENTA', estado: 'DISPONIBLE', fechaIngreso: '2026-10-15T10:00:00', distributorId: '22222222-2222-4222-8222-222222222222' },
  { id: 'c2222222-2222-4222-8222-222222222222', servicioId: 'a2222222-2222-4222-8222-222222222222', correo: 'garantia@ejemplo.com', password: 'Demo1234', perfilPin: null, precioVenta: 15, tipoStock: 'GARANTIA', estado: 'DISPONIBLE', fechaIngreso: '2026-10-15T10:00:00', distributorId: '22222222-2222-4222-8222-222222222222' },
  { id: 'c3333333-3333-4333-8333-333333333333', servicioId: 'a3333333-3333-4333-8333-333333333333', correo: 'global@ejemplo.com', password: 'Demo1234', perfilPin: null, precioVenta: 6, tipoStock: 'VENTA', estado: 'DISPONIBLE', fechaIngreso: '2026-10-15T10:00:00', distributorId: null },
];

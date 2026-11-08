import type { Purchase, Sale } from '../types/sales.types';
export type MockSale = { sale: Sale; purchase: Purchase; distributorId: string };
export const salesMock: MockSale[] = [{
  distributorId: '22222222-2222-4222-8222-222222222222',
  sale: { id: 'b1111111-1111-4111-8111-111111111111', compradorId: '11111111-1111-4111-8111-111111111111', cuentaStockId: 'b2222222-2222-4222-8222-222222222222', precioPagado: 18.90, pagoId: 'b3333333-3333-4333-8333-333333333333', fechaVenta: '2026-10-15T10:30:00' },
  purchase: { id: 'b1111111-1111-4111-8111-111111111111', cuentaStockId: 'b2222222-2222-4222-8222-222222222222', servicio: 'Netflix Premium', correo: 'cuenta@ejemplo.com', password: 'Demo1234', perfilPin: 'Perfil 1 / 1234', precioPagado: 18.90, fechaVenta: '2026-10-15T10:30:00' },
}];

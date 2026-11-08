import type { RegisterInput, UserRole } from '../types/auth.types';
export type MockUser = RegisterInput & { id: string; role: UserRole; activo?: boolean; membresiaHasta?: string | null };
export const MOCK_USERS: MockUser[] = [
  { id: '11111111-1111-4111-8111-111111111111', nombreCompleto: 'Comprador Demo', correo: 'comprador@demo.com', password: 'Demo1234', role: 'COMPRADOR', distribuidorId: '22222222-2222-4222-8222-222222222222' },
  { id: '22222222-2222-4222-8222-222222222222', nombreCompleto: 'Distribuidor Demo', correo: 'distribuidor@demo.com', password: 'Demo1234', role: 'DISTRIBUIDOR', distribuidorId: '22222222-2222-4222-8222-222222222222' },
  { id: '33333333-3333-4333-8333-333333333333', nombreCompleto: 'Administrador Demo', correo: 'admin@demo.com', password: 'Demo1234', role: 'SUPER_ADMIN', distribuidorId: '' },
];

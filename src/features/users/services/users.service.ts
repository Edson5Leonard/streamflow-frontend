import { env } from '@/config/env';
import { usersApi } from '../api/users.api';
import { userRoleIds } from '../mocks/users.mock';
import { authService } from '@/features/auth/services/auth.service';
import type { MockUser } from '@/features/auth/mocks/auth.mock';
import type { CreateDistributor, User, UserUpdate } from '../types/users.types';
import Cookies from 'js-cookie';

function toUser(user: MockUser): User {
  return { id: user.id, nombreCompleto: user.nombreCompleto, correo: user.correo, whatsapp: user.whatsapp ?? null, activo: user.activo !== false, membresiaHasta: user.membresiaHasta ?? null, fechaCreacion: null, roles: [{ id: userRoleIds[user.role], nombre: `ROLE_${user.role}` }] };
}
function canManage(target: MockUser) {
  const role = Cookies.get('role');
  return role === 'SUPER_ADMIN' ? target.role === 'COMPRADOR' || target.role === 'DISTRIBUIDOR' : role === 'DISTRIBUIDOR' && target.role === 'COMPRADOR' && target.distribuidorId === Cookies.get('usuarioId');
}
function findTarget(id: string) { const user = authService.getMockUsers().find((item) => item.id === id && canManage(item)); if (!user) throw new Error('El usuario no existe en tu tienda.'); return user; }
export const usersService = {
  async list() { if (!env.useMocks) return usersApi.list(); const role = Cookies.get('role'); if (role !== 'SUPER_ADMIN' && role !== 'DISTRIBUIDOR') throw new Error('No tienes acceso a usuarios.'); return authService.getMockUsers().filter((user) => role === 'SUPER_ADMIN' || user.distribuidorId === Cookies.get('usuarioId') && user.role === 'COMPRADOR').map(toUser); },
  async get(id: string) { return env.useMocks ? toUser(findTarget(id)) : usersApi.get(id); },
  async update(id: string, input: UserUpdate) {
    if (!env.useMocks) return usersApi.update(id, input);
    const target = findTarget(id);
    if (input.activo !== undefined && Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('Solo el superadministrador puede cambiar el estado de la cuenta.');
    if (input.nombreCompleto !== undefined && !input.nombreCompleto.trim()) throw new Error('El nombre no puede estar vacío.');
    if (input.correo !== undefined && !input.correo.trim()) throw new Error('El correo no puede estar vacío.');
    if (input.correo && authService.getMockUsers().some((user) => user.id !== id && user.correo.toLowerCase() === input.correo!.trim().toLowerCase())) throw new Error('El correo ya está registrado.');
    const updated = { ...target, ...(input.nombreCompleto !== undefined && { nombreCompleto: input.nombreCompleto.trim() }), ...(input.correo !== undefined && { correo: input.correo.trim() }), ...(input.whatsapp !== undefined && { whatsapp: input.whatsapp.trim() }), ...(input.password?.trim() && { password: input.password }), ...(input.activo !== undefined && { activo: input.activo }) };
    authService.saveMockUser(updated); return toUser(updated);
  },
  async deactivate(id: string) { if (!env.useMocks) return usersApi.deactivate(id); const target = findTarget(id); authService.saveMockUser({ ...target, activo: false }); },
  async listDistributors() { if (!env.useMocks) return usersApi.listDistributors(); if (Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('No tienes acceso a distribuidores.'); return authService.getMockUsers().filter((user) => user.role === 'DISTRIBUIDOR').map(toUser); },
  async createDistributor(input: CreateDistributor) { if (!env.useMocks) return usersApi.createDistributor(input); if (Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('Solo el superadministrador puede crear distribuidores.'); if (!input.nombreCompleto.trim() || !input.correo.trim() || !input.password.trim()) throw new Error('Nombre, correo y contraseña son obligatorios.'); if (authService.getMockUsers().some((user) => user.correo.toLowerCase() === input.correo.trim().toLowerCase())) throw new Error('El correo ya está registrado.'); const user: MockUser = { ...input, id: crypto.randomUUID(), distribuidorId: '', role: 'DISTRIBUIDOR', activo: true }; authService.saveMockUser(user); return toUser(user); },
  async setDistributorActive(id: string, activo: boolean) { if (!env.useMocks) return usersApi.setDistributorActive(id, activo); if (Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('No tienes permiso para cambiar el estado.'); const user = findTarget(id); if (user.role !== 'DISTRIBUIDOR') throw new Error('El distribuidor no existe.'); const today = new Date(); today.setHours(0, 0, 0, 0); if (activo && (!user.membresiaHasta || new Date(`${user.membresiaHasta}T00:00:00`) < today)) throw new Error('El distribuidor debe tener una membresía vigente para reactivarse.'); const updated = { ...user, activo }; authService.saveMockUser(updated); return toUser(updated); },
};

import { env } from '@/config/env';
import { authApi } from '../api/auth.api';
import { MOCK_USERS, type MockUser } from '../mocks/auth.mock';
import type { LoginInput, RegisterInput, Session } from '../types/auth.types';
import Cookies from 'js-cookie';
const KEY = 'streamflow:mock-users';
function registeredUsers(): MockUser[] { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as MockUser[]; } catch { return []; } }
function allMockUsers() { const saved = registeredUsers(); return [...MOCK_USERS.filter((user) => !saved.some((entry) => entry.id === user.id)), ...saved]; }
export const authService = {
  getMockUsers(): MockUser[] { return structuredClone(allMockUsers()); },
  saveMockUser(user: MockUser) { const saved = registeredUsers().filter((entry) => entry.id !== user.id); saved.push(user); localStorage.setItem(KEY, JSON.stringify(saved)); },
  async getProfile() {
    if (!env.useMocks) return authApi.me();
    const user = allMockUsers().find((item) => item.id === Cookies.get('usuarioId') && item.activo !== false);
    if (!user) throw new Error('No se encontró la sesión. Inicia sesión nuevamente.');
    return { usuarioId: user.id, nombreCompleto: user.nombreCompleto, correo: user.correo, whatsapp: user.whatsapp ?? null, role: user.role, roles: [user.role], distribuidorId: user.distribuidorId || null, distribuidorWhatsapp: null };
  },
  async login(input: LoginInput): Promise<Session> {
    if (!env.useMocks) {
      const response = await authApi.login(input);
      const role = response.role?.replace(/^ROLE_/, '');
      if (!response.token || !response.usuarioId || !['COMPRADOR', 'DISTRIBUIDOR', 'SUPER_ADMIN'].includes(role)) throw new Error('El servidor devolvió una sesión incompleta.');
      return { ...response, role: role as Session['role'], tipoCuenta: 'USUARIO' };
    }
    const user = allMockUsers().find((item) => item.correo.toLowerCase() === input.correo.trim().toLowerCase() && item.password === input.password && item.activo !== false);
    if (!user) throw new Error('Correo o contraseña incorrectos.');
    return { token: `mock-${user.id}`, usuarioId: user.id, role: user.role, tipoCuenta: 'USUARIO', distribuidorId: user.distribuidorId || null };
  },
  async register(input: RegisterInput) {
    if (!env.useMocks) return authApi.register(input);
    const users = registeredUsers();
    if (allMockUsers().some((user) => user.correo.toLowerCase() === input.correo.trim().toLowerCase())) throw new Error('El correo ya está registrado.');
    users.push({ ...input, correo: input.correo.trim().toLowerCase(), id: crypto.randomUUID(), role: 'COMPRADOR' });
    localStorage.setItem(KEY, JSON.stringify(users));
    return { mensaje: 'Registro exitoso', correo: input.correo };
  },
};

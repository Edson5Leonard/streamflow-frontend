import { http } from '@/services/http.service';
import type { LoginInput, RegisterInput, Session, SessionProfile } from '../types/auth.types';
export const authApi = {
  login: (input: LoginInput) => http<Session>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  register: (input: RegisterInput) => http<{ mensaje: string; correo: string }>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  me: () => http<SessionProfile>('/auth/me'),
  forgotPassword: (correo: string) => http<{ mensaje: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ correo }) }),
  resetPassword: (token: string, nuevaPassword: string) => http<{ mensaje: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, nuevaPassword }) }),
  changePassword: (passwordActual: string, nuevaPassword: string, confirmarPassword: string) =>
    http<{ mensaje: string }>('/auth/change-password', { method: 'PUT', body: JSON.stringify({ passwordActual, nuevaPassword, confirmarPassword }) }),
};

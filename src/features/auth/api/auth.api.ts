import { http } from '@/services/http.service';
import type { LoginInput, RegisterInput, Session, SessionProfile } from '../types/auth.types';
export const authApi = {
  login: (input: LoginInput) => http<Session>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  register: (input: RegisterInput) => http<{ mensaje: string; correo: string }>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  me: () => http<SessionProfile>('/auth/me'),
};

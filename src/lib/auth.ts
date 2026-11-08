import Cookies from 'js-cookie';
import { cookieService } from '@/lib/cookies';

export const handleLogout = () => {
  // Limpiar todas las cookies de autenticación
  cookieService.clearSession();

  // Redirigir al login y recargar para limpiar estados en memoria
  window.location.href = '/login';
};

export function saveSession(session: {
  token: string;
  role: string;
  distribuidorId?: string | null;
  usuarioId: string;
}) {
  cookieService.set('token', session.token);
  cookieService.set('role', session.role.replace(/^ROLE_/, ''));
  cookieService.set('usuarioId', session.usuarioId);
  if (session.distribuidorId) {
    cookieService.set('distribuidorId', session.distribuidorId);
  } else {
    cookieService.remove('distribuidorId');
  }
}

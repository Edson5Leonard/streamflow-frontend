import { cookieService } from '@/lib/cookies';

export const handleLogout = () => {
  const isClient = cookieService.get('tipoCuenta') === 'CLIENTE';
  const distributorId = cookieService.get('distribuidorId');
  // Limpiar todas las cookies de autenticación
  cookieService.clearSession();

  // Redirigir al login y recargar para limpiar estados en memoria
  const loginUrl = new URL(isClient ? '/cliente/login' : '/login', window.location.origin);
  if (isClient && distributorId) loginUrl.searchParams.set('tienda', distributorId);
  window.location.assign(loginUrl.toString());
};

export function saveSession(session: {
  token: string;
  role: string;
  tipoCuenta?: 'USUARIO' | 'CLIENTE';
  distribuidorId?: string | null;
  usuarioId: string;
}) {
  cookieService.set('token', session.token);
  cookieService.set('role', session.role.replace(/^ROLE_/, ''));
  cookieService.set('tipoCuenta', session.tipoCuenta ?? 'USUARIO');
  cookieService.set('usuarioId', session.usuarioId);
  if (session.distribuidorId) {
    cookieService.set('distribuidorId', session.distribuidorId);
  } else {
    cookieService.remove('distribuidorId');
  }
}

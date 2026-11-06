import Cookies from 'js-cookie';

export const handleLogout = () => {
  // Limpiar todas las cookies de autenticación
  Cookies.remove('token');
  Cookies.remove('role');
  Cookies.remove('distribuidorId');
  Cookies.remove('usuarioId');

  // Redirigir al login y recargar para limpiar estados en memoria
  window.location.href = '/login';
};

export function saveSession(session: {
  token: string;
  role: string;
  distribuidorId?: string | null;
  usuarioId: string;
}) {
  const cookieOptions = { expires: 1, sameSite: 'lax' as const };
  Cookies.set('token', session.token, cookieOptions);
  Cookies.set('role', session.role.replace(/^ROLE_/, ''), cookieOptions);
  Cookies.set('usuarioId', session.usuarioId, cookieOptions);
  if (session.distribuidorId) {
    Cookies.set('distribuidorId', session.distribuidorId, cookieOptions);
  } else {
    Cookies.remove('distribuidorId');
  }
}
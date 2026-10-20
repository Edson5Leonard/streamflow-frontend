import Cookies from 'js-cookie';

export const handleLogout = () => {
  // Limpiar todas las cookies de autenticación
  Cookies.remove('token');
  Cookies.remove('role');
  Cookies.remove('distribuidorId');

  // Redirigir al login y recargar para limpiar estados en memoria
  window.location.href = '/login';
};
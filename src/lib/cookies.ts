import Cookies from 'js-cookie';

export const SESSION_COOKIE_KEYS = ['token', 'role', 'tipoCuenta', 'distribuidorId', 'usuarioId'] as const;

export const cookieService = {
  get: (key: string) => Cookies.get(key),
  set: (key: string, value: string) => Cookies.set(key, value, { expires: 1, sameSite: 'lax' }),
  remove: (key: string) => Cookies.remove(key),
  clearSession: () => SESSION_COOKIE_KEYS.forEach((key) => Cookies.remove(key)),
};

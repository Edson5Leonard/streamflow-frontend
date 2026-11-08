import Cookies from 'js-cookie';
import { env } from '@/config/env';

function headers(options: RequestInit = {}) {
  const result = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !result.has('Content-Type')) {
    result.set('Content-Type', 'application/json');
  }

  const token = Cookies.get('token');
  if (token) result.set('Authorization', `Bearer ${token}`);
  return result;
}

export async function http<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${env.apiUrl}${endpoint}`, { ...options, headers: headers(options) });
  const raw = response.status === 204 ? '' : await response.text();
  const body: unknown = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const error = body as { error?: string; message?: string } | null;
    throw new Error(error?.error ?? error?.message ?? `Error HTTP ${response.status}`);
  }
  return body as T;
}

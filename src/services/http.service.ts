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
  const response = await fetch(`${env.apiUrl}${endpoint}`, {
    ...options,
    cache: 'no-store',
    headers: headers(options),
  });
  const raw = response.status === 204 ? '' : await response.text();
  let body: unknown = null;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
  }

  if (!response.ok) {
    const error = body as { error?: string; message?: string } | string | null;
    const message = typeof error === 'string'
      ? `Error HTTP ${response.status}`
      : error?.error ?? error?.message ?? `Error HTTP ${response.status}`;
    throw new Error(message);
  }
  return body as T;
}

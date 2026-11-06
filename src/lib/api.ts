import Cookies from 'js-cookie';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api').replace(/\/$/, '');

function createHeaders(options: RequestInit = {}): Headers {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = Cookies.get('token');
  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }
  return headers;
}

async function getErrorMessage(response: Response): Promise<string> {
  const responseText = await response.text();
  if (!responseText) {
    return 'Ocurrió un error en la petición al servidor';
  }
  try {
    const body = JSON.parse(responseText) as { error?: string; message?: string };
    return body.error ?? body.message ?? responseText;
  } catch {
    return responseText;
  }
}

export async function fetchApi<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: createHeaders(options),
  });

  const responseText = response.status === 204 ? '' : await response.text();
  let responseBody: unknown = null;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    const body = responseBody as { error?: string; message?: string } | string | null;
    const message = typeof body === 'string'
      ? body
      : body?.error ?? body?.message ?? `El servidor rechazó la petición (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return responseBody as T;
}

export async function fetchApiBlob(endpoint: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers: createHeaders() });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.blob();
}

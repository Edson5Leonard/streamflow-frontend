import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

function request(path: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: { cookie: 'token=test; role=COMPRADOR; tipoCuenta=CLIENTE; distribuidorId=store' },
  });
}

describe('client routes', () => {
  it('allows a client session to open the buyer catalog', () => {
    expect(proxy(request('/dashboard/catalogo')).headers.get('x-middleware-next')).toBe('1');
  });

  it('does not allow a client session to open distributor pages', () => {
    expect(proxy(request('/admin')).headers.get('location')).toBe('http://localhost:3000/cliente/portal');
  });
});

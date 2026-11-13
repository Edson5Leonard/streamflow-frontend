// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_HOME } from '@/config/permissions.config';
import type { UserRole } from '@/constants/roles.constants';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // O decodificar el JWT de tus cookies/session
  const userRole = req.cookies.get('role')?.value; // SUPER_ADMIN, DISTRIBUIDOR, COMPRADOR
  const accountType = req.cookies.get('tipoCuenta')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/cliente/portal')) {
    if (!token || accountType !== 'CLIENTE') {
      const loginUrl = new URL('/cliente/login', req.url);
      const distribuidorId = req.cookies.get('distribuidorId')?.value;
      if (distribuidorId) loginUrl.searchParams.set('distribuidorId', distribuidorId);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 1. Si intenta entrar a rutas privadas sin token
  if (!token && (pathname.startsWith('/superadmin') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = userRole?.replace(/^ROLE_/, '') as UserRole | undefined;
  const requiredRole: UserRole = pathname.startsWith('/superadmin') ? 'SUPER_ADMIN' : pathname.startsWith('/admin') ? 'DISTRIBUIDOR' : 'COMPRADOR';
  if (!role || !Object.hasOwn(ROLE_HOME, role)) return NextResponse.redirect(new URL('/login', req.url));
  if ((pathname.startsWith('/dashboard') && accountType === 'CLIENTE')
    || ((pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) && accountType === 'CLIENTE')) {
    return NextResponse.redirect(new URL('/cliente/portal', req.url));
  }
  if (role !== requiredRole) return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*', '/dashboard/:path*', '/cliente/portal/:path*'],
};

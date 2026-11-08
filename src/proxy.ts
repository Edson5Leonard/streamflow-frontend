// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_HOME } from '@/config/permissions.config';
import type { UserRole } from '@/constants/roles.constants';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // O decodificar el JWT de tus cookies/session
  const userRole = req.cookies.get('role')?.value; // SUPER_ADMIN, DISTRIBUIDOR, COMPRADOR
  const { pathname } = req.nextUrl;

  // 1. Si intenta entrar a rutas privadas sin token
  if (!token && (pathname.startsWith('/superadmin') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = userRole?.replace(/^ROLE_/, '') as UserRole | undefined;
  const requiredRole: UserRole = pathname.startsWith('/superadmin') ? 'SUPER_ADMIN' : pathname.startsWith('/admin') ? 'DISTRIBUIDOR' : 'COMPRADOR';
  if (!role || !Object.hasOwn(ROLE_HOME, role)) return NextResponse.redirect(new URL('/login', req.url));
  if (role !== requiredRole) return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*', '/dashboard/:path*'],
};

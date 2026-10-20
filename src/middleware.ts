// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // O decodificar el JWT de tus cookies/session
  const userRole = req.cookies.get('role')?.value; // SUPER_ADMIN, DISTRIBUIDOR, COMPRADOR
  const { pathname } = req.nextUrl;

  // 1. Si intenta entrar a rutas privadas sin token
  if (!token && (pathname.startsWith('/superadmin') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Control de accesos por Rol
  if (pathname.startsWith('/superadmin') && userRole !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/admin') && userRole !== 'DISTRIBUIDOR') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname.startsWith('/dashboard') && userRole !== 'COMPRADOR') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*', '/dashboard/:path*'],
};
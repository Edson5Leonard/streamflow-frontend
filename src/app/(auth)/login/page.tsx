'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulación de respuesta JWT según el correo ingresado
      const mockRole = email.includes('super')
        ? 'SUPER_ADMIN'
        : email.includes('admin')
        ? 'DISTRIBUIDOR'
        : 'COMPRADOR';

      // Guardar cookies
      Cookies.set('token', 'mock-jwt-token-123456', { expires: 1 });
      Cookies.set('role', mockRole, { expires: 1 });

      // Redirección
      if (mockRole === 'SUPER_ADMIN') router.push('/superadmin');
      else if (mockRole === 'DISTRIBUIDOR') router.push('/admin');
      else router.push('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas o problema de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950 p-4 relative">
      
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-2xl shadow-blue-950/20 space-y-6">
        
        {/* Botón Volver al Landing Page */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-blue-400 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">¡Bienvenido de nuevo!</h2>
          <p className="text-sm text-gray-400">Ingresa tus credenciales para acceder a tu panel</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-950/60 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-950/60 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/25 transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlace para Crear Cuenta */}
        <div className="pt-4 border-t border-gray-800/60 text-center">
          <p className="text-sm text-gray-400">
            ¿Aún no tienes una cuenta?{' '}
            <Link
              href="/registro"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
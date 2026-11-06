'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tenantQuery, setTenantQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    Promise.resolve().then(() => {
      const distribuidorId = new URLSearchParams(window.location.search).get('distribuidorId');
      if (distribuidorId) setTenantQuery(`?distribuidorId=${encodeURIComponent(distribuidorId)}`);
    });
  }, []);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const distribuidorId = new URLSearchParams(window.location.search).get('distribuidorId');
      if (!distribuidorId) {
        throw new Error('Abre el enlace de registro de tu distribuidor para crear tu cuenta en su tienda.');
      }
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nombreCompleto: nombre,
          correo: email,
          password,
          distribuidorId,
        }),
      });
      setLoading(false);
      router.push(`/login?distribuidorId=${encodeURIComponent(distribuidorId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el registro.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-2xl shadow-indigo-950/20 space-y-6">
        
        {/* Botón Volver al Landing Page */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-indigo-400 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Crear una Cuenta</h2>
          <p className="text-sm text-gray-400">Regístrate para comprar servicios de streaming en tu tienda</p>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegistro} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-950/60 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

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
              className="w-full px-4 py-3 rounded-xl bg-gray-950/60 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
              className="w-full px-4 py-3 rounded-xl bg-gray-950/60 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Completar Registro'}
          </button>
        </form>

        {/* Enlace para Iniciar Sesión */}
        <div className="pt-4 border-t border-gray-800/60 text-center">
          <p className="text-sm text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href={`/login${tenantQuery}`}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
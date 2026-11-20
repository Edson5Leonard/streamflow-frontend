'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { authApi } from '@/features/auth/api/auth.api';
import { getStoreHref } from '@/features/stores/utils/stores.utils';

export function ForgotPasswordForm({ distributorId }: { distributorId?: string }) {
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [correo, setCorreo] = useState('');
  const [token, setToken] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.forgotPassword(correo);
      setMessage(res.mensaje);
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.resetPassword(token, nuevaPassword);
      setMessage(res.mensaje);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'done') {
    return (
      <div className="sf-auth-notice">
        <CheckCircle2 size={22} aria-hidden="true" />
        <h2>Contraseña actualizada</h2>
        <p>{message ?? 'Ya puedes iniciar sesión con tu nueva contraseña.'}</p>
        <Link className="sf-auth-action" href={distributorId ? getStoreHref(distributorId) : '/login'}>
          Ir a iniciar sesión <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="sf-auth-notice">
      {step === 'request' ? (
        <form onSubmit={handleRequest} className="space-y-4 w-full text-left">
          <div className="flex items-center gap-2"><Mail size={20} /><h2 className="m-0">Recuperar contraseña</h2></div>
          <p>Ingresa tu correo para generar un token de recuperación válido por 30 minutos.</p>
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="sf-auth-action w-full justify-center">
            {loading ? 'Enviando...' : 'Solicitar recuperación'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4 w-full text-left">
          <div className="flex items-center gap-2"><KeyRound size={20} /><h2 className="m-0">Ingresar token</h2></div>
          {message && <p className="text-sm opacity-80">{message}</p>}
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token UUID recibido"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
          />
          <input
            type="password"
            required
            minLength={6}
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            className="w-full rounded-md border px-3 py-2 bg-transparent"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="sf-auth-action w-full justify-center">
            {loading ? 'Actualizando...' : 'Restablecer contraseña'}
          </button>
        </form>
      )}
    </div>
  );
}

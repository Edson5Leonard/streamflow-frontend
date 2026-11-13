'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/auth';
import { clientPortalApi } from '@/features/client-portal/api';

export function ClientLoginForm({ initialDistributorId = '' }: { initialDistributorId?: string }) {
  const router = useRouter();
  const [distribuidorId, setDistribuidorId] = useState(initialDistributorId);
  const [whatsapp, setWhatsapp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const session = await clientPortalApi.login({ distribuidorId: distribuidorId.trim(), whatsapp: whatsapp.trim(), pin });
      saveSession({ ...session, role: session.role, tipoCuenta: 'CLIENTE' });
      router.replace('/cliente/portal');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">Portal de cliente</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ingresa con el WhatsApp y el PIN enviados por tu tienda.</p>
      </div>
      <label className="block space-y-2 text-sm font-medium">
        ID de tienda
        <input required value={distribuidorId} onChange={(event) => setDistribuidorId(event.target.value)}
          autoComplete="off" className="h-11 w-full rounded-lg border bg-background px-3 font-normal" />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        WhatsApp
        <input required type="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)}
          autoComplete="tel" className="h-11 w-full rounded-lg border bg-background px-3 font-normal" />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        PIN de seis dígitos
        <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
          autoComplete="one-time-code" className="h-11 w-full rounded-lg border bg-background px-3 font-normal tracking-[0.3em]" />
      </label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={isSubmitting} className="h-11 w-full rounded-lg bg-primary px-4 font-medium text-primary-foreground disabled:opacity-60">
        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
      </button>
      <p className="text-xs text-muted-foreground">Si tu PIN temporal venció, contacta directamente a tu tienda.</p>
    </form>
  );
}

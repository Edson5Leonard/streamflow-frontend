'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { cookieService } from '@/lib/cookies';
import { clientPortalApi, type ClientOrder, type ClientProfile } from '@/features/client-portal/api';
import { ClaimForm } from '@/features/claims/components/ClaimForm';
import { AutoGuaranteeResultCard } from '@/features/claims/components/AutoGuaranteeResultCard';
import type { AutoGuaranteeResult } from '@/features/claims/types/claims.types';

export default function ClientPortalPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [pinActual, setPinActual] = useState('');
  const [pinNuevo, setPinNuevo] = useState('');
  const [pinConfirmacion, setPinConfirmacion] = useState('');
  const [activeClaimVentaId, setActiveClaimVentaId] = useState('');
  const [claimResults, setClaimResults] = useState<Record<string, AutoGuaranteeResult>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingPin, setSavingPin] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const currentProfile = await clientPortalApi.profile();
      setProfile(currentProfile);
      setOrders(currentProfile.pinDebeCambiar ? [] : await clientPortalApi.orders());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el portal.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    clientPortalApi.profile()
      .then(async (currentProfile) => {
        const currentOrders = currentProfile.pinDebeCambiar ? [] : await clientPortalApi.orders();
        if (active) {
          setProfile(currentProfile);
          setOrders(currentOrders);
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el portal.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function changePin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (pinNuevo !== pinConfirmacion) {
      setError('El PIN nuevo y su confirmación no coinciden.');
      return;
    }
    if (!/^\d{6}$/.test(pinNuevo)) {
      setError('El PIN nuevo debe tener seis dígitos.');
      return;
    }
    setSavingPin(true);
    try {
      await clientPortalApi.changePin(pinActual, pinNuevo);
      setPinActual('');
      setPinNuevo('');
      setPinConfirmacion('');
      setMessage('PIN actualizado. Ya puedes consultar tus pedidos.');
      await load();
    } catch (pinError) {
      setError(pinError instanceof Error ? pinError.message : 'No se pudo actualizar el PIN.');
    } finally {
      setSavingPin(false);
    }
  }

  function logout() {
    cookieService.clearSession();
    const distributorId = profile?.distribuidorId;
    window.location.href = distributorId
      ? `/cliente/login?tienda=${encodeURIComponent(distributorId)}`
      : '/cliente/login';
  }

  if (loading) return <main className="mx-auto max-w-4xl p-6" role="status">Cargando tu portal…</main>;
  if (error && !profile) {
    return <main className="mx-auto max-w-4xl space-y-4 p-6"><p role="alert" className="text-destructive">{error}</p>
      <button onClick={() => void load()} className="rounded-lg border px-4 py-2">Reintentar</button>
      <Link href="/cliente/login" className="ml-3 text-sm underline">Volver al inicio de sesión</Link></main>;
  }
  if (!profile) return null;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">{profile.tiendaNombre}</p>
          <h1 className="mt-1 text-2xl font-semibold">Hola, {profile.nombreCompleto}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tus pedidos y accesos entregados.</p>
        </div>
        <button onClick={logout} className="rounded-lg border px-4 py-2 text-sm">Cerrar sesión</button>
      </header>

      {profile.pinDebeCambiar ? (
        <form onSubmit={changePin} className="max-w-lg space-y-4 rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Cambia tu PIN temporal</h2>
          <p className="text-sm text-muted-foreground">Debes crear un PIN personal de seis dígitos antes de ver los accesos entregados.</p>
          <PinField label="PIN temporal actual" value={pinActual} onChange={setPinActual} />
          <PinField label="PIN nuevo" value={pinNuevo} onChange={setPinNuevo} />
          <PinField label="Confirmar PIN nuevo" value={pinConfirmacion} onChange={setPinConfirmacion} />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button disabled={savingPin} className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-60">
            {savingPin ? 'Guardando…' : 'Guardar PIN'}
          </button>
        </form>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Mis pedidos</h2>
            <button onClick={() => void load()} className="rounded-lg border px-3 py-2 text-sm">Actualizar</button>
          </div>
          {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {orders.length === 0 ? <p className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">Todavía no tienes pedidos.</p> :
            orders.map((order) => <article key={order.pedidoId} className="space-y-4 rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-semibold">Pedido {order.pedidoId}</h3>
                <span className="text-sm">{order.estado} · {formatDate(order.fechaSolicitud)}</span>
              </div>
              <p className="text-sm">Total: {formatCurrency(order.montoTotal)}</p>
              {order.motivoRechazo && <p className="text-sm text-destructive">{order.motivoRechazo}</p>}
              {order.entregas.map((delivery) => <div key={delivery.ventaId} className="space-y-4 rounded-xl bg-muted/50 p-4">
                <div>
                  <h4 className="font-medium">{delivery.servicio}</h4>
                  <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                    <Credential label="Usuario" value={delivery.correo} />
                    <Credential label="Contraseña" value={delivery.password} />
                    {delivery.perfilPin && <Credential label="PIN de perfil" value={delivery.perfilPin} />}
                  </dl>
                </div>
                {claimResults[delivery.ventaId] ? <AutoGuaranteeResultCard result={claimResults[delivery.ventaId]} /> :
                  activeClaimVentaId === delivery.ventaId ? <ClaimForm ventaId={delivery.ventaId}
                    onSuccess={(result) => {
                      setClaimResults((current) => ({ ...current, [delivery.ventaId]: result }));
                      setActiveClaimVentaId('');
                    }} /> :
                    <button type="button" onClick={() => setActiveClaimVentaId(delivery.ventaId)}
                      className="rounded-lg border px-3 py-2 text-sm">Reportar problema</button>}
              </div>)}
              {order.estado === 'ENTREGADO' && order.entregas.length === 0 &&
                <p className="text-sm text-muted-foreground">Los accesos de este pedido no están disponibles. Contacta a tu tienda.</p>}
            </article>)}
        </section>
      )}
    </main>
  );
}

function PinField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block space-y-2 text-sm font-medium">{label}
    <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
      className="h-11 w-full rounded-lg border bg-background px-3 tracking-[0.3em]" />
  </label>;
}

function Credential({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-muted-foreground">{label}</dt><dd className="break-all font-mono">{value}</dd></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es', { style: 'currency', currency: 'PEN' }).format(value);
}

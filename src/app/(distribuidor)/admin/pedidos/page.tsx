'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { DistributorCover } from '../componentes/DistributorCover';
import { FadeIn } from '@/components/animation/FadeIn';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { paymentsService } from '@/features/payments/services/payments.service';
import { ordersApi } from '@/features/orders/api/orders.api';
import type { DistributorOrder, OrderStatus } from '@/features/orders/types/orders.types';
import { formatCurrency } from '@/utils/format-currency';

const ORDER_QUERY_KEY = ['orders', 'distributor'];
const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE_REVISION: 'Por revisar',
  PAGADO: 'Pagado',
  ENTREGA_PENDIENTE: 'Pendiente de entrega',
  ENTREGADO: 'Entregado',
  RECHAZADO: 'Rechazado',
};
const statusClasses: Record<OrderStatus, string> = {
  PENDIENTE_REVISION: 'bg-amber-100 text-amber-800',
  PAGADO: 'bg-emerald-100 text-emerald-800',
  ENTREGA_PENDIENTE: 'bg-violet-100 text-violet-800',
  ENTREGADO: 'bg-sky-100 text-sky-800',
  RECHAZADO: 'bg-red-100 text-red-800',
};
const filters: { value: 'TODOS' | OrderStatus; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'PENDIENTE_REVISION', label: 'Por revisar' },
  { value: 'ENTREGA_PENDIENTE', label: 'Pendiente de entrega' },
  { value: 'ENTREGADO', label: 'Entregados' },
  { value: 'RECHAZADO', label: 'Rechazados' },
];

export default function OrdersPage() {
  const profile = useProfile();
  const queryClient = useQueryClient();
  const orders = useQuery({
    queryKey: [...ORDER_QUERY_KEY, profile.data?.usuarioId ?? ''],
    queryFn: ordersApi.list,
    enabled: Boolean(profile.data?.usuarioId),
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'TODOS' | OrderStatus>('TODOS');
  const [action, setAction] = useState<'aprobar' | 'rechazar' | null>(null);
  const [reason, setReason] = useState('');
  const [pin, setPin] = useState('');
  const [whatsAppLink, setWhatsAppLink] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const approve = useMutation({ mutationFn: ordersApi.approve });
  const reject = useMutation({ mutationFn: ({ id, motivo }: { id: string; motivo: string }) => ordersApi.reject(id, motivo) });
  const regeneratePin = useMutation({ mutationFn: ordersApi.regeneratePin });
  const createWhatsAppLink = useMutation({ mutationFn: ({ id, pinTemporal }: { id: string; pinTemporal?: string }) => ordersApi.createWhatsAppLink(id, pinTemporal) });
  const markDelivered = useMutation({ mutationFn: ordersApi.markDelivered });

  const selected = orders.data?.find((order) => order.id === selectedId) ?? null;
  const pendingCount = orders.data?.filter((order) => order.estado === 'PENDIENTE_REVISION').length ?? 0;
  const visibleOrders = (orders.data ?? [])
    .filter((order) => filter === 'TODOS' || order.estado === filter)
    .sort((a, b) => b.fechaSolicitud.localeCompare(a.fechaSolicitud));

  function closeDetails() {
    setSelectedId(null);
    setAction(null);
    setPin('');
    setWhatsAppLink('');
    setError('');
  }

  async function viewVoucher(order: DistributorOrder) {
    try {
      const name = order.comprobanteUrl.startsWith('mock:')
        ? order.comprobanteUrl
        : order.comprobanteUrl.split('/').pop() ?? '';
      const blob = await paymentsService.getVoucher(name);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo abrir el comprobante.');
    }
  }

  async function submitReview() {
    if (!selected || !action) return;
    setError('');
    try {
      if (action === 'aprobar') {
        const result = await approve.mutateAsync(selected.id);
        setPin(result.pinTemporal ?? '');
        setMessage('Pago aprobado. Continúa con la entrega por WhatsApp.');
      } else {
        if (!reason.trim()) {
          setError('Ingresa el motivo del rechazo.');
          return;
        }
        await reject.mutateAsync({ id: selected.id, motivo: reason.trim() });
        setMessage('Pedido rechazado.');
      }
      setAction(null);
      await queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo procesar el pedido.');
    }
  }

  async function issuePin() {
    if (!selected) return;
    setError('');
    try {
      const result = await regeneratePin.mutateAsync(selected.id);
      setPin(result.pinTemporal ?? '');
      setMessage('Se generó un nuevo PIN temporal. Guárdalo antes de salir.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo generar el PIN.');
    }
  }

  async function prepareWhatsApp() {
    if (!selected) return;
    setError('');
    if (selected.requierePinTemporal && !/^\d{6}$/.test(pin)) {
      setError('Ingresa o genera el PIN temporal de seis dígitos.');
      return;
    }
    try {
      const result = await createWhatsAppLink.mutateAsync({ id: selected.id, pinTemporal: pin || undefined });
      setWhatsAppLink(result.enlace);
      setMessage('Enlace listo. Revísalo y envía el mensaje al cliente.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo preparar el enlace de WhatsApp.');
    }
  }

  async function confirmDelivered() {
    if (!selected) return;
    setError('');
    try {
      await markDelivered.mutateAsync(selected.id);
      setMessage('Entrega confirmada.');
      setWhatsAppLink('');
      setPin('');
      await queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo confirmar la entrega.');
    }
  }

  if (profile.isLoading || (!!profile.data && orders.isLoading)) return <LoadingState />;
  if (profile.error || orders.error) {
    return <ErrorState
      description={(profile.error ?? orders.error)?.message}
      onRetry={() => {
        void profile.refetch();
        if (profile.data) void orders.refetch();
      }}
    />;
  }

  return (
    <FadeIn className="space-y-6">
      <DistributorCover title="Pedidos" description="Revisa el comprobante y administra la entrega de cada pedido." value={pendingCount} label="pagos por revisar" />
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
      <section className="sf-dist-panel space-y-5">
        <div>
          <h2>Pedidos de tu tienda</h2>
          <div className="sf-dist-filters mt-4" aria-label="Filtrar pedidos">
            {filters.map((item) => (
              <button type="button" key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {visibleOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No hay pedidos en este filtro.</p>
        ) : (
          <div className="divide-y rounded-xl border">
            {visibleOrders.map((order) => (
              <button
                type="button"
                key={order.id}
                onClick={() => {
                  setSelectedId(order.id);
                  setAction(null);
                  setPin('');
                  setWhatsAppLink('');
                  setError('');
                  setMessage('');
                }}
                className="grid w-full gap-2 p-4 text-left transition hover:bg-muted/50 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <span>
                  <span className="block font-semibold">{order.cliente}</span>
                  <span className="text-xs text-muted-foreground">{order.items.map((item) => item.servicio).join(', ')}</span>
                </span>
                <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.estado]}`}>{statusLabels[order.estado]}</span>
                <span className="text-sm font-semibold">{formatCurrency(order.montoTotal)}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) closeDetails(); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogTitle>Detalle del pedido</DialogTitle>
          <DialogDescription>Pedido {selected?.id}</DialogDescription>
          {selected && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[selected.estado]}`}>{statusLabels[selected.estado]}</span>
                <span className="text-sm font-semibold">{formatCurrency(selected.montoTotal)}</span>
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-muted-foreground">Cliente</dt><dd>{selected.cliente}</dd></div>
                <div><dt className="text-muted-foreground">WhatsApp</dt><dd>{selected.whatsapp ?? 'No disponible'}</dd></div>
                <div><dt className="text-muted-foreground">Método de pago</dt><dd>{selected.metodoPago}</dd></div>
                <div><dt className="text-muted-foreground">Código de operación</dt><dd>{selected.codigoOperacion || 'No indicado'}</dd></div>
                <div><dt className="text-muted-foreground">Fecha</dt><dd>{new Date(selected.fechaSolicitud).toLocaleString('es-PE')}</dd></div>
              </dl>
              <ul className="divide-y rounded-xl border">
                {selected.items.map((item) => (
                  <li key={item.pagoId} className="flex justify-between gap-3 p-3 text-sm">
                    <span>{item.servicio}</span><span>{formatCurrency(item.monto)}</span>
                  </li>
                ))}
              </ul>
              {selected.motivoRechazo && <p className="text-sm text-red-600">Motivo del rechazo: {selected.motivoRechazo}</p>}
              <button type="button" onClick={() => void viewVoucher(selected)} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 underline">
                <FileText size={16} /> Abrir comprobante
              </button>

              {selected.estado === 'PENDIENTE_REVISION' && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setAction('aprobar')} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Aprobar pago</button>
                  <button type="button" onClick={() => setAction('rechazar')} className="rounded-xl border px-4 py-2 text-sm">Rechazar</button>
                </div>
              )}

              {selected.estado === 'ENTREGA_PENDIENTE' && (
                <div className="space-y-3 rounded-xl bg-muted p-4">
                  {selected.requierePinTemporal && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        PIN temporal del cliente
                        <input
                          value={pin}
                          onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3"
                        />
                      </label>
                      <button type="button" disabled={regeneratePin.isPending} onClick={() => void issuePin()} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 disabled:opacity-50">
                        <RefreshCw size={15} /> Generar PIN nuevo
                      </button>
                      {pin && <p className="text-sm">PIN generado: <strong className="font-mono">{pin}</strong>. Cópialo ahora; no se volverá a mostrar.</p>}
                    </div>
                  )}
                  <button type="button" disabled={createWhatsAppLink.isPending} onClick={() => void prepareWhatsApp()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    <MessageCircle size={16} /> Preparar mensaje de WhatsApp
                  </button>
                  {whatsAppLink && (
                    <div className="flex flex-wrap gap-3">
                      <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 underline">
                        <ExternalLink size={15} /> Abrir WhatsApp
                      </a>
                      <button type="button" disabled={markDelivered.isPending} onClick={() => void confirmDelivered()} className="rounded-xl border px-3 py-1.5 text-sm font-semibold disabled:opacity-50">
                        Confirmar entrega realizada
                      </button>
                    </div>
                  )}
                </div>
              )}

              {action && (
                <div className="space-y-3 rounded-xl bg-muted p-4">
                  <p className="text-sm">{action === 'aprobar' ? '¿Confirmas la aprobación del comprobante?' : 'Indica el motivo del rechazo.'}</p>
                  {action === 'rechazar' && (
                    <textarea aria-label="Motivo del rechazo" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} className="min-h-20 w-full rounded-lg border bg-background p-2 text-sm" />
                  )}
                  <button
                    type="button"
                    disabled={approve.isPending || reject.isPending}
                    onClick={() => void submitReview()}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                </div>
              )}
              {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
}

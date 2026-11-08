'use client';
import { useState } from 'react';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { useApproveMembership } from '@/features/memberships/hooks/useApproveMembership';
import { useRejectMembership } from '@/features/memberships/hooks/useRejectMembership';
import { membershipsService } from '@/features/memberships/services/memberships.service';
import { MembershipTable } from '@/features/memberships/components/MembershipTable';
import type { Membership } from '@/features/memberships/types/memberships.types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { NetworkCover } from '../componentes/NetworkCover';
import { FadeIn } from '@/components/animation/FadeIn';
import { OpenVoucher } from '../componentes/OpenVoucher';
export default function MembershipPayments() { const payments = useMemberships(); const approve = useApproveMembership(); const reject = useRejectMembership(); const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Membership | null>(null); const [action, setAction] = useState<'approve' | 'reject' | null>(null); const [reason, setReason] = useState(''); const [error, setError] = useState(''); const [message, setMessage] = useState(''); if (payments.isLoading) return <LoadingState />; if (payments.error) return <ErrorState description={payments.error.message} onRetry={() => void payments.refetch()} />; async function submit() { if (!selected || !action) return; setError(''); if (action === 'reject' && !reason.trim()) { setError('Indica el motivo del rechazo.'); return; } try { if (action === 'approve') await approve.mutateAsync(selected.id); else await reject.mutateAsync({ id: selected.id, motivo: reason }); setSelected(null); setMessage('Solicitud procesada.'); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo procesar el pago.'); } } return <FadeIn className="space-y-6"><NetworkCover title="Pagos de membresía" description="Verifica el comprobante de cada distribuidor antes de aprobar o rechazar su renovación." metric={payments.data?.length ?? 0} label="renovaciones pendientes" />{message && <p role="status" className="text-sm text-emerald-600">{message}</p>}<section className="sf-network-panel">
        <h2>Solicitudes de renovación</h2>
        <div className="sf-network-toolbar">
          <input aria-label="Buscar renovación" placeholder="Buscar por distribuidor o código de operación"
            value={search} onChange={event => setSearch(event.target.value)} />
        </div>
        <MembershipTable memberships={(payments.data ?? []).filter(item =>
          [item.distribuidorNombre, item.codigoOperacion].join(' ').toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'))
        ).sort((a,b) => a.fechaSolicitud.localeCompare(b.fechaSolicitud))} onSelect={(item) => { setSelected(item); setAction(null); setReason(''); setError(''); }} />
      </section>
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent><DialogTitle>Pago de membresía</DialogTitle><DialogDescription>{selected?.distribuidorNombre} · {selected?.metodoPago}</DialogDescription>{selected && <><p className="text-sm">Código: {selected.codigoOperacion || 'No indicado'}</p><OpenVoucher load={() => membershipsService.voucher(selected.comprobanteUrl)} /><div className="flex gap-2"><button onClick={() => setAction('approve')} className="rounded-xl bg-violet-600 px-3 py-2 text-sm text-white">Aprobar</button><button onClick={() => setAction('reject')} className="rounded-xl border px-3 py-2 text-sm">Rechazar</button></div>{action && <div className="space-y-3 rounded-xl bg-muted p-3"><p className="text-sm">{action === 'approve' ? '¿Confirmas la aprobación de este pago?' : 'Indica el motivo del rechazo.'}</p>{action === 'reject' && <textarea aria-label="Motivo del rechazo" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} className="w-full rounded-lg border bg-background p-2 text-sm" />}<button disabled={approve.isPending || reject.isPending} onClick={() => void submit()} className="rounded-xl bg-violet-600 px-3 py-2 text-sm text-white">Confirmar</button></div>}{error && <p role="alert" className="text-sm text-red-500">{error}</p>}</>}</DialogContent></Dialog></FadeIn>; }

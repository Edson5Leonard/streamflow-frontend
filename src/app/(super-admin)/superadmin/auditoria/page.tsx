'use client';
import { useState } from 'react';
import { useAudit } from '@/features/audit/hooks/useAudit';
import { useAuditFilters } from '@/features/audit/hooks/useAuditFilters';
import { AuditFilters } from '@/features/audit/components/AuditFilters';
import { AuditTable } from '@/features/audit/components/AuditTable';
import { ClaimEvidenceViewer } from '@/features/claims/components/ClaimEvidenceViewer';
import type { AuditEvent } from '@/features/audit/types/audit.types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { NetworkCover } from '../componentes/NetworkCover';
import { FadeIn } from '@/components/animation/FadeIn';

export default function AuditPage() {
  const audit = useAudit();
  const filters = useAuditFilters(audit.data ?? []);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [action, setAction] = useState<'recover' | 'discard' | 'compensate' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  if (audit.isLoading) return <LoadingState />;
  if (audit.error) return <ErrorState description={audit.error.message} onRetry={() => void audit.refetch()} />;

  async function submit() {
    if (!selected || !action) return;
    setError('');
    try {
      if (action === 'recover') await audit.recover.mutateAsync({ id: selected.id, password });
      else if (action === 'compensate') await audit.compensate.mutateAsync(selected.id);
      else await audit.discard.mutateAsync(selected.id);
      setSelected(null);
      setMessage(action === 'recover' ? 'Cuenta recuperada.' : 'Cuenta compensada en el stock del distribuidor.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la auditoría.');
    }
  }

  const pending = audit.recover.isPending || audit.discard.isPending || audit.compensate.isPending;
  return <FadeIn className="space-y-6">
    <NetworkCover title="Auditoría" description="Revisa las cuentas observadas y las compensaciones de descartes anteriores." metric={audit.data?.length ?? 0} label="casos por revisar" />
    {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
    <section className="sf-network-panel space-y-4">
      <div className="sf-network-panel-header"><h2>Cuentas por revisar</h2>
        {(filters.search || filters.status) && <button className="text-sm underline" onClick={filters.resetFilters}>Limpiar filtros</button>}
      </div>
      <AuditFilters search={filters.search} status={filters.status} onSearch={filters.setSearch} onStatus={filters.setStatus} />
      <AuditTable events={[...filters.filtered].sort((a, b) => a.fechaCreacion.localeCompare(b.fechaCreacion))} onSelect={(item) => { setSelected(item); setAction(null); setPassword(''); setError(''); }} />
    </section>
    <Dialog open={!!selected} onOpenChange={(open) => { if (!open && !pending) setSelected(null); }}>
      <DialogContent>
        <DialogTitle>Revisión de cuenta</DialogTitle>
        <DialogDescription>Venta {selected?.ventaId}</DialogDescription>
        {selected && <>
          <p className="text-sm font-semibold">{selected.categoriaFallo.replaceAll('_', ' ')}</p>
          <p className="text-sm text-muted-foreground">{selected.motivo}</p>
          {selected.distribuidorId && <p className="text-sm">Distribuidor: {selected.distribuidorNombre ?? selected.distribuidorId} {selected.distribuidorNombre && `(${selected.distribuidorId})`}</p>}
          {selected.correoAfectado && <p className="text-sm">Cuenta reportada: {selected.correoAfectado}</p>}
          <ClaimEvidenceViewer url={selected.comprobanteFalloUrl} />
          {selected.problemaAuditoria ? <p role="alert" className="text-sm text-amber-600">{selected.problemaAuditoria}</p> : <>
            {selected.estado === 'DESCARTADO'
              ? <button disabled={pending} onClick={() => setAction('compensate')} className="rounded-xl bg-violet-600 px-3 py-2 text-sm text-white">Compensar descarte anterior</button>
              : <div className="flex gap-2"><button disabled={pending} onClick={() => setAction('recover')} className="rounded-xl bg-violet-600 px-3 py-2 text-sm text-white">Recuperar cuenta</button><button disabled={pending} onClick={() => setAction('discard')} className="rounded-xl border px-3 py-2 text-sm">Descartar cuenta</button></div>}
            {action && <div className="space-y-3 rounded-xl bg-muted p-3">
              <p className="text-sm">{action === 'recover'
                ? 'Ingresa una nueva contraseña de al menos 8 caracteres.'
                : action === 'compensate'
                  ? 'Comprueba que este descarte no se haya compensado fuera del sistema. Se entregará gratis una cuenta del stock global al distribuidor.'
                  : 'Se descartará la cuenta y se entregará gratis otra del mismo servicio desde el stock global. Si no hay stock, no se hará el descarte.'}</p>
              {action === 'recover' && <input aria-label="Nueva contraseña de la cuenta" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="h-10 w-full rounded-lg border bg-background px-3 text-sm" />}
              <button disabled={pending || (action === 'recover' && password.length < 8)} onClick={() => void submit()} className="rounded-xl bg-violet-600 px-3 py-2 text-sm text-white">{pending ? 'Procesando...' : 'Confirmar'}</button>
            </div>}
          </>}
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        </>}
      </DialogContent>
    </Dialog>
  </FadeIn>;
}

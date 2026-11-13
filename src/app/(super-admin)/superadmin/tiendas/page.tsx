'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FadeIn } from '@/components/animation/FadeIn';
import { useAdminStores } from '@/features/stores/hooks/useAdminStores';
import { useAdminStoreAudit } from '@/features/stores/hooks/useAdminStoreAudit';
import { getStoreImageSrc } from '@/features/stores/utils/stores.utils';
import { NetworkCover } from '../componentes/NetworkCover';

export default function StoresAdminPage() {
  const [distributorId, setDistributorId] = useState('');
  const stores = useAdminStores();
  const audit = useAdminStoreAudit(distributorId || undefined);
  if (stores.isLoading || audit.isLoading) return <LoadingState />;
  const error = stores.error ?? audit.error;
  if (error) return <ErrorState description={error.message} onRetry={() => { void stores.refetch(); void audit.refetch(); }} />;

  return <FadeIn className="space-y-6">
    <NetworkCover title="Tiendas" description="Consulta los perfiles públicos y cambios registrados en cada tienda." metric={stores.data?.length ?? 0} label="tiendas registradas" />
    <section className="sf-network-panel space-y-4">
      <h2>Tiendas de distribuidores</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
        <thead><tr><th className="p-2">Tienda</th><th className="p-2">Distribuidor</th><th className="p-2">Estado</th><th className="p-2">Membresía</th><th className="p-2">WhatsApp</th></tr></thead>
        <tbody>{(stores.data ?? []).map(store => <tr key={store.distribuidorId} className="border-t">
          <td className="p-2"><div className="flex items-center gap-2">{store.logoUrl && <Image unoptimized src={getStoreImageSrc(store.logoUrl)!} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />}<div><strong>{store.nombreTienda}</strong><p className="max-w-56 truncate text-xs text-muted-foreground">{store.descripcion || 'Sin descripción'}</p></div></div></td>
          <td className="p-2">{store.nombreDistribuidor}<p className="text-xs text-muted-foreground">{store.correoDistribuidor}</p></td>
          <td className="p-2">{store.activa ? 'Activa' : 'Suspendida'}</td>
          <td className="p-2">{store.membresiaHasta ?? 'Sin fecha'}</td>
          <td className="p-2">{store.whatsapp || '—'}</td>
        </tr>)}</tbody>
      </table></div>
    </section>
    <section className="sf-network-panel space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2>Auditoría de tiendas</h2><p className="text-sm text-muted-foreground">Se muestran hasta 1000 cambios recientes.</p></div>
        <label className="text-sm">Filtrar tienda<select value={distributorId} onChange={event => setDistributorId(event.target.value)} className="ml-2 h-10 rounded-xl border bg-background px-3">
          <option value="">Todas las tiendas</option>{(stores.data ?? []).map(store => <option key={store.distribuidorId} value={store.distribuidorId}>{store.nombreTienda}</option>)}
        </select></label>
      </div>
      {(audit.data ?? []).length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
        <thead><tr><th className="p-2">Fecha</th><th className="p-2">Distribuidor</th><th className="p-2">Actor</th><th className="p-2">Campo</th><th className="p-2">Anterior</th><th className="p-2">Nuevo</th></tr></thead>
        <tbody>{(audit.data ?? []).map(entry => <tr key={entry.id} className="border-t">
          <td className="p-2">{new Date(entry.fecha).toLocaleString('es-PE')}</td><td className="p-2">{(stores.data ?? []).find(item => item.distribuidorId === entry.distribuidorId)?.nombreTienda ?? entry.distribuidorId}</td>
          <td className="p-2">{entry.actorId}</td><td className="p-2">{entry.campo}</td>
          <td className="max-w-56 truncate p-2">{entry.valorAnterior ?? '—'}</td><td className="max-w-56 truncate p-2">{entry.valorNuevo ?? '—'}</td>
        </tr>)}</tbody>
      </table></div> : <p className="rounded-xl border p-4 text-sm text-muted-foreground">No hay cambios para mostrar.</p>}
    </section>
  </FadeIn>;
}

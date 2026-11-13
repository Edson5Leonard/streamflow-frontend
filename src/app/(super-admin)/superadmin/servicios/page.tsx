'use client';
import { useState, type FormEvent } from 'react';
import { useServices } from '@/features/services/hooks/useServices';
import { useUpdateServicePrice } from '@/features/services/hooks/useUpdateServicePrice';
import { useUpdateServiceMinimumPrice } from '@/features/services/hooks/useUpdateServiceMinimumPrice';
import { ServiceForm } from '@/features/services/components/ServiceForm';
import { ServiceTable } from '@/features/services/components/ServiceTable';
import type { Service } from '@/features/services/types/services.types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { NetworkCover } from '../componentes/NetworkCover';
import { FadeIn } from '@/components/animation/FadeIn';

export default function ServicesPage() {
  const services = useServices();
  const update = useUpdateServicePrice();
  const updateMinimum = useUpdateServiceMinimumPrice();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Service | null>(null);
  const [minimumSelected, setMinimumSelected] = useState<Service | null>(null);
  const [price, setPrice] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [message, setMessage] = useState('');

  if (services.isLoading) return <LoadingState />;
  if (services.error) return <ErrorState description={services.error.message} onRetry={() => void services.refetch()} />;

  async function submitPrice(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      await update.mutateAsync({ id: selected.id, precioReposicion: Number(price) });
      setSelected(null);
      setMessage('Precio de reposición actualizado.');
    } catch { /* mutation exposes the error */ }
  }

  async function submitMinimumPrice(event: FormEvent) {
    event.preventDefault();
    if (!minimumSelected) return;
    try {
      await updateMinimum.mutateAsync({
        id: minimumSelected.id,
        precioMinimoVenta: minimumPrice.trim() === '' ? null : Number(minimumPrice),
      });
      setMinimumSelected(null);
      setMessage('Precio mínimo actualizado.');
    } catch { /* mutation exposes the error */ }
  }

  return (
    <FadeIn className="space-y-6">
      <NetworkCover title="Servicios" description="Gestiona los planes y precios de la red." metric={services.data?.filter(item => item.activo).length ?? 0} label="servicios activos" />
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
      <details className="sf-network-disclosure"><summary>Crear servicio</summary><ServiceForm onSuccess={() => setMessage('Servicio creado.')} /></details>
      <section className="sf-network-panel">
        <h2>Catálogo de la red</h2>
        <div className="sf-network-toolbar">
          <input aria-label="Buscar servicio" placeholder="Buscar por nombre" value={search} onChange={event => setSearch(event.target.value)} />
          <select aria-label="Categoría del servicio" value={category} onChange={event => setCategory(event.target.value)}>
            <option value="">Todas las categorías</option>
            {Array.from(new Set(services.data?.map(item => item.categoria))).sort().map(name => <option key={name}>{name}</option>)}
          </select>
        </div>
        <ServiceTable
          services={(services.data ?? []).filter(item =>
            (!category || item.categoria === category) && item.nombre.toLowerCase().includes(search.trim().toLowerCase()))}
          onUpdatePrice={(item) => { setSelected(item); setPrice(item.precioReposicion == null ? '' : String(item.precioReposicion)); update.reset(); }}
          onUpdateMinimumPrice={(item) => { setMinimumSelected(item); setMinimumPrice(item.precioMinimoVenta == null ? '' : String(item.precioMinimoVenta)); updateMinimum.reset(); }}
        />
      </section>
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent>
          <DialogTitle>Precio de reposición</DialogTitle>
          <DialogDescription>{selected?.nombre}</DialogDescription>
          <form onSubmit={submitPrice} className="space-y-3">
            <label className="block text-sm">Precio por unidad (S/)<input type="number" min="0.01" step="0.01" required value={price} onChange={(event) => setPrice(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label>
            {update.error && <p role="alert" className="text-sm text-red-500">{update.error.message}</p>}
            <button disabled={update.isPending} className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white">Guardar precio</button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!minimumSelected} onOpenChange={(open) => { if (!open) setMinimumSelected(null); }}>
        <DialogContent>
          <DialogTitle>Precio mínimo de venta</DialogTitle>
          <DialogDescription>{minimumSelected?.nombre}. Deja vacío para quitar el mínimo.</DialogDescription>
          <form onSubmit={submitMinimumPrice} className="space-y-3">
            <label className="block text-sm">Precio mínimo (S/)<input type="number" min="0" step="0.01" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label>
            {updateMinimum.error && <p role="alert" className="text-sm text-red-500">{updateMinimum.error.message}</p>}
            <button disabled={updateMinimum.isPending} className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white">Guardar mínimo</button>
          </form>
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { AnimatedCard } from '@/components/animation/AnimatedCard';
import { SlideIn } from '@/components/animation/SlideIn';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useStores } from '@/features/stores/hooks/useStores';
import type { Store } from '@/features/stores/types/stores.types';
import { getStoreHref } from '@/features/stores/utils/stores.utils';

const covers = [
  'from-[#282345] via-[#66509e] to-[#b794de]',
  'from-[#372137] via-[#a25373] to-[#efad98]',
  'from-[#18263d] via-[#405284] to-[#969bd3]',
];

function DirectoryCard({ store, index }: { store: Store; index: number }) {
  return (
    <AnimatedCard lift={5} order={index} className="h-full">
      <Link href={getStoreHref(store.id)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-violet-500 transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-950/15">
        <div aria-hidden="true" className={`sf-store-cover relative overflow-hidden bg-gradient-to-br ${covers[index % covers.length]}`}>
          <span className={`sf-store-art sf-store-art--${index % covers.length}`} />
        </div>
        <div className="flex items-center justify-between gap-3 p-5">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">{store.nombreTienda}</h3>
            <span className="mt-1 block text-sm text-muted-foreground">Ver catálogo</span>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:bg-violet-600 group-hover:text-white group-focus-visible:bg-violet-600 group-focus-visible:text-white">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
    </AnimatedCard>
  );
}

export function StoreDirectory() {
  const stores = useStores();
  const [search, setSearch] = useState('');
  const query = search.trim().toLocaleLowerCase('es');
  const results = stores.data?.filter(store => store.nombreTienda.toLocaleLowerCase('es').includes(query));

  return (
    <section id="tiendas" className="scroll-mt-24 pt-14 sm:pt-20">
      <SlideIn revealOnScroll className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Explora las tiendas</h2>
          <p className="mt-2 text-sm text-muted-foreground">Elige una tienda para consultar su catálogo y precios.</p>
        </div>
        <div role="search" className="flex min-h-11 w-full items-center gap-3 rounded-full border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-violet-500 sm:w-64">
          <Search size={17} aria-hidden="true" />
          <input value={search} onChange={event => setSearch(event.target.value)} aria-label="Buscar tienda" placeholder="Buscar por nombre" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          {search && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setSearch('')}><X size={16} /></button>}
        </div>
      </SlideIn>
      {stores.isLoading && (
        <div role="status" aria-label="Cargando tiendas" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(key => <Skeleton key={key} className="h-56 rounded-2xl" />)}
        </div>
      )}
      {stores.error && <ErrorState description={stores.error.message} onRetry={() => void stores.refetch()} />}
      {stores.isSuccess && (results?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((store, index) => <DirectoryCard key={store.id} store={store} index={index} />)}
        </div>
      ) : (
        <EmptyState title={query ? 'Ninguna tienda coincide con tu búsqueda' : 'Todavía no hay tiendas disponibles'} />
      ))}
    </section>
  );
}

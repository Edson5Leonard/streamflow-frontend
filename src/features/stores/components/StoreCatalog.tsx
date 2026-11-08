'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ALL_CATEGORIES } from '../constants/stores.constants';
import { filterProducts, getCategories } from '../utils/stores.utils';
import type { StoreCatalog as StoreCatalogData, StoreProduct } from '../types/stores.types';
import { StoreProductCard } from './StoreProductCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';

export function StoreCatalog({ catalog, loading = false, error, onRetry, onAdd, renderProduct }: { renderProduct?: (product: StoreProduct) => React.ReactNode; catalog?: StoreCatalogData; loading?: boolean; error?: string | null; onRetry?: () => void; onAdd?: (product: StoreProduct) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const products = useMemo(() => catalog?.productos ?? [], [catalog]);
  const categories = useMemo(() => getCategories(products), [products]);
  const filtered = useMemo(() => filterProducts(products, search, category), [products, search, category]);
  if (loading) return <section aria-label="Cargando catálogo" role="status" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-80 rounded-2xl" />)}</section>;
  if (error) return <ErrorState title="No pudimos cargar el catálogo" description={error} onRetry={onRetry} />;
  if (!catalog || products.length === 0) return <EmptyState title="Esta tienda aún no tiene productos" description="Vuelve más tarde para descubrir sus servicios." />;
  return <section><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Explora la colección</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Servicios disponibles</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Encuentra entretenimiento para cada momento.</p></div><div className="relative w-full sm:w-64"><Search size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input aria-label="Buscar servicios" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar servicios..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white" /></div></div><div className="mb-6 flex flex-wrap items-center gap-2"><SlidersHorizontal size={16} className="mr-1 text-slate-400" />{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${category === item ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-violet-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-violet-500/20'}`}>{item}</button>)}</div>{filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((product) => renderProduct ? <div key={product.servicioId}>{renderProduct(product)}</div> : <StoreProductCard key={product.servicioId} product={product} onAdd={onAdd} />)}</div> : <EmptyState title="No encontramos servicios" description="Prueba con otra búsqueda o categoría." />}</section>;
}

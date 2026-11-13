'use client';

import { Clapperboard, Music2, Play, Plus } from 'lucide-react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { formatCurrency } from '@/utils/format-currency';
import type { StoreProduct } from '../types/stores.types';
import { getProductPlanSummary, getStoreImageSrc } from '../utils/stores.utils';

export function StoreProductCard({ product, onAdd, actionLabel = 'Agregar al carrito' }: { product: StoreProduct; onAdd?: (product: StoreProduct) => void; actionLabel?: string }) {
  const reducedMotion = useReducedMotion();
  const available = product.stockDisponible > 0;
  const isMusic = product.categoria.toLocaleLowerCase('es').includes('música');
  const Icon = isMusic ? Music2 : Clapperboard;
  const planSummary = getProductPlanSummary(product);
  const image = getStoreImageSrc(product.imagenUrl);
  return <motion.article whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ duration: 0.22 }} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-violet-500/10 dark:border-white/10 dark:bg-slate-900"><div className="relative grid h-36 place-items-center overflow-hidden bg-gradient-to-br from-[#16133e] via-[#28205b] to-[#5331a4]">{image ? <Image unoptimized src={image} alt="" width={640} height={320} className="absolute inset-0 size-full object-cover" /> : <><span aria-hidden="true" className="absolute -right-6 -top-12 size-32 rounded-full bg-fuchsia-400/20 blur-2xl" /><span className="relative grid size-16 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur"><Icon size={27} /></span></>}<span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">{product.categoria}</span><Play size={15} className="absolute bottom-4 right-4 text-white/60" fill="currentColor" /></div><div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-2"><h3 className="font-bold text-slate-900 dark:text-white">{product.nombre}</h3><span className={`shrink-0 text-[10px] font-semibold ${available ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{available ? 'Disponible' : 'Agotado'}</span></div><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">{product.descripcion || 'Servicio digital disponible en esta tienda.'}</p>{planSummary && <p className="mt-2 text-xs font-medium text-violet-700 dark:text-violet-300">{planSummary}</p>}<div className="mt-4 flex items-end justify-between gap-2"><div><p className="text-[10px] text-slate-400">Precio</p><p className="text-lg font-extrabold text-violet-700 dark:text-violet-300">{formatCurrency(product.precio)}</p></div>{available && <p className="text-[10px] text-slate-400">{product.stockDisponible} disponible{product.stockDisponible === 1 ? '' : 's'}</p>}</div>{onAdd && <button type="button" onClick={() => onAdd(product)} disabled={!available} className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"><Plus size={15} />{available ? actionLabel : 'Sin stock'}</button>}</div></motion.article>;
}

'use client';

import Link from 'next/link';
import { ArrowUpRight, Store as StoreIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Store } from '../types/stores.types';
import { getStoreHref } from '../utils/stores.utils';

export function StoreCard({ store }: { store: Store }) {
  const reducedMotion = useReducedMotion();
  return <motion.div whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ duration: 0.22 }} className="h-full"><Link href={getStoreHref(store.id)} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-white/10 dark:bg-slate-900 dark:hover:border-violet-500/50"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><StoreIcon size={21} /></span><span className="grid size-9 place-items-center rounded-full border border-slate-100 text-slate-400 transition-colors group-hover:bg-violet-600 group-hover:text-white dark:border-white/10"><ArrowUpRight size={17} /></span></div><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Tienda disponible</p><h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">{store.nombreTienda}</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Explora el catálogo y encuentra tus servicios favoritos.</p><span className="mt-6 text-sm font-semibold text-violet-600 dark:text-violet-400">Visitar tienda <span aria-hidden="true">→</span></span></Link></motion.div>;
}

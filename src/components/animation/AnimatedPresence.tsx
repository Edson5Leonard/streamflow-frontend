'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function AnimatedPresence({ children, mode = 'wait', presenceKey = 'presence-content' }: { children: ReactNode; mode?: 'sync' | 'wait' | 'popLayout'; presenceKey?: string }) {
  const reduceMotion = useReducedMotion();
  return <AnimatePresence mode={mode} initial={false}><motion.div key={presenceKey} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduceMotion ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>{children}</motion.div></AnimatePresence>;
}

'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type Props<T> = Omit<HTMLMotionProps<'div'>, 'children'> & { items: T[]; getKey: (item: T, index: number) => string; renderItem: (item: T, index: number) => ReactNode; staggerDelay?: number };
export function AnimatedList<T>({ items, getKey, renderItem, staggerDelay = 0.04, ...props }: Props<T>) {
  const reduceMotion = useReducedMotion();
  return <motion.div {...props}>{items.map((item, index) => <motion.div key={getKey(item, index)} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.22, delay: reduceMotion ? 0 : Math.min(index * staggerDelay, 0.24), ease: 'easeOut' }}>{renderItem(item, index)}</motion.div>)}</motion.div>;
}

'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> & { duration?: number };
export function ScaleIn({ children, duration = 0.22, ...props }: Props) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : duration, ease: 'easeOut' }} {...props}>{children}</motion.div>;
}

'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> & { delay?: number; duration?: number };
export function FadeIn({ children, delay = 0, duration = 0.24, ...props }: Props) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: 'easeOut' }} {...props}>{children}</motion.div>;
}

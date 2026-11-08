'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'div'> & { lift?: number; order?: number };

export function AnimatedCard({ children, lift = 2, order = 0, ...props }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : Math.min(order, 4) * 0.045 } }}
      whileHover={reduced ? undefined : { y: -lift }}
      transition={{ duration: reduced ? 0 : 0.22, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

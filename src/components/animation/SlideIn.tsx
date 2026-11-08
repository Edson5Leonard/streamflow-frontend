'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'div'> & {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  revealOnScroll?: boolean;
};

export function SlideIn({
  children, direction = 'up', distance = 12, duration = 0.3,
  delay = 0, revealOnScroll = false, ...props
}: Props) {
  const reduced = useReducedMotion();
  const offset = {
    up: { y: distance }, down: { y: -distance },
    left: { x: distance }, right: { x: -distance },
  }[direction];
  const visible = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      {...props}
      initial={reduced ? false : { opacity: 0, ...offset }}
      animate={revealOnScroll && !reduced ? undefined : visible}
      whileInView={revealOnScroll && !reduced ? visible : undefined}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

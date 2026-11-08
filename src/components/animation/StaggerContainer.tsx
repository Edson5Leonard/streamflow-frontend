'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants'> & { staggerDelay?: number; delayChildren?: number };
export function StaggerContainer({ children, staggerDelay = 0.045, delayChildren = 0, ...props }: Props) {
  const reduceMotion = useReducedMotion();
  const variants = { hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : staggerDelay, delayChildren: reduceMotion ? 0 : delayChildren } } };
  return <motion.div variants={variants} initial="hidden" animate="visible" {...props}>{children}</motion.div>;
}

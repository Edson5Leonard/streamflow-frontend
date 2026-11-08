import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageContainer({ className, children, ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return <section className={cn('mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-7 lg:px-9 lg:py-9', className)} {...props}>{children}</section>;
}

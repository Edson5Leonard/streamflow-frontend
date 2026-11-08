'use client';

import { ScrollArea as ScrollPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollPrimitive.Root>) { return <ScrollPrimitive.Root className={cn('relative overflow-hidden', className)} {...props}><ScrollPrimitive.Viewport className="size-full rounded-[inherit]">{children}</ScrollPrimitive.Viewport><ScrollPrimitive.Scrollbar orientation="vertical" className="flex touch-none select-none p-0.5 transition-colors"><ScrollPrimitive.Thumb className="relative flex-1 rounded-full bg-border" /></ScrollPrimitive.Scrollbar><ScrollPrimitive.Scrollbar orientation="horizontal" className="flex h-2.5 touch-none select-none flex-col p-0.5"><ScrollPrimitive.Thumb className="relative flex-1 rounded-full bg-border" /></ScrollPrimitive.Scrollbar><ScrollPrimitive.Corner /></ScrollPrimitive.Root>; }

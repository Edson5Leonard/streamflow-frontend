'use client';

import { Dialog as DrawerPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export function DrawerContent({ side = 'right', className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content> & { side?: 'left' | 'right' | 'top' | 'bottom' }) {
  const positions = { left: 'inset-y-0 left-0 h-full w-[min(85vw,24rem)] border-r', right: 'inset-y-0 right-0 h-full w-[min(85vw,24rem)] border-l', top: 'inset-x-0 top-0 max-h-[85vh] w-full border-b', bottom: 'inset-x-0 bottom-0 max-h-[85vh] w-full border-t' };
  return <DrawerPrimitive.Portal><DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" /><DrawerPrimitive.Content className={cn('fixed z-50 overflow-y-auto bg-background p-6 shadow-xl outline-none', positions[side], className)} {...props}>{children}</DrawerPrimitive.Content></DrawerPrimitive.Portal>;
}

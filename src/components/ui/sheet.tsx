'use client';

import { Dialog as SheetPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export function SheetContent({ side = 'right', className, children, ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: 'left' | 'right' | 'top' | 'bottom' }) {
  const positions = { left: 'inset-y-0 left-0 h-full w-[min(85vw,24rem)] border-r', right: 'inset-y-0 right-0 h-full w-[min(85vw,24rem)] border-l', top: 'inset-x-0 top-0 max-h-[85vh] border-b', bottom: 'inset-x-0 bottom-0 max-h-[85vh] border-t' };
  return <SheetPrimitive.Portal><SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" /><SheetPrimitive.Content className={cn('fixed z-50 overflow-y-auto bg-background p-6 shadow-xl outline-none', positions[side], className)} {...props}>{children}<SheetPrimitive.Close aria-label="Cerrar" className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted"><X size={18} /></SheetPrimitive.Close></SheetPrimitive.Content></SheetPrimitive.Portal>;
}

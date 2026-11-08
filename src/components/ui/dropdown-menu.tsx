'use client';

import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuSub = MenuPrimitive.Sub;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;
export function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Content>) { return <MenuPrimitive.Portal><MenuPrimitive.Content sideOffset={6} className={cn('z-50 min-w-36 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props} /></MenuPrimitive.Portal>; }
export function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Item>) { return <MenuPrimitive.Item className={cn('relative flex cursor-default select-none items-center rounded-md px-2.5 py-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props} />; }
export function DropdownMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) { return <MenuPrimitive.CheckboxItem className={cn('relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-2.5 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}><span className="absolute left-2 grid size-4 place-items-center"><MenuPrimitive.ItemIndicator><Check size={14} /></MenuPrimitive.ItemIndicator></span>{children}</MenuPrimitive.CheckboxItem>; }
export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) { return <MenuPrimitive.Label className={cn('px-2.5 py-2 text-xs font-semibold text-muted-foreground', className)} {...props} />; }
export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) { return <MenuPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />; }

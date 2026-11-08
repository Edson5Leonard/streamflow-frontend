'use client';

import { RadioGroup as RadioPrimitive } from 'radix-ui';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RadioGroup = ({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) => <RadioPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />;
export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Item>) { return <RadioPrimitive.Item data-slot="radio-group-item" className={cn('aspect-square size-4 rounded-full border border-input text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}><RadioPrimitive.Indicator className="grid place-items-center"><Circle className="size-2.5 fill-current" /></RadioPrimitive.Indicator></RadioPrimitive.Item>; }

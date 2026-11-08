'use client';

import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;
export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) { return <AccordionPrimitive.Item className={cn('border-b border-border', className)} {...props} />; }
export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) { return <AccordionPrimitive.Header className="flex"><AccordionPrimitive.Trigger className={cn('flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition hover:text-primary [&[data-state=open]>svg]:rotate-180', className)} {...props}>{children}<ChevronDown size={16} className="shrink-0 transition-transform" /></AccordionPrimitive.Trigger></AccordionPrimitive.Header>; }
export function AccordionContent({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) { return <AccordionPrimitive.Content className={cn('overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', className)} {...props}><div className="pb-4 pt-0">{props.children}</div></AccordionPrimitive.Content>; }

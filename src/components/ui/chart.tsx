'use client';

import { ResponsiveContainer, Tooltip } from 'recharts';
import type { ReactNode } from 'react';

export function ChartContainer({ children, height = 280 }: { children: ReactNode; height?: number }) { return <div className="w-full" style={{ height }}><ResponsiveContainer width="100%" height="100%">{children as React.ReactElement}</ResponsiveContainer></div>; }
export function ChartTooltip(props: React.ComponentProps<typeof Tooltip>) { return <Tooltip {...props} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--popover)', color: 'var(--popover-foreground)' }} />; }

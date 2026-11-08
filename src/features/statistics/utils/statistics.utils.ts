import { eachDayOfInterval, eachMonthOfInterval, endOfDay, format, isValid, parseISO, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';
import type { Sale } from '@/features/sales/types/sales.types';
import type { Account } from '@/features/accounts/types/accounts.types';
import type { StatisticsRange, SalesPoint, InventoryPoint } from '../types/statistics.types';

export function isToday(value: string, now = new Date()) {
  const date = parseISO(value);
  return isValid(date) && format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
}

export function buildSalesSeries(sales: Sale[], range: StatisticsRange, now = new Date()): SalesPoint[] {
  const monthly = range === '12m';
  const start = monthly ? startOfMonth(subMonths(now, 11)) : startOfDay(subDays(now, Number.parseInt(range, 10) - 1));
  const dates = monthly ? eachMonthOfInterval({ start, end: now }) : eachDayOfInterval({ start, end: now });
  const pattern = monthly ? 'yyyy-MM' : 'yyyy-MM-dd';
  const points = dates.map((date) => ({ fecha: format(date, pattern), ventas: 0, ingresos: 0 }));
  const byDate = new Map(points.map((point) => [point.fecha, point]));
  sales.forEach((sale) => {
    const date = parseISO(sale.fechaVenta);
    if (!isValid(date) || date < start || date > endOfDay(now)) return;
    const point = byDate.get(format(date, pattern));
    if (point) { point.ventas += 1; point.ingresos += sale.precioPagado; }
  });
  return points;
}

export function buildInventorySeries(accounts: Account[]): InventoryPoint[] {
  const counts = new Map<string, number>();
  accounts.forEach((account) => counts.set(account.estado, (counts.get(account.estado) ?? 0) + 1));
  return Array.from(counts, ([estado, cantidad]) => ({ estado, cantidad }));
}

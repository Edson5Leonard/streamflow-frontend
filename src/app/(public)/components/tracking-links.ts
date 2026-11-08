export type OrderLink = { id: string; tokenPublico: string; nombreServicio?: string };
export function readOrderLinks(raw?: string): OrderLink[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is OrderLink =>
      item && typeof item.id === 'string' && typeof item.tokenPublico === 'string'
      && (!item.nombreServicio || typeof item.nombreServicio === 'string')).slice(0, 20) : [];
  } catch { return []; }
}
export function trackingHref(order: OrderLink, orders: OrderLink[] = []) {
  const query = new URLSearchParams({ token: order.tokenPublico });
  if (orders.length > 1) query.set('pedidos', JSON.stringify(orders));
  return '/seguimiento/' + encodeURIComponent(order.id) + '?' + query;
}

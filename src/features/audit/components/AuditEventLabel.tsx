import type { AuditEvent } from '../types/audit.types';
export function AuditEventLabel({ event }: { event: AuditEvent }) { return <span>{event.categoriaFallo} · {event.ventaId.slice(0, 8)}</span>; }

import type { AuditEvent } from '../types/audit.types';
export const sortAuditNewestFirst = (events: AuditEvent[]) => [...events].sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
export function filterAudit(events: AuditEvent[], search: string, status: string) { const query = search.trim().toLocaleLowerCase('es'); return sortAuditNewestFirst(events.filter((item) => (!status || item.estado === status) && `${item.id} ${item.ventaId} ${item.categoriaFallo} ${item.motivo}`.toLocaleLowerCase('es').includes(query))); }

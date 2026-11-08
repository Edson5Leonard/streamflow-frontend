import type { Claim } from '@/features/claims/types/claims.types';
export type AuditEvent = Claim;
export type AuditAction = 'descartar' | 'recuperar';
export type AuditFilters = { search: string; status: string };

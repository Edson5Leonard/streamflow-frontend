import { env } from '@/config/env';
import { auditApi } from '../api/audit.api';
import { auditMock } from '../mocks/audit.mock';
import { claimsService } from '@/features/claims/services/claims.service';
import { recoverAccountSchema } from '../schemas/audit.schema';
import Cookies from 'js-cookie';
export const auditService = {
  async listObservedClaims() { if (!env.useMocks) return auditApi.listObservedClaims(); if (Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('Solo el superadministrador puede consultar la auditoría.'); return [...auditMock, ...await claimsService.listObserved()]; },
  async discard(id: string) { return env.useMocks ? claimsService.resolveAuditMock(id, 'descartar') : auditApi.discard(id); },
  async recover(id: string, nuevaClave: string) { const data = recoverAccountSchema.parse({ id, nuevaClave }); return env.useMocks ? claimsService.resolveAuditMock(data.id, 'recuperar', data.nuevaClave) : auditApi.recover(data.id, data.nuevaClave); },
};

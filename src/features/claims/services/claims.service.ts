import Cookies from 'js-cookie';
import { env } from '@/config/env';
import { salesService } from '@/features/sales/services/sales.service';
import { paymentsService } from '@/features/payments/services/payments.service';
import { claimsApi } from '../api/claims.api';
import { claimsMock } from '../mocks/claims.mock';
import { claimSchema, publicClaimSchema, replacementSchema } from '../schemas/claim.schema';
import type { Claim, ClaimInput, ClaimStatusUpdate, PublicClaimInput, ReplacementInput } from '../types/claims.types';
import { accountsService } from '@/features/accounts/services/accounts.service';

type MockClaim = Claim & { distribuidorId: string; evidenceData?: string };
const key = 'streamflow:mock-claims:v1';
function read(): MockClaim[] { try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(claimsMock)) as MockClaim[]; } catch { return []; } }
function save(items: MockClaim[]) { localStorage.setItem(key, JSON.stringify(items)); }
function encode(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('No se pudo leer la evidencia.')); reader.readAsDataURL(file); }); }
export const claimsService = {
  async resolveAuditMock(id: string, action: 'descartar' | 'recuperar', password?: string) { if (!env.useMocks || Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('No tienes permiso para auditar este reclamo.'); const items = read(); const item = items.find((claim) => claim.id === id); if (!item || !['REEMPLAZADO_PENDIENTE_AUDITORIA', 'EXPRESS_REEMPLAZADO'].includes(item.estado) || !item.cuentaDefectuosaId) throw new Error('El reclamo ya fue resuelto o no tiene una cuenta observada.'); await accountsService.resolveObservedMock(item.cuentaDefectuosaId, action, password); item.estado = action === 'recuperar' ? 'RECUPERADO' : 'DESCARTADO'; save(items); return item; },
  async listPending() { return env.useMocks ? read().filter((item) => item.distribuidorId === Cookies.get('usuarioId') && item.estado === 'PENDIENTE') : claimsApi.listPending(); },
  async listObserved() { return env.useMocks ? read().filter((item) => ['REEMPLAZADO_PENDIENTE_AUDITORIA', 'EXPRESS_REEMPLAZADO'].includes(item.estado)) : claimsApi.listObserved(); },
  async create(input: ClaimInput) { const valid = claimSchema.parse(input); if (!env.useMocks) return claimsApi.create(valid); const purchases = await salesService.listMyPurchases(); if (!purchases.some((item) => item.id === valid.ventaId)) throw new Error('Solo puedes reportar tus propias compras.'); const distributorId = Cookies.get('distribuidorId'); const userId = Cookies.get('usuarioId'); if (!distributorId || !userId) throw new Error('Inicia sesión para crear un reclamo.'); const id = crypto.randomUUID(); const claim: MockClaim = { id, usuarioId: userId, distribuidorId: distributorId, ventaId: valid.ventaId, categoriaFallo: valid.categoriaFallo, motivo: valid.motivo, comprobanteFalloUrl: `mock:${id}`, evidenceData: await encode(valid.archivo), cuentaDefectuosaId: null, cuentaReemplazoId: null, estado: 'PENDIENTE', fechaCreacion: new Date().toISOString() }; const items = read(); items.push(claim); save(items); return claim; },
  async createPublic(input: PublicClaimInput) { const valid = publicClaimSchema.parse(input); if (!env.useMocks) return claimsApi.createPublic(valid); const tracking = await paymentsService.track(valid.pagoId, valid.token); if (tracking.estado !== 'APROBADO' || !tracking.compra) throw new Error('Solo puedes reclamar por un pedido aprobado y despachado.'); throw new Error('El reclamo público simulado estará disponible cuando se complete el despacho de compras.'); },
  async updateStatus(input: ClaimStatusUpdate) { if (!['RESUELTO', 'RECHAZADO'].includes(input.estado)) throw new Error('El estado no es válido.'); if (!env.useMocks) return claimsApi.updateStatus(input); const items = read(); const index = items.findIndex((item) => item.id === input.id && item.distribuidorId === Cookies.get('usuarioId')); if (index < 0) throw new Error('No se encontró el reclamo de tu tienda.'); items[index] = { ...items[index], estado: input.estado }; save(items); return items[index]; },
  async replace(input: ReplacementInput) { const valid = replacementSchema.parse(input); if (!env.useMocks) return claimsApi.replace(valid); throw new Error('El reemplazo simulado requiere integrar el stock de garantía con ventas.'); },
  async evidence(url: string) { if (!env.useMocks) { const name = url.split('/').pop(); if (!name) throw new Error('Evidencia no válida.'); return claimsApi.evidence(name); } const item = read().find((claim) => claim.comprobanteFalloUrl === url); if (!item?.evidenceData) throw new Error('Evidencia no disponible.'); return (await fetch(item.evidenceData)).blob(); },
};

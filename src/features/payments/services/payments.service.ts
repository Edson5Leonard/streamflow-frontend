import Cookies from 'js-cookie';
import { env } from '@/config/env';
import { storesService } from '@/features/stores/services/stores.service';
import { paymentsApi } from '../api/payments.api';
import { paymentsMock, type MockPayment } from '../mocks/payments.mock';
import { paymentSchema, publicPaymentSchema, rejectPaymentSchema } from '../schemas/payment.schema';
import type { CartPaymentRequest, PaymentRequest, PublicPaymentRequest } from '../types/payments.types';

const storageKey = 'streamflow:mock-payments:v1';
function read(): MockPayment[] { try { return JSON.parse(localStorage.getItem(storageKey) ?? JSON.stringify(paymentsMock)) as MockPayment[]; } catch { return structuredClone(paymentsMock); } }
function save(items: MockPayment[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }
function find(id: string) { const payment = read().find((item) => item.id === id); if (!payment) throw new Error('No se encontró el pago.'); return payment; }
function fileData(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('No se pudo leer el comprobante.')); reader.readAsDataURL(file); }); }
async function createMock(input: PaymentRequest, distribuidorId: string) {
  const catalog = await storesService.getCatalog(distribuidorId);
  const product = catalog.productos.find((item) => item.servicioId === input.servicioId && item.stockDisponible > 0);
  if (!product) throw new Error('El servicio no está disponible en esta tienda.');
  const id = crypto.randomUUID(); const payment: MockPayment = { id, compradorId: Cookies.get('usuarioId') ?? crypto.randomUUID(), distribuidorId, servicioId: product.servicioId, metodoPago: input.metodoPago, monto: product.precio, codigoOperacion: input.codigoOperacion || null, comprobanteUrl: `mock:${id}`, voucherData: await fileData(input.comprobante), estado: 'PENDIENTE', fechaSolicitud: new Date().toISOString(), motivoRechazo: null, tokenPublico: crypto.randomUUID(), nombreServicio: product.nombre };
  const items = read(); items.push(payment); save(items); return payment;
}
function update(id: string, status: 'APROBADO' | 'RECHAZADO', motivo: string | null) { const items = read(); const index = items.findIndex((item) => item.id === id); if (index < 0) throw new Error('No se encontró el pago.'); if (items[index].estado !== 'PENDIENTE') throw new Error('El pago ya fue procesado.'); items[index] = { ...items[index], estado: status, motivoRechazo: motivo }; save(items); return items[index]; }
export const paymentsService = {
  async list(id: string) { return env.useMocks ? read().filter((item) => item.distribuidorId === id) : paymentsApi.list(id); },
  async listMyOrders() { return env.useMocks ? read().filter((item) => item.compradorId === Cookies.get('usuarioId')).map((item) => ({ id: item.id, servicio: item.nombreServicio, monto: item.monto, estado: item.estado, motivoRechazo: item.motivoRechazo, fechaSolicitud: item.fechaSolicitud })) : paymentsApi.listMyOrders(); },
  async get(id: string) { return env.useMocks ? find(id) : paymentsApi.get(id); },
  async track(id: string, token: string) { if (!env.useMocks) return paymentsApi.track(id, token); const item = find(id); if (item.tokenPublico !== token) throw new Error('El enlace de seguimiento no es válido.'); return { id: item.id, estado: item.estado, motivoRechazo: item.motivoRechazo, garantiaUsada: false, compra: null }; },
  async create(input: PaymentRequest) { const valid = paymentSchema.parse(input); if (!env.useMocks) return paymentsApi.create(valid); const id = Cookies.get('distribuidorId'); if (!id) throw new Error('No se encontró la tienda asociada.'); return createMock(valid, id); },
  async createPublic(input: PublicPaymentRequest) { const valid = publicPaymentSchema.parse(input); if (!env.useMocks) return paymentsApi.createPublic(valid); const item = await createMock(valid, valid.distribuidorId); return { id: item.id, estado: item.estado, monto: item.monto, tokenPublico: item.tokenPublico }; },
  async createCart(input: CartPaymentRequest) {
    if (!input.servicioIds.length) throw new Error('Agrega al menos un servicio al carrito.');
    const requests = input.servicioIds.map((servicioId) => publicPaymentSchema.parse({ ...input, servicioId }));
    if (!env.useMocks) return paymentsApi.createCart(input);
    const catalog = await storesService.getCatalog(input.distribuidorId);
    const counts = new Map<string, number>();
    requests.forEach((request) => counts.set(request.servicioId, (counts.get(request.servicioId) ?? 0) + 1));
    counts.forEach((quantity, id) => { const product = catalog.productos.find((item) => item.servicioId === id); if (!product || product.stockDisponible < quantity) throw new Error('No hay stock suficiente para completar el carrito.'); });
    const voucherData = await fileData(input.comprobante); const items = read();
    const created: MockPayment[] = requests.map((request) => { const product = catalog.productos.find((item) => item.servicioId === request.servicioId)!; const id = crypto.randomUUID(); return { id, compradorId: Cookies.get('usuarioId') ?? crypto.randomUUID(), distribuidorId: request.distribuidorId, servicioId: request.servicioId, metodoPago: request.metodoPago, monto: product.precio, codigoOperacion: request.codigoOperacion || null, comprobanteUrl: `mock:${id}`, voucherData, estado: 'PENDIENTE', fechaSolicitud: new Date().toISOString(), motivoRechazo: null, tokenPublico: crypto.randomUUID(), nombreServicio: product.nombre }; });
    save([...items, ...created]); return created.map(({ id, estado, monto, tokenPublico }) => ({ id, estado, monto, tokenPublico }));
  },
  async approve(id: string) { return env.useMocks ? update(id, 'APROBADO', null) : paymentsApi.approve(id); },
  async reject(id: string, motivo: string) { const valid = rejectPaymentSchema.parse({ id, motivo }); return env.useMocks ? update(valid.id, 'RECHAZADO', valid.motivo) : paymentsApi.reject(valid.id, valid.motivo); },
  async getVoucher(name: string) { if (!env.useMocks) return paymentsApi.getVoucher(name); const item = find(name.replace(/^mock:/, '')); if (!item.voucherData) throw new Error('El comprobante no está disponible.'); return (await fetch(item.voucherData)).blob(); },
};

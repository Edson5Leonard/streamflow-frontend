import type { PaymentMethod } from '@/features/payments/types/payments.types';
export type ReplenishmentStatus = 'SOLICITADA' | 'PAGO_PENDIENTE' | 'PAGO_APROBADO' | 'ATENDIDA' | 'RECHAZADA';
export type Replenishment = { id: string; distribuidorId: string; nombreDistribuidor: string; servicioId: string; nombreServicio: string; unidadesSolicitadas: number; precioPropuesto: number; montoCotizado: number; precioAcordado: number | null; metodoPago: PaymentMethod | null; codigoOperacion: string | null; comprobanteUrl: string | null; estado: ReplenishmentStatus; notaAdmin: string | null; fechaCreacion: string; fechaAtencion: string | null };
export type ReplenishmentInput = { servicioId: string; unidades: number };
export type ReplenishmentPayment = { id: string; metodoPago: PaymentMethod; codigoOperacion?: string; comprobante: File };

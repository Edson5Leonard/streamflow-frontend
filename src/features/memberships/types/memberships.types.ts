import type { PaymentMethod } from '@/features/payments/types/payments.types';
export type MembershipStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
export type Membership = { id: string; distribuidorId: string; distribuidorNombre: string; monto: number; comprobanteUrl: string; metodoPago: PaymentMethod; codigoOperacion: string | null; estado: MembershipStatus; motivoRechazo: string | null; fechaVencimiento: string | null; fechaSolicitud: string };
export type MembershipPaymentInput = { metodoPago: PaymentMethod; codigoOperacion?: string; comprobante: File };

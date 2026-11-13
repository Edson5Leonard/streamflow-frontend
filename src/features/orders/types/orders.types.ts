export type OrderStatus =
  | 'PENDIENTE_REVISION'
  | 'PAGADO'
  | 'ENTREGA_PENDIENTE'
  | 'ENTREGADO'
  | 'RECHAZADO';

export type OrderItem = {
  pagoId: string;
  servicioId: string;
  servicio: string;
  monto: number;
};

export type DistributorOrder = {
  id: string;
  cliente: string;
  whatsapp: string | null;
  estado: OrderStatus;
  montoTotal: number;
  metodoPago: string;
  codigoOperacion: string | null;
  comprobanteUrl: string;
  motivoRechazo: string | null;
  fechaSolicitud: string;
  requierePinTemporal: boolean;
  items: OrderItem[];
};

export type OrderApproval = {
  pedidoId: string;
  estado: OrderStatus;
  pinTemporal: string | null;
};

export type OrderWhatsAppLink = {
  pedidoId: string;
  estado: OrderStatus;
  enlace: string;
};

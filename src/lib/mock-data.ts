import { Cuenta } from '@/types/stock';
import { Pago } from '@/types/pago';
import { Reclamo } from '@/types/reclamo';

export const mockPagos: Pago[] = [
  {
    id: 'p-1',
    usuarioId: 'u-101',
    nombreUsuario: 'Juan Pérez (Revendedor)',
    monto: 50.0,
    comprobanteUrl: 'https://placehold.co/400x600/png?text=Comprobante+Yape+S/50',
    estado: 'PENDIENTE',
    fechaCreacion: '2026-10-07 14:30',
  },
  {
    id: 'p-2',
    usuarioId: 'u-102',
    nombreUsuario: 'Carlos Gomez',
    monto: 100.0,
    comprobanteUrl: 'https://placehold.co/400x600/png?text=Comprobante+Plin+S/100',
    estado: 'PENDIENTE',
    fechaCreacion: '2026-10-07 15:10',
  },
];

export const mockCuentas: Cuenta[] = [
  {
    id: 'c-1',
    servicio: 'HBO Max',
    correo: 'hbo1@ejemplo.com',
    password: 'Pass123!4',
    perfil: 'Perfil 1',
    pin: '1234',
    tipoUso: 'VENTA',
    estado: 'DISPONIBLE',
  },
  {
    id: 'c-2',
    servicio: 'HBO Max',
    correo: 'hbo_garantia@ejemplo.com',
    password: 'PassReemplazo99',
    perfil: 'Perfil 2',
    pin: '0000',
    tipoUso: 'GARANTIA',
    estado: 'DISPONIBLE',
  },
];

export const mockReclamos: Reclamo[] = [
  {
    id: 'r-1',
    ventaId: 'v-55',
    servicio: 'HBO Max',
    correoAfectado: 'caido@ejemplo.com',
    categoriaFallo: 'CAIDA',
    comentarioCliente: 'El cliente indica que al entrar le sale pantalla de membresía vencida desde hoy en la tarde.',
    comprobanteFalloUrl: 'https://placehold.co/600x400/png?text=Error+en+Pantalla',
    estado: 'PENDIENTE_AUDITORIA',
    fechaReporte: '2026-10-07 18:10',
  },
];
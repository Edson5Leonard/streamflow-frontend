import { Cuenta } from '@/types/stock';
import { Reclamo } from '@/types/reclamo';

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
    usuarioId: 'u-1',
    ventaId: 'v-55',
    servicio: 'HBO Max',
    correoAfectado: 'caido@ejemplo.com',
    cuentaDefectuosaId: 'c-3',
    categoriaFallo: 'CAIDA',
    motivo: 'El cliente indica que al entrar le sale pantalla de membresía vencida desde hoy en la tarde.',
    comprobanteFalloUrl: 'https://placehold.co/600x400/png?text=Error+en+Pantalla',
    estado: 'PENDIENTE_AUDITORIA',
    fechaCreacion: '2026-10-07 18:10',
  },
];
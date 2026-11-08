import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/utils/format-status';

const variantFor = (status: string) => {
  const value = status.toUpperCase();
  if (['APROBADO', 'DISPONIBLE', 'RESUELTO', 'ATENDIDA'].includes(value)) return 'default' as const;
  if (['RECHAZADO', 'DESCARTADO', 'VENCIDO'].includes(value)) return 'destructive' as const;
  if (['PENDIENTE', 'PENDIENTE_AUDITORIA', 'OBSERVADO'].includes(value)) return 'secondary' as const;
  return 'outline' as const;
};

export function StatusBadge({ status }: { status: string }) { return <Badge variant={variantFor(status)}>{formatStatus(status)}</Badge>; }

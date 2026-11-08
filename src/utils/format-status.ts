const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', RECHAZADO: 'Rechazado',
  DISPONIBLE: 'Disponible', VENDIDO: 'Vendido', RESUELTO: 'Resuelto',
};

export function formatStatus(status: string) {
  return STATUS_LABELS[status.toUpperCase()] ?? status.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

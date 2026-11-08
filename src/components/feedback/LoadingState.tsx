export function LoadingState({ label = 'Cargando...', rows = 3 }: { label?: string; rows?: number }) {
  return <div role="status" aria-label={label} className="space-y-3"><span className="sr-only">{label}</span>{Array.from({ length: rows }, (_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />)}</div>;
}

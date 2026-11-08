export function StoreCatalogSummary({ count }: { count: number }) { return <p className="text-sm text-muted-foreground">{count} {count === 1 ? 'producto disponible' : 'productos disponibles'}</p>; }

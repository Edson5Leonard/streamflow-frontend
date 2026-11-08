import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function NotFoundState({ title = 'No encontramos esta página', description = 'Puede que el enlace haya cambiado o ya no exista.' }: { title?: string; description?: string }) {
  return <section className="grid min-h-[50vh] place-content-center px-6 text-center"><p className="text-sm font-semibold text-primary">404</p><h1 className="mt-2 text-2xl font-semibold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p><Button asChild className="mx-auto mt-6"><Link href="/">Volver al inicio</Link></Button></section>;
}

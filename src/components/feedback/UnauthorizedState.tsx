import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UnauthorizedState({ title = 'No tienes acceso a esta sección', description = 'Inicia sesión con una cuenta que tenga los permisos necesarios.' }: { title?: string; description?: string }) {
  return <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center"><span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground"><ShieldX /></span><h1 className="mt-4 text-xl font-semibold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p><Button asChild className="mt-6"><Link href="/login">Ir a iniciar sesión</Link></Button></section>;
}

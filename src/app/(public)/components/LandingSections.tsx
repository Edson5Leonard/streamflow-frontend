import Link from 'next/link';
import { ArrowRight, Compass, PackageCheck, ShoppingBag } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';

const steps = [
  { icon: Compass, title: 'Entra en una tienda', text: 'Cada distribuidor publica su propio catálogo de servicios.' },
  { icon: ShoppingBag, title: 'Arma tu pedido', text: 'Revisa el precio y la disponibilidad antes de añadir servicios al carrito.' },
  { icon: PackageCheck, title: 'Consulta el seguimiento', text: 'Guarda el enlace de tu pedido para volver a consultar su estado.' },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="my-10 scroll-mt-24 rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-white p-6 sm:my-14 sm:p-10 dark:border-white/10 dark:from-[#211c31] dark:to-[#161724]">
      <SlideIn revealOnScroll>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Cómo funciona</h2>
      </SlideIn>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title}>
            <SlideIn revealOnScroll delay={index * 0.05} className="border-t border-violet-300/60 pt-5 dark:border-violet-400/30">
              <Icon size={22} className="mb-4 text-violet-600 dark:text-violet-300" />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
            </SlideIn>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function LandingCallout() {
  return (
    <SlideIn revealOnScroll className="pb-10">
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#22162f] to-[#472657] p-7 text-white sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight">¿Ya tienes una cuenta?</h2>
        <Link href="/login" className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#26172e] transition-colors hover:bg-[#ffe1cf]">
          Iniciar sesión <ArrowRight size={16} className="transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </section>
    </SlideIn>
  );
}

import Link from 'next/link';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';
import { PublicBrand } from './PublicBrand';

const groups = [
  { title: 'Explorar', links: [['Inicio', '/'], ['Tiendas', '/#tiendas'], ['Cómo funciona', '/#como-funciona']] },
  { title: 'Tu cuenta', links: [['Iniciar sesión', '/login'], ['Crear cuenta', '/registro'], ['Recuperar contraseña', '/recuperar-password']] },
];

export function PublicFooter() {
  return (
    <footer className="sf-end">
      <div className="sf-end-inner">
        <div className="sf-end-grid">
          <SlideIn revealOnScroll>
            <PublicBrand />
            <p className="sf-end-description">Encuentra tu tienda y descubre qué ver o escuchar hoy.</p>
            <Link href="/#tiendas" className="sf-end-action">Explorar tiendas <ArrowUpRight size={17} /></Link>
          </SlideIn>
          {groups.map(({ title, links }, index) => (
            <SlideIn key={title} revealOnScroll delay={(index + 1) * 0.05}>
              <nav aria-label={`Pie de página · ${title}`}>
                <h2>{title}</h2>
                <ul>{links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="sf-end-link">{label}<ArrowUpRight size={13} /></Link></li>
                ))}</ul>
              </nav>
            </SlideIn>
          ))}
        </div>
        <div className="sf-end-signature" aria-hidden="true">
          <span>stream<i>flow.</i></span>
          <div className="sf-end-grooves" />
        </div>
        <div className="sf-end-base">
          <small>© StreamFlow</small>
          <a href="#public-top" className="sf-back-top">Volver arriba <ArrowUp size={15} /></a>
        </div>
      </div>
    </footer>
  );
}

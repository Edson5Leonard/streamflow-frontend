'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, Home, Route } from 'lucide-react';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { PublicBrand } from './PublicBrand';

const links = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Explorar tiendas', href: '/#tiendas', icon: Compass },
  { label: 'Cómo funciona', href: '/#como-funciona', icon: Route },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  return (
    <header className="sf-mast" onKeyDown={event => {
      if (open && event.key === 'Escape') {
        close();
        toggle.current?.focus();
      }
    }} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    }}>
      <nav className="sf-mast-inner" aria-label="Navegación pública">
        <div className="sf-mast-row">
          <PublicBrand onNavigate={close} />
          <div className="sf-mast-links">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="sf-mast-link">{label}</Link>
            ))}
          </div>
          <ThemeToggle />
          <Link href="/login" className="sf-access sf-desktop-access">
            Iniciar sesión <ArrowUpRight size={16} />
          </Link>
          <button type="button" ref={toggle} className="sf-menu-toggle"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}
            aria-controls="public-mobile-menu" onClick={() => setOpen(value => !value)}>
            <span /><span />
          </button>
        </div>
        <div id="public-mobile-menu" className="sf-mobile-menu" data-open={open} inert={!open}>
          <div className="sf-menu-clip">
            <div className="sf-menu-content">
              {links.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="sf-mobile-link" onClick={close}>
                  <Icon size={17} /> {label} <ArrowUpRight size={14} />
                </Link>
              ))}
              <Link href="/login" className="sf-access" onClick={close}>Iniciar sesión <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';
import './landing.css';

export function LandingHero() {
  return (
    <section className="sf-landing-hero">
      <div className="sf-landing-light" aria-hidden="true" />
      <SlideIn className="sf-landing-copy">
        <h1>Tu próxima<br /><em>obsesión.</em></h1>
        <p>Explora tiendas de streaming, compara sus catálogos y elige qué ver o escuchar hoy.</p>
        <div className="sf-landing-actions">
          <a className="sf-landing-primary" href="#tiendas">Explorar tiendas <ArrowUpRight size={18} /></a>
          <a className="sf-landing-secondary" href="#como-funciona">Cómo funciona <ArrowDown size={15} /></a>
        </div>
      </SlideIn>
      <SlideIn direction="left" distance={24} delay={0.08} className="sf-landing-art" aria-hidden="true">
        <div className="sf-landing-record" />
        <div className="sf-landing-sleeve">
          <div className="sf-landing-horizon" />
          <div className="sf-landing-sun" />
          <div className="sf-landing-ridges" />
          <span>Servinet</span>
        </div>
      </SlideIn>
    </section>
  );
}

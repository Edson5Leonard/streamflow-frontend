import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { StreamFlowBrand } from '@/components/navigation/StreamFlowBrand';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { SlideIn } from '@/components/animation/SlideIn';
import { getStoreHref } from '@/features/stores/utils/stores.utils';
import { AuthIllustration, type AuthView } from './AuthIllustration';
import './auth-view.css';

export function AuthLayout({ children, title, description, footer, view = 'login', distributorId }: {
  children: ReactNode; title: string; description: string; footer: ReactNode;
  view?: AuthView; distributorId?: string;
}) {
  return (
    <div className="sf-auth">
      <header className="sf-auth-mast">
        <StreamFlowBrand />
        <div>
          <Link href={distributorId ? getStoreHref(distributorId) : '/'}>
            <ArrowLeft size={15} /> {distributorId ? 'Volver a la tienda' : 'Volver al inicio'}
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="sf-auth-spread">
        <AuthIllustration view={view} />
        <section className="sf-auth-panel">
          <SlideIn key={view} className="sf-auth-panel-inner" distance={8}>
            <h1>{title}</h1>
            <p className="sf-auth-intro">{description}</p>
            {children}
            <div className="sf-auth-footer">{footer}</div>
          </SlideIn>
        </section>
      </main>
    </div>
  );
}

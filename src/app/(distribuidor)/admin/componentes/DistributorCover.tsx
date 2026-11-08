import type { ReactNode } from 'react';
import { SlideIn } from '@/components/animation/SlideIn';

export function DistributorCover({ title, description, value, label, children }: {
  title: string; description: string; value: string | number; label: string; children?: ReactNode;
}) {
  return (
    <header className="sf-dist-cover">
      <SlideIn className="sf-dist-copy">
        <h1>{title}</h1><p>{description}</p>{children}
      </SlideIn>
      <SlideIn direction="left" delay={.05} className="sf-dist-ticket">
        <strong>{value}</strong><span>{label}</span><i aria-hidden="true" />
      </SlideIn>
    </header>
  );
}

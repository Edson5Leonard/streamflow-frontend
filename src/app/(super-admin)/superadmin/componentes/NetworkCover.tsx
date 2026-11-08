import type { ReactNode } from 'react';
import { SlideIn } from '@/components/animation/SlideIn';

type Props = {
  title: string;
  description: string;
  metric: string | number;
  label: string;
  children?: ReactNode;
};

export function NetworkCover({ title, description, metric, label, children }: Props) {
  return (
    <header className="sf-network-cover">
      <SlideIn className="sf-network-copy">
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </SlideIn>
      <SlideIn direction="left" delay={0.05} className="sf-network-metric">
        <strong>{metric}</strong>
        <span>{label}</span>
      </SlideIn>
    </header>
  );
}

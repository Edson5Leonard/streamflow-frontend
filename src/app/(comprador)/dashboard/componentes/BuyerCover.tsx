import type { ReactNode } from 'react';
import { Disc3, Headphones, Library, LifeBuoy, UserRound } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';

const icons = { home: Disc3, catalog: Headphones, history: Library, support: LifeBuoy, profile: UserRound };
export function BuyerCover({ view, title, description, children }: {
  view: keyof typeof icons; title: string; description: string; children?: ReactNode;
}) {
  const Icon = icons[view];
  return (
    <header className="sf-buyer-cover" data-view={view}>
      <SlideIn className="sf-buyer-copy">
        <h1>{title}</h1><p>{description}</p>{children}
      </SlideIn>
      <div className="sf-buyer-record" aria-hidden="true"><Icon size={24} /></div>
    </header>
  );
}

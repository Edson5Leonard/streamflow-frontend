import './brand.css';
import Link from 'next/link';

export function StreamFlowBrand({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  return (
    <Link href="/" className="sf-brand" aria-label="Servinet, inicio" onClick={onNavigate}>
      <span className={`sf-brand-logo${compact ? ' sf-brand-logo-compact' : ''}`} aria-hidden="true" />
    </Link>
  );
}


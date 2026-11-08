import './brand.css';
import Link from 'next/link';

export function StreamFlowBrand({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  return (
    <Link href="/" className="sf-brand" aria-label="StreamFlow, inicio" onClick={onNavigate}>
      <span className="sf-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
      {!compact && <span>stream<span className="sf-brand-accent">flow.</span></span>}
    </Link>
  );
}


'use client';
import { ErrorState } from '@/components/feedback/ErrorState';
export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="p-6"><ErrorState title="No se pudo abrir la página" onRetry={reset}/></div>;
}

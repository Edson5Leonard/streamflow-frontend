'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { AutoGuaranteeResult } from '../types/claims.types';

export function AutoGuaranteeResultCard({ result }: { result: AutoGuaranteeResult }) {
  const [copied, setCopied] = useState('');
  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied('');
    }
  }

  return (
    <section className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div>
        <h3 className="font-semibold">{result.reemplazo ? 'Cuenta de reemplazo asignada' : 'Reporte registrado'}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.mensaje}</p>
      </div>
      {result.reemplazo && (
        <dl className="grid gap-3 rounded-lg bg-background p-3 text-sm sm:grid-cols-2">
          <Credential label="Servicio" value={result.reemplazo.servicio} />
          <Credential label="Correo" value={result.reemplazo.correo} onCopy={() => void copy('correo', result.reemplazo!.correo)} copied={copied === 'correo'} />
          <Credential label="Contraseña" value={result.reemplazo.password} onCopy={() => void copy('contraseña', result.reemplazo!.password)} copied={copied === 'contraseña'} />
          {result.reemplazo.perfilPin && <Credential label="PIN de perfil" value={result.reemplazo.perfilPin} onCopy={() => void copy('PIN', result.reemplazo!.perfilPin!)} copied={copied === 'PIN'} />}
        </dl>
      )}
    </section>
  );
}

function Credential({ label, value, onCopy, copied }: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-start gap-2">
        <span className="break-all font-mono">{value}</span>
        {onCopy && <button type="button" onClick={onCopy} aria-label={`Copiar ${label}`} className="shrink-0 rounded p-1 hover:bg-muted">
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        </button>}
      </dd>
    </div>
  );
}

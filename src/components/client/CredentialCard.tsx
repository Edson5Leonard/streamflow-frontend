'use client';

import { useState } from 'react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';

interface CredentialCardProps {
  servicio: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  fecha?: string;
}

export function CredentialCard({ servicio, correo, password, perfilPin, fecha }: CredentialCardProps) {
  const [mostrarClave, setMostrarClave] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    const texto = `Servicio: ${servicio}\nCorreo: ${correo}\nClave: ${password}\nPerfil/PIN: ${perfilPin || '—'}`;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setFeedback('¡Credenciales copiadas al portapapeles!');
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      setFeedback('No se pudo copiar. Selecciona las credenciales para copiarlas manualmente.');
    }
  };

  const [perfil, pin] = (perfilPin ?? '').split('|');
  return (
    <article className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
      <header className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-slate-100">{servicio}</h3>
        {fecha && <time className="text-xs text-slate-500">{new Date(fecha).toLocaleDateString()}</time>}
      </header>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <dt className="text-xs text-slate-500">Correo</dt>
          <dd className="mt-1 break-all font-mono text-slate-200">{correo}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <dt className="text-xs text-slate-500">Contraseña</dt>
          <dd className="mt-1 flex items-center justify-between gap-2 font-mono text-slate-200">
            <span>{mostrarClave ? password : '••••••••'}</span>
            <button
              type="button"
              onClick={() => setMostrarClave((visible) => !visible)}
              aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="text-slate-500 hover:text-slate-200"
            >
              {mostrarClave ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <dt className="text-xs text-slate-500">Perfil</dt>
          <dd className="mt-1 text-slate-200">{perfil || 'General'}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <dt className="text-xs text-slate-500">PIN</dt>
          <dd className="mt-1 font-mono text-slate-200">{pin || '—'}</dd>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => void copiar()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          {copiado ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          Copiar
        </button>
        <p role="status" aria-live="polite" className={`text-xs ${feedback.startsWith('No') ? 'text-amber-400' : 'text-emerald-400'}`}>
          {feedback}
        </p>
      </div>
    </article>
  );
}

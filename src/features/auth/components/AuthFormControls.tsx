'use client';

import { useState, type ComponentProps } from 'react';
import { ArrowRight, Eye, EyeOff, LoaderCircle } from 'lucide-react';

type FieldProps = ComponentProps<'input'> & { id: string; label: string; error?: string };

export function AuthField({ id, label, error, type = 'text', ...input }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return (
    <div className="sf-auth-field">
      <label htmlFor={id}>{label}</label>
      <div>
        <input {...input} id={id} type={password && visible ? 'text' : type}
          aria-invalid={Boolean(error)} aria-describedby={error ? id + '-error' : undefined}
          className={password ? 'sf-password' : undefined} />
        {password && (
          <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible} onClick={() => setVisible(!visible)}>
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <small id={id + '-error'} role="alert">{error}</small>}
    </div>
  );
}

export function AuthSubmit({ label, pendingLabel, pending, disabled }: {
  label: string; pendingLabel: string; pending: boolean; disabled?: boolean;
}) {
  return (
    <button type="submit" className="sf-auth-submit" disabled={pending || disabled}>
      {pending ? <>{pendingLabel} <LoaderCircle size={16} className="motion-safe:animate-spin" /></>
        : <>{label} <ArrowRight size={16} /></>}
    </button>
  );
}

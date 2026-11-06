'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

export type MetodoPago = 'YAPE' | 'PLIN' | 'BCP' | 'INTERBANK' | 'INTERNACIONAL';

const metodos: { id: MetodoPago; label: string }[] = [
  { id: 'YAPE', label: 'Yape' },
  { id: 'PLIN', label: 'Plin' },
  { id: 'BCP', label: 'BCP' },
  { id: 'INTERBANK', label: 'Interbank' },
  { id: 'INTERNACIONAL', label: 'Internacional (MX / CO / EC)' },
];

const titular = 'Jose Ruben Vitate Quillay';
const cciInterbank = '00389801315016660045';

export function PaymentInstructions({
  metodo,
  onMetodoChange,
  mostrarPlin = true,
}: {
  metodo: MetodoPago;
  onMetodoChange: (metodo: MetodoPago) => void;
  mostrarPlin?: boolean;
}) {
  const [pais, setPais] = useState<'MX' | 'CO' | 'EC'>('MX');
  const [copiado, setCopiado] = useState('');
  const [errorCopia, setErrorCopia] = useState('');
  const [qrAmpliado, setQrAmpliado] = useState<'YAPE' | 'PLIN' | null>(null);

  const copiar = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiado(label);
      setErrorCopia('');
      window.setTimeout(() => setCopiado(''), 1800);
    } catch {
      setCopiado('');
      setErrorCopia('No se pudo copiar. Selecciona y copia el número manualmente.');
    }
  };

  const datoCopiable = (label: string, value: string) => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-slate-100">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => void copiar(label, value)}
        className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500"
      >
        {copiado === label ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">Elige tu método de pago</h3>
        <p className="mt-1 text-xs text-slate-500">Realiza la transferencia y adjunta el comprobante para validación manual.</p>
      </div>
      <div role="tablist" aria-label="Método de pago" className="flex gap-2 overflow-x-auto pb-1">
        {metodos.filter((opcion) => mostrarPlin || opcion.id !== 'PLIN').map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            role="tab"
            aria-selected={metodo === opcion.id}
            onClick={() => onMetodoChange(opcion.id)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              metodo === opcion.id
                ? 'border-emerald-600 bg-emerald-950/50 text-emerald-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {metodo === 'YAPE' && (
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <button
            type="button"
            onClick={() => setQrAmpliado('YAPE')}
            aria-label="Ampliar código QR de Yape"
            className="group relative overflow-hidden rounded-lg bg-white p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <Image src="/payments/yape-qr.png" alt="Código QR de Yape de Jose Ruben Vitate Quillay" width={400} height={280} className="h-auto w-full" />
            <span className="absolute inset-2 flex items-center justify-center gap-1 rounded-md bg-slate-950/60 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn size={16} /> Ampliar QR
            </span>
          </button>
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Titular: <strong className="text-white">{titular}</strong></p>
            {datoCopiable('Número de celular Yape', '962266922')}
          </div>
        </div>
      )}

      {metodo === 'PLIN' && (
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <button
            type="button"
            onClick={() => setQrAmpliado('PLIN')}
            aria-label="Ampliar código QR de Plin"
            className="group relative overflow-hidden rounded-lg bg-white p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <Image src="/payments/plin-qr.png" alt="Código QR de Plin de Jose Vitate" width={768} height={1024} className="h-auto w-full" />
            <span className="absolute inset-2 flex items-center justify-center gap-1 rounded-md bg-slate-950/60 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn size={16} /> Ampliar QR
            </span>
          </button>
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Titular: <strong className="text-white">JOSE VITATE</strong></p>
            {datoCopiable('Número de celular Plin', '962266922')}
          </div>
        </div>
      )}

      {metodo === 'BCP' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Titular: <strong className="text-white">{titular}</strong></p>
          {datoCopiable('Cuenta BCP en soles', '19191935345082')}
          {datoCopiable('CCI BCP', '00219119193534508258')}
        </div>
      )}

      {metodo === 'INTERBANK' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Titular: <strong className="text-white">{titular}</strong></p>
          {datoCopiable('Cuenta Simple Interbank en soles', '8983150166600')}
          {datoCopiable('CCI Interbank', cciInterbank)}
        </div>
      )}

      {metodo === 'INTERNACIONAL' && (
        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm text-slate-300">
            País desde donde envías
            <select value={pais} onChange={(event) => setPais(event.target.value as 'MX' | 'CO' | 'EC')} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white">
              <option value="MX">🇲🇽 México</option>
              <option value="CO">🇨🇴 Colombia</option>
              <option value="EC">🇪🇨 Ecuador</option>
            </select>
          </label>
          <ol className="list-inside list-decimal space-y-2 text-sm leading-6 text-slate-300">
            {pais === 'MX' && (
              <>
                <li>Abre Remitly o Wise y elige enviar dinero a Perú mediante depósito bancario.</li>
                <li>Ingresa Interbank como banco destino, el titular <strong>{titular}</strong> y el CCI peruano de 20 dígitos.</li>
                <li>Envía en MXN, conserva el código de operación y adjunta el comprobante.</li>
              </>
            )}
            {pais === 'CO' && (
              <>
                <li>Abre Global66 o Wise y elige enviar dinero a Perú mediante depósito bancario.</li>
                <li>Ingresa Interbank como banco destino, el titular <strong>{titular}</strong> y el CCI peruano de 20 dígitos.</li>
                <li>Paga desde tu cuenta o PSE, conserva el código de operación y adjunta el comprobante.</li>
              </>
            )}
            {pais === 'EC' && (
              <>
                <li>Elige Global66 para depósito bancario o realiza un giro por Western Union.</li>
                <li>Global66: envía USD a Interbank usando el CCI de abajo. Western Union: envía a nombre de <strong>{titular}</strong>.</li>
                <li>Adjunta la captura del envío. Si usaste Western Union, incluye el código MTCN en el código de operación.</li>
              </>
            )}
          </ol>
          <p className="text-xs text-slate-500">El CCI es una cuenta interbancaria peruana; confirma en la aplicación de envío que la opción de depósito a Perú esté disponible antes de transferir.</p>
          <div className="space-y-3 rounded-lg border border-slate-800 p-3">
            <p className="text-sm text-slate-300">Banco destino: <strong className="text-white">Interbank (Perú)</strong></p>
            <p className="text-sm text-slate-300">Titular: <strong className="text-white">{titular}</strong></p>
            {datoCopiable('CCI Interbank (20 dígitos)', cciInterbank)}
          </div>
        </div>
      )}
      {errorCopia && <p role="status" className="text-xs text-amber-300">{errorCopia}</p>}
      <Dialog open={qrAmpliado !== null} onOpenChange={(open) => { if (!open) setQrAmpliado(null); }}>
        {qrAmpliado && (
          <DialogContent showCloseButton={false} className="max-w-md border border-cyan-900 bg-slate-900 p-6 text-center">
            <DialogTitle className="text-lg font-bold text-white">
              Código QR {qrAmpliado === 'YAPE' ? 'Yape' : 'Plin'} Oficial
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Titular: {qrAmpliado === 'YAPE' ? titular : 'JOSE VITATE'}
            </DialogDescription>
            <div className="mx-auto flex max-h-[60vh] w-full items-center justify-center overflow-hidden rounded-xl bg-white p-3">
              <Image
                src={qrAmpliado === 'YAPE' ? '/payments/yape-qr.png' : '/payments/plin-qr.png'}
                alt={`Código QR ampliado de ${qrAmpliado === 'YAPE' ? 'Yape' : 'Plin'}`}
                width={qrAmpliado === 'YAPE' ? 400 : 768}
                height={qrAmpliado === 'YAPE' ? 280 : 1024}
                className="h-auto max-h-[55vh] w-auto max-w-full object-contain"
                sizes="(max-width: 448px) 90vw, 400px"
              />
            </div>
            <p className="font-mono font-bold tracking-widest text-cyan-300">
              {qrAmpliado === 'YAPE' ? 'Yapear al: ' : 'Plinear al: '}962 266 922
            </p>
            <DialogClose className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
              Cerrar
            </DialogClose>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

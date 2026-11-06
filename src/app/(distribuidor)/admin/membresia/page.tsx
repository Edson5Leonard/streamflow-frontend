'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { PaymentInstructions, type MetodoPago } from '@/components/payments/PaymentInstructions';

interface PagoMembresia {
  id: string;
  monto: number;
  comprobanteUrl: string;
  metodoPago: MetodoPago;
  codigoOperacion: string | null;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  motivoRechazo?: string | null;
  fechaSolicitud: string;
  fechaVencimiento?: string | null;
}

export default function MembresiaPage() {
  const [pagos, setPagos] = useState<PagoMembresia[]>([]);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('YAPE');
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargar = async () => {
    try {
      setPagos(await fetchApi<PagoMembresia[]>('/membresias/mis-pagos'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el historial de membresía.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(cargar);
  }, []);

  const enviar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!archivo) {
      setError('Adjunta el comprobante de pago.');
      return;
    }
    setEnviando(true);
    setError('');
    setMensaje('');
    const formData = new FormData();
    formData.append('comprobante', archivo);
    formData.append('metodoPago', metodoPago);
    if (codigoOperacion.trim()) formData.append('codigoOperacion', codigoOperacion.trim());
    try {
      await fetchApi<PagoMembresia>('/membresias/solicitar', { method: 'POST', body: formData });
      setArchivo(null);
      setCodigoOperacion('');
      setMensaje('Solicitud enviada. Se revisará el comprobante antes de habilitar o extender la membresía.');
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  const pendiente = pagos.some((pago) => pago.estado === 'PENDIENTE');
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Membresía de la tienda</h1>
        <p className="mt-1 text-sm text-slate-400">La membresía cuesta S/ 30.00 por 30 días de servicio.</p>
      </header>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {mensaje && <p role="status" className="rounded-lg border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-300">{mensaje}</p>}

      <form onSubmit={enviar} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-semibold text-slate-100">Enviar pago mensual</h2>
        <p className="text-sm text-slate-400">Realiza el pago de S/ 30.00 por uno de estos canales y adjunta la captura para validación.</p>
        <PaymentInstructions metodo={metodoPago} onMetodoChange={setMetodoPago} />
        <label className="block space-y-1.5 text-sm text-slate-300">
          Código de operación
          <input
            required={metodoPago !== 'INTERNACIONAL'}
            maxLength={100}
            value={codigoOperacion}
            onChange={(event) => setCodigoOperacion(event.target.value)}
            placeholder={metodoPago === 'INTERNACIONAL' ? 'Código de transferencia o MTCN (si aplica)' : 'Número de operación'}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </label>
        <input
          required
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setArchivo(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200"
        />
        <button
          type="submit"
          disabled={enviando || pendiente}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : pendiente ? 'Solicitud pendiente de revisión' : '          Confirmar pago y enviar comprobante — S/ 30.00'}
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">Historial de solicitudes</h2>
        {cargando && <p className="text-sm text-slate-500">Cargando...</p>}
        {!cargando && pagos.length === 0 && <p className="text-sm text-slate-500">Aún no tienes pagos de membresía.</p>}
        {pagos.map((pago) => (
          <article key={pago.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div>
              <p className="text-sm font-medium text-slate-200">S/ {Number(pago.monto).toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-400">Método: {pago.metodoPago}{pago.codigoOperacion ? ` · Operación: ${pago.codigoOperacion}` : ''}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(pago.fechaSolicitud).toLocaleString()}</p>
              {pago.motivoRechazo && <p className="mt-1 text-xs text-red-300">{pago.motivoRechazo}</p>}
              {pago.fechaVencimiento && <p className="mt-1 text-xs text-emerald-400">Vigente hasta {pago.fechaVencimiento}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              pago.estado === 'APROBADO' ? 'bg-emerald-500/10 text-emerald-400'
                : pago.estado === 'PENDIENTE' ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
            }`}>{pago.estado}</span>
          </article>
        ))}
      </section>
    </div>
  );
}

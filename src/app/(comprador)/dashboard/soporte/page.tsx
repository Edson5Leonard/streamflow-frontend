'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Compra {
  id: string;
  servicio: string;
  correo: string;
}

export default function SoporteCompradorPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [ventaId, setVentaId] = useState('');
  const [tipoFallo, setTipoFallo] = useState('Contraseña Incorrecta');
  const [detalles, setDetalles] = useState('');
  const [evidencia, setEvidencia] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchApi<Compra[]>('/ventas/mis-compras')
      .then((data) => {
        setCompras(data);
        if (data.length > 0) setVentaId(data[0].id);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudieron cargar tus compras.'));
  }, []);

  const handleEnviarReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!ventaId) {
      setError('Selecciona la cuenta que presenta la falla.');
      return;
    }
    if (!evidencia) {
      setError('Adjunta una captura de la falla.');
      return;
    }
    setEnviando(true);
    try {
      const datosEvidencia = new FormData();
      datosEvidencia.append('archivo', evidencia);
      const { url } = await fetchApi<{ url: string }>('/reclamos/evidencia', {
        method: 'POST',
        body: datosEvidencia,
      });
      await fetchApi('/reclamos', {
        method: 'POST',
        body: JSON.stringify({
          ventaId,
          categoriaFallo: tipoFallo,
          motivo: detalles,
          comprobanteFalloUrl: url,
        }),
      });
      setMensaje('Tu reporte fue enviado al distribuidor para revisión. No necesitas tener una cuenta de reemplazo disponible para reportar la falla.');
      setDetalles('');
      setEvidencia(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el reporte.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Soporte y Garantías</h1>
        <p className="text-gray-400 text-sm mt-1">Selecciona la cuenta afectada y adjunta evidencia. El distribuidor revisará el reporte y lo enviará al administrador para su resolución.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {mensaje && <p role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-4 text-sm text-emerald-300">{mensaje}</p>}
      {!error && compras.length === 0 && <p className="text-sm text-gray-400">Necesitas una compra registrada para abrir un reclamo.</p>}

      <form onSubmit={handleEnviarReporte} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Cuenta Afectada</label>
          <select
            value={ventaId}
            onChange={(e) => setVentaId(e.target.value)}
            required
            disabled={compras.length === 0 || enviando}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
          >
            {compras.length === 0 && <option value="">No hay compras disponibles</option>}
            {compras.map((compra) => (
              <option key={compra.id} value={compra.id}>{compra.servicio} ({compra.correo})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Tipo de Problema</label>
          <select
            value={tipoFallo}
            onChange={(e) => setTipoFallo(e.target.value)}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
          >
            <option value="Contraseña Incorrecta">Contraseña Incorrecta</option>
            <option value="Perfil Bloqueado / PIN Cambiado">Perfil Bloqueado / PIN Cambiado</option>
            <option value="Suscripción Vencida Antes de Tiempo">Suscripción Vencida Antes de Tiempo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Detalles Adicionales</label>
          <textarea
            placeholder="Describe brevemente qué pantalla te sale..."
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
            required
            maxLength={500}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm h-24"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Captura de pantalla de la falla</label>
          <input
            type="file"
            required
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={(e) => setEvidencia(e.target.files?.[0] ?? null)}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200"
          />
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP o PDF; máximo 5 MB.</p>
        </div>

        <button
          type="submit"
          disabled={enviando || compras.length === 0 || !ventaId}
          className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl text-sm transition shadow-lg shadow-yellow-600/20"
        >
          {enviando ? 'Enviando reporte...' : 'Enviar reporte de falla'}
        </button>
      </form>
    </div>
  );
}
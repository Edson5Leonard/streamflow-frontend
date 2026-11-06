'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, RefreshCw, Trash, AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface Reclamo {
  id: string;
  ventaId: string;
  usuarioId: string;
  categoriaFallo: string;
  motivo: string;
  comprobanteFalloUrl: string;
  estado: string;
  fechaCreacion: string;
  servicio: string;
  correoAfectado: string;
  comentarioCliente: string;
}

interface Venta {
  id: string;
  cuentaStockId: string;
}

interface Cuenta {
  id: string;
  servicioId: string;
  correo: string;
}

interface Servicio {
  id: string;
  nombre: string;
}

interface Usuario {
  id: string;
  nombreCompleto: string;
}

export default function AdminAuditoriaPage() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [cargado, setCargado] = useState(false);
  const [imagenModal, setImagenModal] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchApi<Reclamo[]>('/reclamos/pendientes'),
      fetchApi<Venta[]>('/ventas'),
      fetchApi<Cuenta[]>('/cuentas'),
      fetchApi<Servicio[]>('/servicios/activos'),
      fetchApi<Usuario[]>('/usuarios'),
    ])
      .then(([reclamosData, ventas, cuentas, servicios, usuarios]) => {
        const ventasPorId = new Map(ventas.map((venta) => [venta.id, venta]));
        const cuentasPorId = new Map(cuentas.map((cuenta) => [cuenta.id, cuenta]));
        const serviciosPorId = new Map(servicios.map((servicio) => [servicio.id, servicio]));
        const nombresPorId = new Map(usuarios.map((usuario) => [usuario.id, usuario.nombreCompleto]));
        setReclamos(reclamosData.map((reclamo) => {
          const venta = ventasPorId.get(reclamo.ventaId);
          const cuenta = venta ? cuentasPorId.get(venta.cuentaStockId) : undefined;
          return {
            ...reclamo,
            servicio: cuenta ? serviciosPorId.get(cuenta.servicioId)?.nombre ?? 'Servicio' : 'Servicio',
            correoAfectado: cuenta?.correo ?? nombresPorId.get(reclamo.usuarioId) ?? 'Comprador',
            comentarioCliente: reclamo.motivo,
          };
        }));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudieron cargar los reclamos.'))
      .finally(() => setCargado(true));
  }, []);

  const actualizarEstado = async (id: string, estado: 'RESUELTO' | 'RECHAZADO') => {
    setError('');
    try {
      await fetchApi(`/reclamos/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado }),
      });
      setReclamos((actuales) => actuales.filter((reclamo) => reclamo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el reclamo.');
    }
  };

  if (!cargado) return null;

  const pendientes = reclamos.filter((r) => r.estado === 'PENDIENTE');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auditoría Nocturna de Reclamos</h1>
          <p className="text-sm text-slate-500">
            Revisa los reportes enviados por tus compradores y resuelve o rechaza cada caso.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 py-1.5 px-3">
            <AlertTriangle className="w-4 h-4 mr-1" /> Pendientes: {pendientes.length}
          </Badge>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {/* Tabla de Reclamos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-indigo-600" /> Cola de Cuentas Observadas
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <th className="p-4">Servicio / Correo</th>
              <th className="p-4">Fallo</th>
              <th className="p-4">Comentario del Cliente</th>
              <th className="p-4">Evidencia</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {reclamos.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{item.servicio}</div>
                  <div className="text-xs text-slate-500 font-mono">{item.correoAfectado}</div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50">
                    {item.categoriaFallo}
                  </Badge>
                </td>
                <td className="p-4 max-w-xs">
                  {item.comentarioCliente ? (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item.comentarioCliente}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Sin comentarios</span>
                  )}
                </td>
                <td className="p-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImagenModal(item.comprobanteFalloUrl)}
                    className="gap-1 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver Captura
                  </Button>
                </td>
                <td className="p-4">
                  {item.estado === 'PENDIENTE' && (
                    <Badge className="bg-amber-100 text-amber-800 border-none">OBSERVADO</Badge>
                  )}
                </td>
                <td className="p-4">
                  {item.estado === 'PENDIENTE' && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => actualizarEstado(item.id, 'RESUELTO')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1 text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Marcar resuelto
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actualizarEstado(item.id, 'RECHAZADO')}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 text-xs"
                      >
                        <Trash className="w-3.5 h-3.5" /> Descartar
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Imagen */}
      {imagenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 rounded-2xl max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800">Captura de Fallo / Error</h3>
              <button onClick={() => setImagenModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>
            <div className="bg-slate-100 rounded-xl p-2 flex justify-center">
              <img src={imagenModal} alt="Captura de falla" className="max-h-[400px] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
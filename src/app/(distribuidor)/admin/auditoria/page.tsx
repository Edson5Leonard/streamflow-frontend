'use client';

import { useState, useEffect } from 'react';
import { Reclamo } from '@/types/reclamo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, RefreshCw, Trash, AlertTriangle, Eye, MessageSquare, RotateCcw } from 'lucide-react';

const mockEjemplos: Reclamo[] = [
  {
    id: 'r-101',
    ventaId: 'v-1',
    servicio: 'HBO Max',
    correoAfectado: 'hbomax_cliente1@ejemplo.com',
    categoriaFallo: 'CAIDA',
    comentarioCliente: 'El cliente indica que al entrar le sale pantalla de membresía vencida desde hoy en la tarde.',
    comprobanteFalloUrl: 'https://placehold.co/600x400/png?text=Error:+Membresia+Vencida',
    estado: 'PENDIENTE_AUDITORIA',
    fechaReporte: '2026-10-07 18:10',
  },
  {
    id: 'r-102',
    ventaId: 'v-2',
    servicio: 'Netflix',
    correoAfectado: 'netflix_premium2@ejemplo.com',
    categoriaFallo: 'CLAVE_INCORRECTA',
    comentarioCliente: 'Cambiaron la contraseña de la cuenta máster y no podemos acceder a ningún perfil.',
    comprobanteFalloUrl: 'https://placehold.co/600x400/png?text=Error:+Contrasena+Incorrecta',
    estado: 'PENDIENTE_AUDITORIA',
    fechaReporte: '2026-10-07 19:45',
  },
  {
    id: 'r-103',
    ventaId: 'v-3',
    servicio: 'Disney+',
    correoAfectado: 'disney_peru@ejemplo.com',
    categoriaFallo: 'CORREO_NO_EXISTE',
    comentarioCliente: 'Al intentar iniciar sesión dice que el correo electrónico no está registrado en Disney+.',
    comprobanteFalloUrl: 'https://placehold.co/600x400/png?text=Error:+Cuenta+No+Existe',
    estado: 'PENDIENTE_AUDITORIA',
    fechaReporte: '2026-10-07 20:15',
  },
  {
    id: 'r-104',
    ventaId: 'v-4',
    servicio: 'Spotify',
    correoAfectado: 'spotify_fam@ejemplo.com',
    categoriaFallo: 'CAIDA',
    comentarioCliente: 'Se cayó el plan familiar, la cuenta volvió a Spotify Free.',
    comprobanteFalloUrl: 'https://placehold.co/600x400/png?text=Error:+Cuenta+Free',
    estado: 'RESUELTO_RECUPERADO',
    fechaReporte: '2026-10-06 14:00',
  },
];

export default function AdminAuditoriaPage() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [cargado, setCargado] = useState(false);
  const [imagenModal, setImagenModal] = useState<string | null>(null);

  useEffect(() => {
    const guardados = localStorage.getItem('auditoria_reclamos');
    if (guardados) {
      setReclamos(JSON.parse(guardados));
    } else {
      setReclamos(mockEjemplos);
      localStorage.setItem('auditoria_reclamos', JSON.stringify(mockEjemplos));
    }
    setCargado(true);
  }, []);

  const actualizarReclamos = (nuevos: Reclamo[]) => {
    setReclamos(nuevos);
    localStorage.setItem('auditoria_reclamos', JSON.stringify(nuevos));
  };

  const handleReemplazar = (id: string) => {
    const actualizados = reclamos.map((r) =>
      r.id === id ? { ...r, estado: 'RESUELTO_RECUPERADO' as const } : r
    );
    actualizarReclamos(actualizados);
  };

  const handleDescartar = (id: string) => {
    const actualizados = reclamos.map((r) =>
      r.id === id ? { ...r, estado: 'RESUELTO_DESCARTADO' as const } : r
    );
    actualizarReclamos(actualizados);
  };

  const handleRestablecerEjemplos = () => {
    actualizarReclamos(mockEjemplos);
  };

  if (!cargado) return null;

  const pendientes = reclamos.filter((r) => r.estado === 'PENDIENTE_AUDITORIA');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auditoría Nocturna de Reclamos</h1>
          <p className="text-sm text-slate-500">
            Revisa los reportes de caídas, comentarios de los revendedores y asigna cuentas de reemplazo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRestablecerEjemplos}
            className="text-xs text-slate-600 gap-1 border-slate-300 hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restablecer Demos
          </Button>
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 py-1.5 px-3">
            <AlertTriangle className="w-4 h-4 mr-1" /> Pendientes: {pendientes.length}
          </Badge>
        </div>
      </div>

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
                  {item.estado === 'PENDIENTE_AUDITORIA' && (
                    <Badge className="bg-amber-100 text-amber-800 border-none">OBSERVADO</Badge>
                  )}
                  {item.estado === 'RESUELTO_RECUPERADO' && (
                    <Badge className="bg-emerald-100 text-emerald-800 border-none">REEMPLAZADO</Badge>
                  )}
                  {item.estado === 'RESUELTO_DESCARTADO' && (
                    <Badge className="bg-slate-100 text-slate-600 border-none">DESCARTADO</Badge>
                  )}
                </td>
                <td className="p-4">
                  {item.estado === 'PENDIENTE_AUDITORIA' && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReemplazar(item.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1 text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Dar Garantía
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDescartar(item.id)}
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
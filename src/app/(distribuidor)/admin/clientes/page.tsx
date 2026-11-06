'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Cliente {
  id: string;
  nombreCompleto: string;
  correo: string;
  whatsapp: string | null;
  activo: boolean;
  comprasRealizadas: number;
  fechaCreacion: string;
}

interface Venta {
  compradorId: string;
}

export default function ClientesDistribuidorPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [desactivando, setDesactivando] = useState<Cliente | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchApi<Omit<Cliente, 'comprasRealizadas'>[]>('/usuarios'),
      fetchApi<Venta[]>('/ventas'),
    ])
      .then(([usuarios, ventas]) => {
        const conteo = new Map<string, number>();
        ventas.forEach((venta) => conteo.set(venta.compradorId, (conteo.get(venta.compradorId) ?? 0) + 1));
        setClientes(usuarios.map((usuario) => ({
          ...usuario,
          comprasRealizadas: conteo.get(usuario.id) ?? 0,
        })));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar la lista de compradores.'));
  }, []);

  const abrirEdicion = (cliente: Cliente) => {
    setEditando(cliente);
    setNombre(cliente.nombreCompleto);
    setCorreo(cliente.correo);
    setWhatsapp(cliente.whatsapp ?? '');
  };

  const guardarEdicion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editando) return;
    setGuardando(true);
    setError('');
    try {
      const actualizado = await fetchApi<Cliente>(`/usuarios/${editando.id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombreCompleto: nombre, correo, whatsapp }),
      });
      setClientes((actuales) => actuales.map((cliente) => cliente.id === actualizado.id
        ? { ...cliente, ...actualizado }
        : cliente));
      setEditando(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar al comprador.');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarDesactivacion = async () => {
    if (!desactivando) return;
    setGuardando(true);
    setError('');
    try {
      await fetchApi(`/usuarios/${desactivando.id}`, { method: 'DELETE' });
      setClientes((actuales) => actuales.map((cliente) => cliente.id === desactivando.id
        ? { ...cliente, activo: false }
        : cliente));
      setDesactivando(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo desactivar al comprador.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Directorio de Compradores Finales</h1>
        <p className="text-gray-400 text-sm mt-1">Lista de compradores registrados y sus compras.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {!error && clientes.length === 0 && <p className="text-sm text-gray-400">Todavía no hay compradores registrados en tu tienda.</p>}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Correo</th>
              <th className="p-4">Total Compras</th>
              <th className="p-4">Fecha Registro</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{c.nombreCompleto}</td>
                <td className="p-4 text-xs text-gray-400 font-mono">{c.correo}</td>
                <td className="p-4 text-xs font-semibold text-amber-400">{c.comprasRealizadas} Cuentas</td>
                <td className="p-4 text-xs text-gray-500">{new Date(c.fechaCreacion).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${c.activo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {c.activo ? 'ACTIVO' : 'DESACTIVADO'}
                  </span>
                </td>
                <td className="space-x-3 p-4 text-right">
                  <button type="button" onClick={() => abrirEdicion(c)} className="text-xs font-medium text-slate-300 underline underline-offset-4 hover:text-white">Editar</button>
                  {c.activo && <button type="button" onClick={() => setDesactivando(c)} className="text-xs font-medium text-red-300 hover:text-red-200">Desactivar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editando && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <form onSubmit={guardarEdicion} className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-slate-100">Editar comprador</h2>
            <label className="block space-y-2 text-sm text-slate-300">Nombre
              <input required maxLength={120} value={nombre} onChange={(event) => setNombre(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">Correo
              <input required type="email" maxLength={150} value={correo} onChange={(event) => setCorreo(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">WhatsApp
              <input maxLength={20} value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditando(null)} disabled={guardando} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancelar</button>
              <button type="submit" disabled={guardando} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
            </div>
          </form>
        </div>
      )}
      <ConfirmModal
        open={Boolean(desactivando)}
        title="Desactivar comprador"
        description="El comprador no podrá acceder ni generar nuevas compras. Su historial se conservará."
        confirmLabel="Desactivar"
        destructive
        loading={guardando}
        onCancel={() => setDesactivando(null)}
        onConfirm={() => void confirmarDesactivacion()}
      />
    </div>
  );
}
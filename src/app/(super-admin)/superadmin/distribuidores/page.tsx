'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Distribuidor {
  id: string;
  nombreCompleto: string;
  correo: string;
  whatsapp: string | null;
  activo: boolean;
}

export default function DistribuidoresPage() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [distribuidorSeleccionado, setDistribuidorSeleccionado] = useState<Distribuidor | null>(null);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [editando, setEditando] = useState<Distribuidor | null>(null);

  const cargarDistribuidores = useCallback(async () => {
    setDistribuidores(await fetchApi<Distribuidor[]>('/usuarios/distribuidores'));
  }, []);

  useEffect(() => {
    Promise.resolve()
      .then(cargarDistribuidores)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los distribuidores.'));
  }, [cargarDistribuidores]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const datos: Record<string, string> = {
          nombreCompleto: nombre,
          correo: email,
          whatsapp: telefono,
      };
      if (password) datos.password = password;
      if (editando) {
        await fetchApi(`/usuarios/${editando.id}`, { method: 'PUT', body: JSON.stringify(datos) });
      } else {
        await fetchApi('/usuarios/distribuidores', {
          method: 'POST',
          body: JSON.stringify({ ...datos, password }),
        });
      }
      await cargarDistribuidores();
      setNombre('');
      setEmail('');
      setPassword('');
      setTelefono('');
      setEditando(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el distribuidor.');
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicion = (distribuidor: Distribuidor) => {
    setEditando(distribuidor);
    setNombre(distribuidor.nombreCompleto);
    setEmail(distribuidor.correo);
    setTelefono(distribuidor.whatsapp ?? '');
    setPassword('');
    document.getElementById('form-distribuidor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleEstado = (distribuidor: Distribuidor) => {
    setDistribuidorSeleccionado(distribuidor);
  };

  const confirmarEstado = async () => {
    if (!distribuidorSeleccionado) return;
    setError('');
    setActualizandoEstado(true);
    try {
      const actualizado = await fetchApi<Distribuidor>(`/usuarios/${distribuidorSeleccionado.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: !distribuidorSeleccionado.activo }),
      });
      setDistribuidores((actuales) => actuales.map((actual) =>
        actual.id === actualizado.id ? actualizado : actual));
      setDistribuidorSeleccionado(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado.');
    } finally {
      setActualizandoEstado(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Gestión de Distribuidores</h1>
        <p className="text-gray-400 text-sm mt-1">
          Crea tiendas independientes y comparte su enlace de registro con cada distribuidor.
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      {/* Formulario Crear / Editar */}
      <form id="form-distribuidor" onSubmit={handleGuardar} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-blue-400">
          {editando ? 'Editar distribuidor' : 'Registrar nuevo distribuidor'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Nombre / Empresa</label>
            <input
              type="text"
              placeholder="Ej: Distribuidor Norte"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              placeholder="distribuidor@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Teléfono / WhatsApp</label>
            <input
              type="text"
              placeholder="999888777"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Contraseña inicial</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!editando}
              minLength={editando && password ? 8 : undefined}
              placeholder={editando ? 'Dejar vacío para conservar' : ''}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Registrar distribuidor'}
        </button>
        {editando && <button type="button" onClick={() => { setEditando(null); setNombre(''); setEmail(''); setPassword(''); setTelefono(''); }} className="w-full text-sm text-gray-400 hover:text-white">Cancelar edición</button>}
      </form>

      {/* Lista de Distribuidores */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Distribuidor</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Enlace de tienda</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {distribuidores.map((dist) => (
                <tr key={dist.id} className="hover:bg-gray-800/40 transition">
                  <td className="p-4 font-bold text-white">{dist.nombreCompleto}</td>
                  <td className="p-4 text-xs">
                    <p className="text-gray-300">{dist.correo}</p>
                    <p className="text-gray-500">{dist.whatsapp}</p>
                  </td>
                  <td className="p-4 text-xs font-mono">
                    <a className="text-blue-400 underline" href={`/tienda/${dist.id}`} target="_blank" rel="noreferrer">
                      Abrir tienda
                    </a>
                    <p className="text-gray-500">{dist.id}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        dist.activo
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {dist.activo ? 'ACTIVO' : 'DESACTIVADO'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => iniciarEdicion(dist)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 underline underline-offset-4 hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleEstado(dist)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        dist.activo
                          ? 'bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20'
                          : 'bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/20'
                      }`}
                    >
                      {dist.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ConfirmModal
          open={Boolean(distribuidorSeleccionado)}
          title={distribuidorSeleccionado?.activo ? 'Suspender distribuidor' : 'Reactivar distribuidor'}
          description={distribuidorSeleccionado?.activo
            ? 'Se bloqueará el acceso a la tienda hasta que se reactive.'
            : 'El distribuidor volverá a tener acceso al panel.'}
          confirmLabel={distribuidorSeleccionado?.activo ? 'Suspender acceso' : 'Reactivar acceso'}
          destructive={Boolean(distribuidorSeleccionado?.activo)}
          loading={actualizandoEstado}
          onCancel={() => setDistribuidorSeleccionado(null)}
          onConfirm={() => void confirmarEstado()}
        />
      </div>
    </div>
  );
}
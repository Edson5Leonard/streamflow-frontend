'use client';

import { useState } from 'react';

interface Distribuidor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaCorte: string;
  estado: 'ACTIVO' | 'DESACTIVADO';
}

const INITIAL_DISTRIBUIDORES: Distribuidor[] = [
  { id: 1, nombre: 'Distribuidora Lima Streaming', email: 'admin@limastream.com', telefono: '999888777', fechaCorte: '2026-11-01', estado: 'ACTIVO' },
  { id: 2, nombre: 'Digital Store Perú', email: 'contacto@digitalstore.pe', telefono: '988777666', fechaCorte: '2026-10-25', estado: 'ACTIVO' },
  { id: 3, nombre: 'Streaming Fast', email: 'ventas@streamfast.com', telefono: '977666555', fechaCorte: '2026-09-15', estado: 'DESACTIVADO' },
];

export default function DistribuidoresPage() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>(INITIAL_DISTRIBUIDORES);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaCorte, setFechaCorte] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Guardar o Editar Distribuidor
  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (editandoId !== null) {
      // Editar
      setDistribuidores(
        distribuidores.map((d) =>
          d.id === editandoId ? { ...d, nombre, email, telefono, fechaCorte } : d
        )
      );
      setEditandoId(null);
    } else {
      // Crear Nuevo
      const nuevo: Distribuidor = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        fechaCorte,
        estado: 'ACTIVO',
      };
      setDistribuidores([nuevo, ...distribuidores]);
    }

    setNombre('');
    setEmail('');
    setTelefono('');
    setFechaCorte('');
  };

  const handleEditar = (dist: Distribuidor) => {
    setEditandoId(dist.id);
    setNombre(dist.nombre);
    setEmail(dist.email);
    setTelefono(dist.telefono);
    setFechaCorte(dist.fechaCorte);
  };

  // SOFT DELETE: Cambiar estado a DESACTIVADO en lugar de eliminar de la DB
  const handleToggleSoftDelete = (id: number) => {
    setDistribuidores(
      distribuidores.map((d) => {
        if (d.id === id) {
          const nuevoEstado = d.estado === 'ACTIVO' ? 'DESACTIVADO' : 'ACTIVO';
          return { ...d, estado: nuevoEstado };
        }
        return d;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Gestión de Distribuidores</h1>
        <p className="text-gray-400 text-sm mt-1">
          Creación, edición y suspensión (Soft Delete) de accesos de revendedores.
        </p>
      </div>

      {/* Formulario Crear / Editar */}
      <form onSubmit={handleGuardar} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-blue-400">
          {editandoId ? '✏️ Editar Distribuidor' : '➕ Registrar Nuevo Distribuidor'}
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
            <label className="block text-xs font-semibold text-gray-300 mb-1">Próxima Fecha de Corte (S/ 30)</label>
            <input
              type="date"
              value={fechaCorte}
              onChange={(e) => setFechaCorte(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
          >
            {editandoId ? 'Guardar Cambios' : 'Registrar Distribuidor'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setNombre('');
                setEmail('');
                setTelefono('');
                setFechaCorte('');
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de Distribuidores */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Distribuidor</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Fecha Corte</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {distribuidores.map((dist) => (
                <tr key={dist.id} className="hover:bg-gray-800/40 transition">
                  <td className="p-4 font-bold text-white">{dist.nombre}</td>
                  <td className="p-4 text-xs">
                    <p className="text-gray-300">{dist.email}</p>
                    <p className="text-gray-500">{dist.telefono}</p>
                  </td>
                  <td className="p-4 text-xs font-mono">{dist.fechaCorte}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        dist.estado === 'ACTIVO'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {dist.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditar(dist)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleSoftDelete(dist.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        dist.estado === 'ACTIVO'
                          ? 'bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20'
                          : 'bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/20'
                      }`}
                    >
                      {dist.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
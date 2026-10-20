'use client';

import { useState } from 'react';

interface CuentaGlobal {
  id: number;
  servicio: string;
  emailCuenta: string;
  passwordCuenta: string;
  perfil: string;
  pin: string;
  precioMayorista: number;
  estado: 'DISPONIBLE' | 'ASIGNADO' | 'FALLO';
}

const INITIAL_STOCK: CuentaGlobal[] = [
  { id: 1, servicio: 'Netflix Premium', emailCuenta: 'net1@saas.com', passwordCuenta: 'pass123', perfil: 'Perfil 1', pin: '1111', precioMayorista: 8.00, estado: 'DISPONIBLE' },
  { id: 2, servicio: 'Disney+ Standard', emailCuenta: 'disney1@saas.com', passwordCuenta: 'pass456', perfil: 'Perfil 2', pin: '2222', precioMayorista: 6.00, estado: 'DISPONIBLE' },
  { id: 3, servicio: 'Max (HBO)', emailCuenta: 'hbo1@saas.com', passwordCuenta: 'pass789', perfil: 'Perfil 1', pin: '3333', precioMayorista: 5.50, estado: 'ASIGNADO' },
];

export default function StockGlobalPage() {
  const [stock, setStock] = useState<CuentaGlobal[]>(INITIAL_STOCK);
  const [servicio, setServicio] = useState('Netflix Premium');
  const [emailCuenta, setEmailCuenta] = useState('');
  const [passwordCuenta, setPasswordCuenta] = useState('');
  const [precioMayorista, setPrecioMayorista] = useState('');
  const [perfil, setPerfil] = useState('');
  const [pin, setPin] = useState('');

  const handleAgregarCuenta = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaCuenta: CuentaGlobal = {
      id: Date.now(),
      servicio,
      emailCuenta,
      passwordCuenta,
      perfil: perfil || 'Completa',
      pin: pin || 'N/A',
      precioMayorista: parseFloat(precioMayorista) || 0,
      estado: 'DISPONIBLE',
    };

    setStock([nuevaCuenta, ...stock]);
    setEmailCuenta('');
    setPasswordCuenta('');
    setPrecioMayorista('');
    setPerfil('');
    setPin('');
  };

  const handleEliminar = (id: number) => {
    setStock(stock.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Stock Global de Cuentas (Super Admin)</h1>
        <p className="text-gray-400 text-sm mt-1">
          Inventario principal para transferir o vender en lote a los distribuidores[cite: 1, 4].
        </p>
      </div>

      {/* Formulario para cargar stock */}
      <form onSubmit={handleAgregarCuenta} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-blue-400">Cargar Nueva Cuenta al Inventario Global</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Plataforma</label>
            <select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="Netflix Premium">Netflix Premium</option>
              <option value="Disney+ Standard">Disney+ Standard</option>
              <option value="Max (HBO)">Max (HBO)</option>
              <option value="Crunchyroll Mega Fan">Crunchyroll Mega Fan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Cuenta Madre</label>
            <input
              type="email"
              placeholder="cuenta@correo.com"
              value={emailCuenta}
              onChange={(e) => setEmailCuenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Contraseña</label>
            <input
              type="text"
              placeholder="••••••••"
              value={passwordCuenta}
              onChange={(e) => setPasswordCuenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Perfil (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Perfil 1"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">PIN (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: 1234"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Precio Mayorista (S/)</label>
            <input
              type="number"
              step="0.50"
              placeholder="8.00"
              value={precioMayorista}
              onChange={(e) => setPrecioMayorista(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          Guardar en Stock Global
        </button>
      </form>

      {/* Tabla de Stock Global */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Cuentas Registradas ({stock.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Servicio</th>
                <th className="p-4">Correo / Clave</th>
                <th className="p-4">Perfil / PIN</th>
                <th className="p-4">Precio Mayorista</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/40 transition">
                  <td className="p-4 font-bold text-white">{item.servicio}</td>
                  <td className="p-4">
                    <p className="font-mono text-xs text-blue-400">{item.emailCuenta}</p>
                    <p className="font-mono text-xs text-gray-500">{item.passwordCuenta}</p>
                  </td>
                  <td className="p-4 text-xs">{item.perfil} (PIN: {item.pin})</td>
                  <td className="p-4 font-bold text-green-400">S/ {item.precioMayorista.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        item.estado === 'DISPONIBLE'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEliminar(item.id)}
                      className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition border border-red-500/20"
                    >
                      Eliminar
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
'use client';

import { useState } from 'react';

interface CuentaDistribuidor {
  id: number;
  servicio: string;
  emailCuenta: string;
  passwordCuenta: string;
  perfil: string;
  pin: string;
  precioVenta: number;
  estado: 'DISPONIBLE' | 'VENDIDO';
}

const INITIAL_INVENTARIO: CuentaDistribuidor[] = [
  { id: 1, servicio: 'Netflix Premium', emailCuenta: 'net_tienda1@gmail.com', passwordCuenta: 'clave123', perfil: 'Perfil 1', pin: '1234', precioVenta: 12.00, estado: 'DISPONIBLE' },
  { id: 2, servicio: 'Disney+ Standard', emailCuenta: 'disney_tienda1@gmail.com', passwordCuenta: 'clave456', perfil: 'Perfil 2', pin: '4321', precioVenta: 9.00, estado: 'VENDIDO' },
  { id: 3, servicio: 'Crunchyroll Mega Fan', emailCuenta: 'crunchy_tienda1@gmail.com', passwordCuenta: 'clave789', perfil: 'Cuenta Completa', pin: 'N/A', precioVenta: 7.00, estado: 'DISPONIBLE' },
];

export default function InventarioDistribuidorPage() {
  const [inventario, setInventario] = useState<CuentaDistribuidor[]>(INITIAL_INVENTARIO);
  const [servicio, setServicio] = useState('Netflix Premium');
  const [emailCuenta, setEmailCuenta] = useState('');
  const [passwordCuenta, setPasswordCuenta] = useState('');
  const [perfil, setPerfil] = useState('');
  const [pin, setPin] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');

  const handleSubirStock = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaCuenta: CuentaDistribuidor = {
      id: Date.now(),
      servicio,
      emailCuenta,
      passwordCuenta,
      perfil: perfil || 'General',
      pin: pin || 'N/A',
      precioVenta: parseFloat(precioVenta) || 0,
      estado: 'DISPONIBLE',
    };

    setInventario([nuevaCuenta, ...inventario]);
    setEmailCuenta('');
    setPasswordCuenta('');
    setPerfil('');
    setPin('');
    setPrecioVenta('');
  };

  const handleEliminar = (id: number) => {
    setInventario(inventario.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Inventario de Cuentas (Distribuidor)</h1>
        <p className="text-gray-400 text-sm mt-1">Carga tu stock diario para que tus clientes puedan canjear al instante.</p>
      </div>

      <form onSubmit={handleSubirStock} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-amber-400">Agregar Nueva Cuenta al Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Plataforma</label>
            <select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            >
              <option value="Netflix Premium">Netflix Premium</option>
              <option value="Disney+ Standard">Disney+ Standard</option>
              <option value="Max (HBO)">Max (HBO)</option>
              <option value="Crunchyroll Mega Fan">Crunchyroll Mega Fan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Correo de la Cuenta</label>
            <input
              type="email"
              placeholder="correo@streaming.com"
              value={emailCuenta}
              onChange={(e) => setEmailCuenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
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
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Perfil (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Perfil 3"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">PIN (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: 5555"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Precio Final al Comprador (S/)</label>
            <input
              type="number"
              step="0.50"
              placeholder="12.00"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
        >
          Guardar en Inventario
        </button>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Servicio</th>
              <th className="p-4">Credenciales</th>
              <th className="p-4">Perfil / PIN</th>
              <th className="p-4">Precio Venta</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {inventario.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{item.servicio}</td>
                <td className="p-4 text-xs font-mono">
                  <p className="text-amber-400">{item.emailCuenta}</p>
                  <p className="text-gray-500">{item.passwordCuenta}</p>
                </td>
                <td className="p-4 text-xs">{item.perfil} (PIN: {item.pin})</td>
                <td className="p-4 font-bold text-green-400">S/ {item.precioVenta.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      item.estado === 'DISPONIBLE'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
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
  );
}
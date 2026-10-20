'use client';

import { useState } from 'react';

export default function SoporteCompradorPage() {
  const [servicio, setServicio] = useState('Netflix Premium');
  const [tipoFallo, setTipoFallo] = useState('Contraseña Incorrecta');
  const [detalles, setDetalles] = useState('');

  const handleEnviarReporte = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reporte enviado en tiempo real a tu distribuidor. Recibirás respuesta o reemplazo a la brevedad.');
    setDetalles('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Soporte y Garantías</h1>
        <p className="text-gray-400 text-sm mt-1">¿Tienes problemas con tu cuenta? Reporta aquí para recibir un reemplazo.</p>
      </div>

      <form onSubmit={handleEnviarReporte} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Cuenta Afectada</label>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
          >
            <option value="Netflix Premium">Netflix Premium (net_tienda1@gmail.com)</option>
            <option value="Max (HBO)">Max HBO (hbo_tienda1@gmail.com)</option>
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
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl text-sm transition shadow-lg shadow-yellow-600/20"
        >
          Enviar Reporte
        </button>
      </form>
    </div>
  );
}
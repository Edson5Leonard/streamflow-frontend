'use client';

import { useState } from 'react';

export default function RecargarSaldoPage() {
  const [monto, setMonto] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      alert('Comprobante enviado con éxito. Tu distribuidor acreditará el saldo en unos minutos.');
      setMonto('');
      setArchivo(null);
      setEnviado(false);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Recargar Saldo (Yape / Plin)</h1>
        <p className="text-gray-400 text-sm mt-1">Realiza la transferencia al número asignado y adjunta la captura.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-6 shadow-xl">
        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl text-center space-y-1">
          <p className="text-xs text-gray-400 uppercase font-semibold">Número Yape / Plin Autorizado</p>
          <p className="text-2xl font-black text-blue-400">999 888 777</p>
          <p className="text-xs text-gray-400">Titular: Mi Tienda Streaming S.A.C.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Monto Depositado (S/)</label>
            <input
              type="number"
              placeholder="Ej: 20.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Captura del Comprobante</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-gray-400 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={enviado}
            className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-green-600/20"
          >
            {enviado ? 'Enviando...' : 'Enviar Comprobante'}
          </button>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

interface ProductoCatalogo {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  stockDisponible: number;
}

const CATALOGO: ProductoCatalogo[] = [
  { id: 1, nombre: 'Netflix Premium (1 Perfil)', categoria: 'Streaming UHD', precio: 12.00, imagen: '🍿', stockDisponible: 5 },
  { id: 2, nombre: 'Disney+ Standard', categoria: 'Movies & Series', precio: 9.00, imagen: '✨', stockDisponible: 3 },
  { id: 3, nombre: 'Max (HBO Max)', categoria: 'Cine & Deportes', precio: 8.50, imagen: '🎬', stockDisponible: 8 },
  { id: 4, nombre: 'Crunchyroll Mega Fan', categoria: 'Anime HD', precio: 7.00, imagen: '🍙', stockDisponible: 2 },
];

export default function CatalogoCompradorPage() {
  const [saldo, setSaldo] = useState(15.00);

  const handleComprar = (prod: ProductoCatalogo) => {
    if (saldo < prod.precio) {
      alert('Saldo insuficiente. Por favor recarga saldo con Yape/Plin.');
      return;
    }

    setSaldo(saldo - prod.precio);
    alert(`¡Felicidades! Has adquirido ${prod.nombre}. Revisa los datos de acceso en "Mis Cuentas".`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catálogo de Canje</h1>
          <p className="text-gray-400 text-sm mt-1">Selecciona el servicio y obtén tus credenciales al instante.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
          <span className="text-xs text-gray-400 block">Mi Saldo:</span>
          <span className="text-xl font-bold text-green-400">S/ {saldo.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATALOGO.map((prod) => (
          <div key={prod.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="text-4xl">{prod.imagen}</div>
              <h3 className="font-bold text-white text-lg">{prod.nombre}</h3>
              <p className="text-xs text-gray-400">{prod.categoria}</p>
              <p className="text-xs text-blue-400 font-semibold">Disponible: {prod.stockDisponible} en stock</p>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-lg font-black text-green-400">S/ {prod.precio.toFixed(2)}</span>
              <button
                onClick={() => handleComprar(prod)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                Obtener
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
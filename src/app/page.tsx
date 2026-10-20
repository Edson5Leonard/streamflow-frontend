'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
  disponible: boolean;
}

const CATALOGO_DEMO: Producto[] = [
  {
    id: 1,
    nombre: 'Netflix Premium',
    categoria: 'Streaming Ultra HD',
    precio: 12.00,
    imagen: '🍿',
    descripcion: '1 Perfil privado en cuenta de 4 pantallas. Sin interrupciones.',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Disney+ Standard',
    categoria: 'Streaming Movies & Series',
    precio: 9.00,
    imagen: '✨',
    descripcion: 'Acceso a Disney, Pixar, Marvel y Star. Perfil personalizable.',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Max (HBO Max)',
    categoria: 'Cine & Series',
    precio: 8.50,
    imagen: '🎬',
    descripcion: '1 Perfil con PIN individual para estrenos y deportes en vivo.',
    disponible: true,
  },
  {
    id: 4,
    nombre: 'Crunchyroll Mega Fan',
    categoria: 'Anime sin publicidad',
    precio: 7.00,
    imagen: '🍙',
    descripcion: 'Simulcasts el mismo día de estreno en Japón. Alta definición.',
    disponible: true,
  },
];

export default function HomePage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const handleIntentarComprar = (prod: Producto) => {
    setProductoSeleccionado(prod);
    setModalAbierto(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between">

      {/* Header / Navbar Público */}
      <header className="border-b border-gray-800/80 bg-gray-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">StreamStore</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all transform active:scale-95"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section + Catálogo */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12 flex-1">

        {/* Banner principal */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            ⚡ Entrega Inmediata & Garantía 24/7
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Tus plataformas favoritas al <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">mejor precio</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Explora nuestro catálogo de cuentas de streaming. Selecciona el servicio que deseas y activa tu membresía en cuestión de segundos.
          </p>
        </div>

        {/* Grilla de Productos con Precios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATALOGO_DEMO.map((prod) => (
            <div
              key={prod.id}
              className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-700 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-950/20"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-4xl">{prod.imagen}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-800 text-gray-300 rounded-lg border border-gray-700">
                    {prod.categoria}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{prod.nombre}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{prod.descripcion}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Precio</span>
                  <span className="text-xl font-black text-green-400">S/ {prod.precio.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleIntentarComprar(prod)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 transform active:scale-95"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Ahora (Solución fija) */}
      <footer className="border-t border-gray-800/80 bg-gray-900/40 text-center py-6 text-xs text-gray-500">
        © 2026 StreamStore SaaS. Todos los derechos reservados.
      </footer>

      {/* Modal Requerir Cuenta / Iniciar Sesión */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-sm rounded-2xl p-6 space-y-6 shadow-2xl relative text-center">

            {/* Botón cerrar X */}
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Icono Informativo */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              🔒
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">
                Inicia sesión para comprar
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Para adquirir <span className="text-blue-400 font-semibold">{productoSeleccionado?.nombre}</span> a <span className="text-green-400 font-bold">S/ {productoSeleccionado?.precio.toFixed(2)}</span> necesitas estar registrado en nuestro sistema.
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3 pt-2">
              <Link
                href="/login"
                className="w-block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 block text-center"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="w-block w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold rounded-xl text-sm transition-all block text-center"
              >
                Crear una Cuenta
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
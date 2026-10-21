'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ServicioPublico {
  id: number;
  nombre: string;
  badge: string;
  descripcion: string;
  precio: string;
  icono: string;
}

const SERVICIOS_REALES: ServicioPublico[] = [
  {
    id: 1,
    nombre: 'Netflix Premium',
    badge: 'Cuenta Completa',
    descripcion: 'Cuenta completa privada con acceso multidispositivo y Ultra HD.',
    precio: 'S/ 45.00',
    icono: '🍿',
  },
  {
    id: 2,
    nombre: 'Disney+ Premium',
    badge: 'Con ESPN',
    descripcion: 'Incluye deportes en vivo por ESPN, Star+ y todo el catálogo Disney.',
    precio: 'S/ 21.00',
    icono: '✨',
  },
  {
    id: 3,
    nombre: 'Flujo TV',
    badge: '1 Mes',
    descripcion: 'Televisión en vivo, eventos deportivos y canales premium en HD.',
    precio: 'S/ 13.00',
    icono: '📺',
  },
  {
    id: 4,
    nombre: 'Prime Video',
    badge: 'Multidispositivo',
    descripcion: 'Series exclusivas, películas y envíos de Amazon en alta calidad.',
    precio: 'S/ 7.00',
    icono: '📦',
  },
  {
    id: 5,
    nombre: 'IPTV Premium',
    badge: 'Lista Estable',
    descripcion: 'Miles de canales internacionales, películas y series a bajo costo.',
    precio: 'S/ 7.00',
    icono: '📡',
  },
  {
    id: 6,
    nombre: 'Max (HBO Max)',
    badge: 'Estándar',
    descripcion: 'Estrenos de cine, series originales de HBO y deportes en vivo.',
    precio: 'S/ 6.00',
    icono: '🎬',
  },
  {
    id: 7,
    nombre: 'Crunchyroll',
    badge: 'Anime HD',
    descripcion: 'Simulcasts al instante desde Japón y catálogo completo sin anuncios.',
    precio: 'S/ 6.00',
    icono: '🍙',
  },
  {
    id: 8,
    nombre: 'Paramount+',
    badge: 'Estándar',
    descripcion: 'Cine de estreno, transmisiones en vivo y series exclusivas.',
    precio: 'S/ 6.00',
    icono: '⭐',
  },
  {
    id: 9,
    nombre: 'ViX Premium',
    badge: 'En Español',
    descripcion: 'Telenovelas, deportes en vivo y cine en español sin interrupciones.',
    precio: 'S/ 5.00',
    icono: '🔥',
  },
];

export default function HomePage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioPublico | null>(null);

  const handleIntentarComprar = (servicio: ServicioPublico) => {
    setServicioSeleccionado(servicio);
    setModalAbierto(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-plus-jakarta)] flex flex-col justify-between">
      {/* Navbar Superior */}
      <header className="border-b border-gray-800/80 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-600/20">
            S
          </div>
          <span className="font-extrabold text-lg tracking-tight">StreamStore</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-95"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            ⚡ Entrega Inmediata & Garantía 24/7
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Tus plataformas favoritas al <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">mejor precio</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Explora nuestro catálogo de cuentas y servicios de streaming. Selecciona la plataforma que deseas y activa tu membresía en cuestión de segundos.
          </p>
        </div>

        {/* Bento Grid de Servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICIOS_REALES.map((serv) => (
            <div
              key={serv.id}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/40 hover:bg-gray-900 transition-all duration-300 shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{serv.icono}</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                    {serv.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    {serv.nombre}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {serv.descripcion}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Precio</span>
                  <span className="text-xl font-extrabold text-green-400">{serv.precio}</span>
                </div>

                <button
                  onClick={() => handleIntentarComprar(serv)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Fijo */}
      <footer className="border-t border-gray-800/80 bg-gray-900/40 text-center py-6 text-xs text-gray-500">
        © 2026 StreamStore SaaS. Todos los derechos reservados.
      </footer>

      {/* Modal Iniciar Sesión / Registro */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-sm w-full space-y-5 text-center shadow-2xl relative">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto text-2xl border border-blue-500/20">
              🔒
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">Inicia sesión para comprar</h3>
              <p className="text-xs text-gray-400">
                Debes acceder a tu cuenta para adquirir <span className="text-blue-400 font-bold">{servicioSeleccionado?.nombre}</span>.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs rounded-xl transition"
              >
                Crear una Cuenta
              </Link>
            </div>

            <button
              onClick={() => setModalAbierto(false)}
              className="text-xs text-gray-500 hover:text-gray-300 underline pt-2 block mx-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
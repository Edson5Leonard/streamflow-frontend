'use client';

import { env } from '@/config/env';

export function MocksWarning() {
  if (!env.useMocks) {
    return null;
  }

  return (
    <div
      role="alert"
      className="sticky top-0 z-[100] border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950"
    >
      Modo de prueba activo: se usan datos simulados y los cambios no se guardan en el backend.
    </div>
  );
}

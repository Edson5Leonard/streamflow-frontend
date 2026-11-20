import { fetchApi } from '@/lib/api';

export type ProfileDetails = {
  id: string;
  nombreCompleto: string;
  correo: string;
  whatsapp: string | null;
  rol: string;
  activo: boolean;
  fotoUrl: string | null;
  creadoEn: string;
  estadisticas: {
    totalVentas: number;
    totalReclamos: number;
    membresiaActiva: boolean;
    membresiaVence: string | null;
  };
};

export const profileApi = {
  getMe: () => fetchApi<ProfileDetails>('/perfil/me'),
  updateMe: (input: { nombreCompleto?: string; whatsapp?: string; correo?: string }) =>
    fetchApi<Record<string, unknown>>('/perfil/me', { method: 'PUT', body: JSON.stringify(input) }),
  uploadPhoto: (file: File) => {
    const form = new FormData();
    form.set('foto', file);
    return fetchApi<{ fotoUrl: string }>('/perfil/me/foto', { method: 'POST', body: form });
  },
};

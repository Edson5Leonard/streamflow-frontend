import { fetchApi } from '@/lib/api';

export const whatsappApi = {
  sendBulk: (input: { destinatarios: string; compradoresIds?: string[]; mensaje: string; plantillaId?: string }) =>
    fetchApi<{ envioId: string; destinatariosTotal: number; estado: string; estimadoCompletado: string }>('/whatsapp/masivo', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  listTemplates: () => fetchApi<{ plantillas: unknown[] }>('/whatsapp/plantillas'),
  createTemplate: (input: { nombre: string; contenido: string; variables?: string[]; tipo?: string }) =>
    fetchApi<Record<string, unknown>>('/whatsapp/plantillas', { method: 'POST', body: JSON.stringify(input) }),
  updateTemplate: (id: string, input: { nombre?: string; contenido?: string; variables?: string[]; tipo?: string }) =>
    fetchApi<Record<string, unknown>>(`/whatsapp/plantillas/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteTemplate: (id: string) =>
    fetchApi<void>(`/whatsapp/plantillas/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getAutomation: () => fetchApi<Record<string, unknown>>('/whatsapp/automatizacion'),
  updateAutomation: (input: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>('/whatsapp/automatizacion', { method: 'PUT', body: JSON.stringify(input) }),
};

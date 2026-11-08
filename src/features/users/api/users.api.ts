import { fetchApi } from '@/lib/api';
import type { CreateDistributor, User, UserUpdate } from '../types/users.types';
export const usersApi = {
  list: () => fetchApi<User[]>('/usuarios'),
  get: (id: string) => fetchApi<User>(`/usuarios/${encodeURIComponent(id)}`),
  update: (id: string, input: UserUpdate) => fetchApi<User>(`/usuarios/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) }),
  deactivate: (id: string) => fetchApi<void>(`/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  listDistributors: () => fetchApi<User[]>('/usuarios/distribuidores'),
  createDistributor: (input: CreateDistributor) => fetchApi<User>('/usuarios/distribuidores', { method: 'POST', body: JSON.stringify(input) }),
  setDistributorActive: (id: string, activo: boolean) => fetchApi<User>(`/usuarios/${encodeURIComponent(id)}/estado`, { method: 'PATCH', body: JSON.stringify({ activo }) }),
};

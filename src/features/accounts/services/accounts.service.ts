import { env } from '@/config/env';
import { accountsApi } from '../api/accounts.api';
import { accountsMock } from '../mocks/accounts.mock';
import type { MockAccount } from '../mocks/accounts.mock';
import type { AccountInput, AccountScope, AccountUpdate } from '../types/accounts.types';
import { accountSchema } from '../schemas/account.schema';
import Cookies from 'js-cookie';
import { servicesService } from '@/features/services/services/services.service';

const key = 'streamflow:mock-accounts:v1';
function read(): MockAccount[] { try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(accountsMock)) as MockAccount[]; } catch { return structuredClone(accountsMock); } }
function save(items: MockAccount[]) { localStorage.setItem(key, JSON.stringify(items)); }
function tenant() { return Cookies.get('role') === 'DISTRIBUIDOR' ? Cookies.get('usuarioId') : Cookies.get('distribuidorId'); }
function visible(items: MockAccount[]) { return Cookies.get('role') === 'SUPER_ADMIN' ? items : items.filter((item) => item.distributorId && item.distributorId === tenant()); }
export const accountsService = {
  async resolveObservedMock(id: string, action: 'descartar' | 'recuperar', password?: string) { if (!env.useMocks || Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('No tienes permiso para gestionar esta cuenta.'); const items = read(); const index = items.findIndex((item) => item.id === id); if (index < 0 || items[index].estado !== 'OBSERVADO') throw new Error('La cuenta observada no está disponible.'); items[index] = action === 'recuperar' ? { ...items[index], estado: 'DISPONIBLE', tipoStock: 'VENTA', password: password! } : { ...items[index], estado: 'DESCARTADO' }; save(items); },
  async assignGlobalMock(serviceId: string, distributorId: string, units: number, price: number) { if (!env.useMocks) throw new Error('La asignación se realiza desde la API de reposiciones.'); if (Cookies.get('role') !== 'SUPER_ADMIN') throw new Error('No tienes permiso para asignar cuentas.'); const items = read(); const available = items.filter((item) => item.distributorId === null && item.servicioId === serviceId && item.estado === 'DISPONIBLE').sort((a, b) => (a.fechaIngreso ?? '').localeCompare(b.fechaIngreso ?? '') || a.id.localeCompare(b.id)); if (available.length < units) return false; const selected = new Set(available.slice(0, units).map((item) => item.id)); save(items.map((item) => selected.has(item.id) ? { ...item, distributorId, estado: 'DISPONIBLE', tipoStock: 'VENTA', precioVenta: price } : item)); return true; },
  async list() { return env.useMocks ? visible(read()) : accountsApi.list(); },
  async listGlobal() { return env.useMocks ? read().filter((item) => item.distributorId === null) : accountsApi.listGlobal(); },
  async listAvailable() { return env.useMocks ? visible(read()).filter((item) => item.estado === 'DISPONIBLE' && item.tipoStock === 'VENTA').map(({ id, servicioId, precioVenta, estado }) => ({ id, servicioId, precioVenta, estado })) : accountsApi.listAvailable(); },
  async create(scope: AccountScope, input: AccountInput) {
    const data = accountSchema.parse(input);
    if (scope === 'distributor' && !data.precioVenta) throw new Error('El precio de venta debe ser mayor a cero.');
    if (!env.useMocks) return accountsApi.create(scope, data);
    const expectedRole = scope === 'global' ? 'SUPER_ADMIN' : 'DISTRIBUIDOR';
    if (Cookies.get('role') !== expectedRole) throw new Error('No tienes permiso para crear esta cuenta.');
    const owner = scope === 'global' ? null : tenant();
    if (scope === 'distributor' && !owner) throw new Error('Inicia sesión como distribuidor.');
    const service = (await servicesService.listActive()).find((item) => item.id === data.servicioId);
    if (!service) throw new Error('El servicio no existe o está inactivo.');
    if (scope === 'distributor' && data.tipoStock === 'VENTA'
      && service.precioMinimoVenta != null && data.precioVenta! < service.precioMinimoVenta) {
      throw new Error(`El precio de venta debe ser igual o mayor a S/ ${service.precioMinimoVenta.toFixed(2)}.`);
    }
    const account: MockAccount = { ...data, id: crypto.randomUUID(), perfilPin: data.perfilPin || null, precioVenta: scope === 'global' ? service.precioReposicion : data.precioVenta ?? null, tipoStock: scope === 'global' ? 'VENTA' : data.tipoStock, estado: 'DISPONIBLE', fechaIngreso: new Date().toISOString(), distributorId: owner ?? null };
    const items = read();
    items.push(account);
    save(items);
    return account;
  },
  async update(scope: AccountScope, id: string, input: AccountUpdate) {
    if (!input.correo.trim() || !input.password.trim() || input.correo.length > 150 || input.password.length > 100 || (input.perfilPin?.length ?? 0) > 20 || (scope === 'distributor' && (!input.precioVenta || input.precioVenta <= 0))) throw new Error('Revisa las credenciales y el precio de venta.');
    if (!env.useMocks) return accountsApi.update(scope, id, input);
    const items = read();
    const index = items.findIndex((item) => item.id === id && (scope === 'global' ? item.distributorId === null : item.distributorId === tenant()));
    if (index < 0) throw new Error('No se encontró la cuenta.');
    if (scope === 'distributor' && items[index].estado !== 'DISPONIBLE') throw new Error('Solo puedes editar cuentas disponibles.');
    if (scope === 'distributor' && items[index].tipoStock !== 'GARANTIA') {
      const service = (await servicesService.list()).find((item) => item.id === items[index].servicioId);
      if (service?.precioMinimoVenta != null && input.precioVenta! < service.precioMinimoVenta) {
        throw new Error(`El precio de venta debe ser igual o mayor a S/ ${service.precioMinimoVenta.toFixed(2)}.`);
      }
    }
    items[index] = { ...items[index], correo: input.correo.trim(), password: input.password.trim(), perfilPin: input.perfilPin?.trim() || null, ...(scope === 'distributor' ? { precioVenta: input.precioVenta! } : {}) };
    save(items);
    return items[index];
  },
  async remove(scope: AccountScope, id: string) { if (!env.useMocks) return accountsApi.remove(scope, id); const items = read(); const match = items.find((item) => item.id === id && (scope === 'global' ? item.distributorId === null : item.distributorId === tenant() || Cookies.get('role') === 'SUPER_ADMIN')); if (!match) throw new Error('No se encontró la cuenta.'); save(items.filter((item) => item.id !== id)); },
};

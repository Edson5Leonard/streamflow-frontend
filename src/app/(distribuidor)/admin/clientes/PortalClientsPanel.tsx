'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientPortalApi, type ManagedClient, type TemporaryPin } from '@/features/client-portal/api';

export function PortalClientsPanel() {
  const [clients, setClients] = useState<ManagedClient[]>([]);
  const [selectedPin, setSelectedPin] = useState<TemporaryPin | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyClientId, setBusyClientId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setClients(await clientPortalApi.managedClients());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el directorio del portal.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    clientPortalApi.managedClients()
      .then((data) => { if (active) setClients(data); })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el directorio del portal.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function resetPin(client: ManagedClient) {
    if (!window.confirm(`Se invalidará el PIN vigente de ${client.nombreCompleto}. ¿Quieres generar uno temporal nuevo?`)) return;
    setBusyClientId(client.id);
    setSelectedPin(null);
    setError('');
    try {
      setSelectedPin(await clientPortalApi.resetPin(client.id));
      await load();
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'No se pudo regenerar el PIN.');
    } finally {
      setBusyClientId(null);
    }
  }

  return (
    <section className="sf-dist-panel space-y-4">
      <div className="sf-dist-heading">
        <div><h2>Acceso al portal de clientes</h2><p className="text-sm text-muted-foreground">Clientes que realizaron pedidos en tu tienda.</p></div>
        <button type="button" onClick={() => void load()} className="rounded-lg border px-3 py-2 text-sm">Actualizar</button>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {selectedPin && <div role="status" className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
        <p>PIN temporal generado para <strong>{selectedPin.whatsapp}</strong>: <code className="font-bold tracking-widest">{selectedPin.pinTemporal}</code></p>
        <p>Vence: {new Date(selectedPin.expiraEn).toLocaleString('es')}</p>
        <a href={selectedPin.enlaceWhatsApp} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white">
          Abrir WhatsApp para enviar el PIN
        </a>
      </div>}
      {loading ? <p role="status" className="text-sm text-muted-foreground">Cargando clientes…</p> :
        clients.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay clientes con acceso al portal.</p> :
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr className="border-b text-muted-foreground"><th className="py-3 pr-4">Cliente</th><th className="py-3 pr-4">WhatsApp</th><th className="py-3 pr-4">Acceso</th><th className="py-3">Acción</th></tr></thead>
              <tbody>{clients.map((client) => <tr key={client.id} className="border-b last:border-0">
                <td className="py-3 pr-4">{client.nombreCompleto}</td>
                <td className="py-3 pr-4">{client.whatsapp}</td>
                <td className="py-3 pr-4">{client.estado === 'ACTIVO' ? client.pinDebeCambiar ? 'PIN temporal pendiente' : 'Activo' : 'Inactivo'}</td>
                <td className="py-3">
                  <button type="button" disabled={client.estado !== 'ACTIVO' || busyClientId === client.id}
                    onClick={() => void resetPin(client)} className="rounded-lg border px-3 py-2 text-xs disabled:opacity-50">
                    {busyClientId === client.id ? 'Generando…' : 'Regenerar PIN'}
                  </button>
                </td>
              </tr>)}</tbody>
            </table>
          </div>}
    </section>
  );
}

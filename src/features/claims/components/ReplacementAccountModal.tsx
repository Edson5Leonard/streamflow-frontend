'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useReplaceAccount } from '../hooks/useReplaceAccount';
import type { Claim } from '../types/claims.types';

export function ReplacementAccountModal({ claim, open, onOpenChange }: { claim: Claim; open: boolean; onOpenChange: (open: boolean) => void }) {
  const replacement = useReplaceAccount();
  const [done, setDone] = useState<Claim | null>(null);

  async function confirm() {
    try {
      const res = await replacement.mutateAsync({
        ventaId: claim.ventaId,
        categoriaFallo: claim.categoriaFallo,
        motivo: claim.motivo,
        comprobanteFalloUrl: claim.comprobanteFalloUrl,
      });
      setDone(res);
    } catch { /* mutation exposes error */ }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) setDone(null); onOpenChange(next); }}>
      <DialogContent>
        <DialogTitle>{done ? 'Reemplazo realizado' : 'Reemplazo express'}</DialogTitle>
        <DialogDescription>
          {done
            ? 'El reclamo se marcó como RESUELTO. Envía las nuevas credenciales al cliente por WhatsApp.'
            : 'Se usará automáticamente una cuenta disponible de tu inventario del mismo servicio.'}
        </DialogDescription>
        {done?.reemplazo && (
          <div className="rounded-xl border bg-muted/50 p-3 text-sm space-y-1">
            <p className="font-semibold">{done.reemplazo.servicio}</p>
            <p>Correo: <code>{done.reemplazo.correo}</code></p>
            <p>Contraseña: <code>{done.reemplazo.password}</code></p>
            {done.reemplazo.perfilPin && <p>Perfil / PIN: <code>{done.reemplazo.perfilPin}</code></p>}
          </div>
        )}
        {replacement.error && <p role="alert" className="text-sm text-red-500">{replacement.error.message}</p>}
        <DialogFooter>
          {done ? (
            <>
              <Button variant="outline" onClick={() => { setDone(null); onOpenChange(false); }}>Cerrar</Button>
              {done.enlaceWhatsApp && (
                <a
                  href={done.enlaceWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Enviar por WhatsApp ↗
                </a>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" disabled={replacement.isPending} onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button disabled={replacement.isPending} onClick={() => void confirm()}>
                {replacement.isPending ? 'Procesando...' : 'Confirmar reemplazo'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

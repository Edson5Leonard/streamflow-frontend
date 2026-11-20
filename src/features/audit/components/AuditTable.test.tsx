// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { AuditEvent } from '../types/audit.types';
import { AuditTable } from './AuditTable';

afterEach(cleanup);

it('allows valid accounts to be reviewed while identifying missing accounts', () => {
  const valid: AuditEvent = {
    id: 'claim-1', usuarioId: null, ventaId: 'sale-1', categoriaFallo: 'CAIDA',
    comprobanteFalloUrl: '/evidence', cuentaDefectuosaId: 'account-1', cuentaReemplazoId: 'replacement-1',
    correoAfectado: 'account@example.test', servicio: 'Servicio', motivo: 'Falla',
    estado: 'EXPRESS_REEMPLAZADO', fechaCreacion: '2026-01-01',
  };
  const missing: AuditEvent = {
    ...valid, id: 'claim-2', ventaId: 'sale-2', correoAfectado: null,
    problemaAuditoria: 'No se encontró la cuenta reportada.',
  };
  const onSelect = vi.fn();
  render(<AuditTable events={[valid, missing]} onSelect={onSelect} />);

  const validRow = screen.getByText('Servicio · account@example.test').closest('tr')!;
  fireEvent.click(within(validRow).getByRole('button', { name: 'Revisar' }));
  expect(onSelect).toHaveBeenCalledWith(valid);
  expect(within(validRow).queryByRole('button', { name: 'Recuperar' })).toBeNull();
  expect(within(validRow).queryByRole('button', { name: 'Descartar' })).toBeNull();
  const missingRow = screen.getByText('Cuenta no encontrada').closest('tr')!;
  expect(within(missingRow).getByText('Requiere revisión')).toBeTruthy();
  fireEvent.click(within(missingRow).getByRole('button', { name: 'Revisar' }));
  expect(onSelect).toHaveBeenCalledWith(missing);
});

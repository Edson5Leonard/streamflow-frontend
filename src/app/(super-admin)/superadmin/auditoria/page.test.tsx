// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuditPage from './page';

const mocks = vi.hoisted(() => ({
  discard: vi.fn(),
  compensate: vi.fn(),
  recover: vi.fn(),
  data: [{
    id: 'claim-1', usuarioId: null, ventaId: 'sale-1', categoriaFallo: 'CAIDA',
    comprobanteFalloUrl: '/evidence', cuentaDefectuosaId: 'account-1', cuentaReemplazoId: 'replacement-1',
    correoAfectado: 'account@example.test', servicio: 'Servicio', motivo: 'Falla',
    distribuidorId: 'distributor-1', estado: 'DESCARTADO', fechaCreacion: '2026-01-01',
  }],
}));
vi.mock('@/features/audit/hooks/useAudit', () => ({
  useAudit: () => ({
    data: mocks.data, isLoading: false, error: null, refetch: vi.fn(),
    discard: { mutateAsync: mocks.discard, isPending: false },
    compensate: { mutateAsync: mocks.compensate, isPending: false },
    recover: { mutateAsync: mocks.recover, isPending: false },
  }),
}));
vi.mock('@/features/claims/components/ClaimEvidenceViewer', () => ({ ClaimEvidenceViewer: () => <div>Evidencia</div> }));
afterEach(() => { cleanup(); vi.clearAllMocks(); mocks.data[0].estado = 'DESCARTADO'; });

it('requires confirmation before compensating a historical discard', async () => {
  mocks.compensate.mockResolvedValue({});
  render(<AuditPage />);
  fireEvent.click(screen.getByRole('button', { name: 'Revisar' }));
  expect(screen.getByText(/Distribuidor: distributor-1/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Compensar descarte anterior' }));
  expect(screen.getByText(/no se haya compensado fuera del sistema/)).toBeTruthy();
  expect(mocks.compensate).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(mocks.compensate).toHaveBeenCalledWith('claim-1'));
  expect(mocks.discard).not.toHaveBeenCalled();
});

it('shows a stock error and keeps the discard confirmation open', async () => {
  mocks.data[0].estado = 'EXPRESS_REEMPLAZADO';
  mocks.discard.mockRejectedValue(new Error('No hay cuentas disponibles en el stock global.'));
  render(<AuditPage />);
  fireEvent.click(screen.getByRole('button', { name: 'Revisar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Descartar cuenta' }));
  expect(screen.getByText(/Si no hay stock, no se hará el descarte/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  expect((await screen.findByRole('alert')).textContent).toContain('No hay cuentas disponibles en el stock global.');
  expect(screen.getByRole('button', { name: 'Confirmar' })).toBeTruthy();
});

// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ClaimsPage from './page';

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  claims: [
    {
      id: 'missing', usuarioId: null, ventaId: 'venta-faltante', categoriaFallo: 'CAIDA',
      comprobanteFalloUrl: '/evidence', cuentaDefectuosaId: 'missing-account', cuentaReemplazoId: null,
      motivo: 'Cuenta faltante', estado: 'PENDIENTE', fechaCreacion: '2026-01-01',
      problemaAuditoria: 'No se encontró la cuenta reportada.',
    },
    {
      id: 'valid', usuarioId: null, ventaId: 'venta-valida', categoriaFallo: 'CAIDA',
      comprobanteFalloUrl: '/evidence', cuentaDefectuosaId: 'valid-account', cuentaReemplazoId: null,
      motivo: 'Cuenta válida', estado: 'PENDIENTE', fechaCreacion: '2026-01-01',
      problemaAuditoria: null,
    },
  ],
}));

vi.mock('@/features/claims/hooks/usePendingClaims', () => ({
  usePendingClaims: () => ({ data: mocks.claims, isLoading: false, error: null, refetch: vi.fn() }),
}));
vi.mock('@/features/claims/hooks/useUpdateClaimStatus', () => ({
  useUpdateClaimStatus: () => ({ mutateAsync: mocks.update, isPending: false, error: null, reset: vi.fn() }),
}));
vi.mock('@/features/claims/components/ClaimEvidenceViewer', () => ({ ClaimEvidenceViewer: () => <div>Evidencia</div> }));
vi.mock('@/features/claims/components/ReplacementAccountModal', () => ({ ReplacementAccountModal: () => <div>Reemplazo</div> }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

it('shows missing-account claims without allowing actions and keeps valid claims actionable', async () => {
  mocks.update.mockResolvedValue({});
  render(<ClaimsPage />);
  expect(screen.getByText('Requiere revisión de datos')).toBeTruthy();
  const detailButtons = screen.getAllByRole('button', { name: 'Ver detalle' });
  fireEvent.click(detailButtons[0]);
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('alert').textContent).toContain('No se encontró la cuenta reportada.');
  expect(within(dialog).queryByRole('button', { name: 'Marcar resuelto' })).toBeNull();
  expect(within(dialog).queryByRole('button', { name: 'Rechazar' })).toBeNull();
  expect(within(dialog).queryByRole('button', { name: 'Reemplazo express' })).toBeNull();
  fireEvent.keyDown(document, { key: 'Escape' });
  fireEvent.click(detailButtons[1]);
  expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Reemplazo express' })).toBeTruthy();
  expect(mocks.update).not.toHaveBeenCalled();
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Marcar resuelto' }));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ id: 'valid', estado: 'RESUELTO' }));
});

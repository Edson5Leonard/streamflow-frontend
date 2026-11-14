// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ClientPortal } from './ClientPortal';

const mocks = vi.hoisted(() => ({ profile: vi.fn(), orders: vi.fn(), changePin: vi.fn(), replace: vi.fn(), invalidate: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ invalidateQueries: mocks.invalidate }) }));
vi.mock('@/features/client-portal/api', () => ({ clientPortalApi: { profile: mocks.profile, orders: mocks.orders, changePin: mocks.changePin } }));
vi.mock('@/features/claims/components/ClaimForm', () => ({ ClaimForm: () => null }));
vi.mock('@/features/claims/components/AutoGuaranteeResultCard', () => ({ AutoGuaranteeResultCard: () => null }));

const profile = {
  nombreCompleto: 'Cliente de prueba',
  tiendaNombre: 'Tienda de prueba',
  distribuidorId: 'store',
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.orders.mockResolvedValue([]);
  mocks.invalidate.mockResolvedValue(undefined);
  mocks.changePin.mockResolvedValue(undefined);
});
afterEach(cleanup);

describe('client portal navigation', () => {
  it('opens the catalog after changing the temporary PIN', async () => {
    mocks.profile.mockResolvedValue({ ...profile, pinDebeCambiar: true });
    render(<ClientPortal />);
    fireEvent.change(await screen.findByLabelText('PIN temporal actual'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('PIN nuevo'), { target: { value: '654321' } });
    fireEvent.change(screen.getByLabelText('Confirmar PIN nuevo'), { target: { value: '654321' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar PIN' }).closest('form')!);

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/dashboard/catalogo'));
    expect(mocks.changePin).toHaveBeenCalledWith('123456', '654321');
    expect(mocks.invalidate).toHaveBeenCalledWith({ queryKey: ['auth', 'profile'] });
  });

  it('keeps order history accessible inside the buyer dashboard', async () => {
    mocks.profile.mockResolvedValue({ ...profile, pinDebeCambiar: false });
    render(<ClientPortal embedded />);
    expect(await screen.findByText('Mis pedidos')).toBeTruthy();
    expect(mocks.orders).toHaveBeenCalledOnce();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});

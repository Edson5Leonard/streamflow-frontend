// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ClientLoginForm } from './ClientLoginForm';

const mocks = vi.hoisted(() => ({ login: vi.fn(), replace: vi.fn(), clear: vi.fn(), saveSession: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ clear: mocks.clear }) }));
vi.mock('@/lib/auth', () => ({ saveSession: mocks.saveSession }));
vi.mock('@/features/client-portal/api', () => ({ clientPortalApi: { login: mocks.login } }));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe('client login', () => {
  it.each([
    [true, '/cliente/portal'],
    [false, '/dashboard/catalogo'],
  ])('opens the appropriate page when pinDebeCambiar is %s', async (pinDebeCambiar, destination) => {
    mocks.login.mockResolvedValue({ token: 'token', usuarioId: 'client', role: 'ROLE_COMPRADOR', pinDebeCambiar });
    render(<ClientLoginForm initialDistributorId="store" />);
    fireEvent.change(screen.getByLabelText('WhatsApp'), { target: { value: '+51900000000' } });
    fireEvent.change(screen.getByLabelText('PIN de seis dígitos'), { target: { value: '123456' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form')!);

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith(destination));
    expect(mocks.clear).toHaveBeenCalledOnce();
    expect(mocks.saveSession).toHaveBeenCalledWith(expect.objectContaining({ tipoCuenta: 'CLIENTE' }));
  });
});

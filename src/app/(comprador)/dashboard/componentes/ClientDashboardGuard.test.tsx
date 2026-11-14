// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ClientDashboardGuard } from './ClientDashboardGuard';

const mocks = vi.hoisted(() => ({ profile: vi.fn(), replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('@/features/auth/hooks/useProfile', () => ({ useProfile: mocks.profile }));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe('client dashboard', () => {
  it('requires changing a temporary PIN before opening the dashboard', async () => {
    mocks.profile.mockReturnValue({ data: { pinDebeCambiar: true }, isLoading: false });
    render(<ClientDashboardGuard>Catálogo privado</ClientDashboardGuard>);
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/cliente/portal'));
    expect(screen.queryByText('Catálogo privado')).toBeNull();
  });

  it('opens the dashboard after the PIN has been changed', () => {
    mocks.profile.mockReturnValue({ data: { pinDebeCambiar: false }, isLoading: false });
    render(<ClientDashboardGuard>Catálogo privado</ClientDashboardGuard>);
    expect(screen.getByText('Catálogo privado')).toBeTruthy();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});

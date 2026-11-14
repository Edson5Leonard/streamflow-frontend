// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PaymentForm } from './PaymentForm';

const mocks = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('../hooks/useCreatePayment', () => ({
  useCreatePayment: () => ({ mutateAsync: mocks.mutate, isPending: false, error: null }),
}));
vi.mock('@/components/payments/PaymentInstructions', () => ({
  PaymentInstructions: () => <div>Datos de pago de la tienda</div>,
}));
vi.mock('./VoucherUploader', () => ({
  VoucherUploader: ({ onChange }: { onChange: (file: File | null) => void }) =>
    <input aria-label="Comprobante" type="file" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />,
}));

const client = {
  distribuidorId: '11111111-1111-4111-8111-111111111111',
  nombreCompleto: 'Cliente de prueba',
  whatsapp: '+51900000000',
};
const paymentMethod = {
  metodo: 'PLIN' as const,
  imagenQrUrl: null,
  numeroCuenta: null,
  cci: null,
  titular: null,
  activo: true,
};

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe('client payment', () => {
  it('submits a purchase for the authenticated client using an active store method', async () => {
    mocks.mutate.mockResolvedValue({ id: 'payment' });
    render(<PaymentForm servicioId="22222222-2222-4222-8222-222222222222" client={client} metodosTienda={[paymentMethod]} />);
    fireEvent.change(screen.getByLabelText('Código de operación'), { target: { value: '12345' } });
    const file = new File(['voucher'], 'voucher.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Comprobante'), { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('button', { name: 'Enviar comprobante' }).closest('form')!);

    await waitFor(() => expect(mocks.mutate).toHaveBeenCalledWith(expect.objectContaining({
      ...client,
      servicioId: '22222222-2222-4222-8222-222222222222',
      metodoPago: 'PLIN',
      comprobante: file,
    })));
  });

  it('does not submit when the store has no active payment method', () => {
    render(<PaymentForm servicioId="22222222-2222-4222-8222-222222222222" client={client} metodosTienda={[]} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Enviar comprobante' }).closest('form')!);
    expect(screen.getByRole('alert').textContent).toContain('método de pago disponible');
    expect(mocks.mutate).not.toHaveBeenCalled();
  });
});

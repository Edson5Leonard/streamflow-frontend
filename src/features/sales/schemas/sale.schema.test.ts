import { describe, expect, it } from 'vitest';
import { saleSchema } from './sale.schema';

const sale = {
  id: 'b1111111-1111-4111-8111-111111111111',
  compradorId: '11111111-1111-4111-8111-111111111111',
  cuentaStockId: 'b2222222-2222-4222-8222-222222222222',
  precioPagado: 18.9,
  pagoId: null,
  fechaVenta: '2026-10-15T10:30:00',
};

describe('saleSchema', () => {
  it('accepts a list containing sales with and without a linked buyer', () => {
    const sales = [sale, { ...sale, compradorId: null }];
    expect(saleSchema.array().parse(sales)).toEqual(sales);
  });

  it('rejects invalid or missing buyer IDs', () => {
    expect(saleSchema.safeParse({ ...sale, compradorId: 'invalid' }).success).toBe(false);
    expect(saleSchema.safeParse({ ...sale, compradorId: undefined }).success).toBe(false);
  });
});

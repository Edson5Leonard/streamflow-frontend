export function formatCurrency(value: number, currency = 'PEN', locale = 'es-PE') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

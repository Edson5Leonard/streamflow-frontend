export const wallets = {
  YAPE: { name: 'Yape', holder: 'José Rubén Vitate Quillay', logo: '/logo/yape.png', qr: '/qr/yape.png', width: 212, height: 212 },
  PLIN: { name: 'Plin', holder: 'José Vitate', logo: '/logo/plin.png', qr: '/qr/plin.png', width: 340, height: 337 },
} as const;

export const banks = {
  BCP: { name: 'BCP', accountLabel: 'Cuenta BCP en soles', account: '19191935345082', cci: '00219119193534508258' },
  INTERBANK: { name: 'Interbank', accountLabel: 'Cuenta Simple Soles', account: '8983150166600', cci: '00389801315016660045' },
} as const;

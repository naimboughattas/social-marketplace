export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK: 'bank',
  PAYPAL: 'paypal'
} as const;

export const TVA_RATE = 0.20;
export const COMMISSION_RATE = 0.15;

export const PACKS = [
  { id: 1, amount: 50, bonus: 0 },
  { id: 2, amount: 100, bonus: 5, popular: true },
  { id: 3, amount: 200, bonus: 15 },
  { id: 4, amount: 500, bonus: 50 }
];
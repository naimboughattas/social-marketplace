// Configuration centralisée
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '',
    timeout: 10000
  },
  features: {
    aiPilot: true,
    multiSelect: true,
    autoRecharge: true
  },
  limits: {
    maxFollowers: 1000000,
    maxPrice: 10000,
    minAmount: 10
  },
  defaults: {
    currency: '€',
    language: 'fr',
    country: 'France',
    deliveryTime: 48,
    validationTime: 24
  }
} as const;
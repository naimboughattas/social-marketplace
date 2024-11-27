// Utilitaire pour générer des références de paiement
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `REF-${timestamp}-${random}`;
}
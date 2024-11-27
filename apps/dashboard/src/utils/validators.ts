export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateIBAN(iban: string) {
  // Basic IBAN validation - should be replaced with a proper IBAN validation library
  return /^[A-Z]{2}\d{2}[A-Z0-9]{4,}$/.test(iban.replace(/\s/g, ''));
}

export function validateCardNumber(cardNumber: string) {
  return /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
}

export function validateCVC(cvc: string) {
  return /^\d{3,4}$/.test(cvc);
}

export function validateExpiry(expiry: string) {
  const [month, year] = expiry.split('/');
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt(year, 10);

  if (isNaN(expiryMonth) || isNaN(expiryYear)) return false;
  if (expiryMonth < 1 || expiryMonth > 12) return false;
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

  return true;
}
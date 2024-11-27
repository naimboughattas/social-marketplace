export function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatPrice(price: number) {
  return `${price.toFixed(2)} €`;
}

export function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins : ''}`;
}

export function calculateTVA(amount: number) {
  const tva = amount * 0.20;
  return {
    ht: amount,
    tva,
    ttc: amount + tva
  };
}
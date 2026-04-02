let counter = 1000;

export function generateOrderId(): string {
  counter += 1;
  return `ORD-${counter}`;
}

export function generateReferenceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'REF-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatCurrency(amount: number): string {
  return `LKR ${new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

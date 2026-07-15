// Shown when a shipment has no agreed price yet.
const NO_PRICE = '—';

type PriceInput = number | string | null | undefined;

// Shipment price is unset on the backend until a bid is accepted, and arrives
// as a string on some endpoints. Anything we can't read as a real number is
// "no price" — never 0, which would render as a genuine "$0" quote.
const toAmount = (value: PriceInput): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount) ? amount : null;
};

/**
 * Formats a minimum and maximum price into a professional range string.
 * Example: (1200, 1300) => "$1,200 - $1,300"
 * A shipment with no agreed price yet formats as "—".
 */
export const formatPriceRange = (min: PriceInput, max: PriceInput): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // Change these to 2 if you want to show cents (e.g., $1,200.00)
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const lo = toAmount(min);
  const hi = toAmount(max);

  // No price agreed yet — say so rather than quoting a fabricated $0.
  if (lo === null && hi === null) return NO_PRICE;

  // Only one bound known: show it as a single price rather than a half-range.
  if (lo === null) return formatter.format(hi as number);
  if (hi === null) return formatter.format(lo);

  // A single fixed price comes through as min === max — show it once, not as a
  // "$2,500 - $2,500" range.
  if (lo === hi) return formatter.format(lo);

  return `${formatter.format(lo)} - ${formatter.format(hi)}`;
};

/**
 * Optional: Helper for single price formatting
 * Example: (200000) => "$200,000"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
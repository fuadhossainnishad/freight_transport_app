/**
 * Formats a minimum and maximum price into a professional range string.
 * Example: (1200, 1300) => "$1,200 - $1,300"
 */
export const formatPriceRange = (min: number, max: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // Change these to 2 if you want to show cents (e.g., $1,200.00)
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  });

  const formattedMin = formatter.format(min);
  const formattedMax = formatter.format(max);

  return `${formattedMin} - ${formattedMax}`;
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
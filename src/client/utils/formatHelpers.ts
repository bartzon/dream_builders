/**
 * Format a number with thousand separators using dots
 * e.g., 1000000 -> 1.000.000
 */
export function formatWithThousandSeparators(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Format currency with thousand separators
 * e.g., 1000000 -> $1.000.000
 */
export function formatCurrency(num: number): string {
  return `$${formatWithThousandSeparators(num)}`
} 
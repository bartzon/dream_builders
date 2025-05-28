export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function formatKeyword(keyword: string): string {
  // Add special formatting for keywords if needed
  return keyword;
} 
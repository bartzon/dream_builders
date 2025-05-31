import type { ClientCard, EffectContextUI } from '../types/game';

/**
 * Calculate the total revenue for a product including all bonuses
 * @param product - The product card to calculate revenue for
 * @param appliedCards - List of cards that may apply bonuses (tools, employees, etc.)
 * @param effectContext - The effect context containing temporary bonuses
 * @returns The total revenue per sale for the product
 */
export function calculateProductRevenue(
  product: ClientCard,
  appliedCards: ClientCard[],
  effectContext?: EffectContextUI
): number {
  // Base case: if not a product or no revenue, return 0
  if (product.type !== 'Product' || !product.revenuePerSale) {
    return 0;
  }

  // Start with base revenue
  let totalRevenue = product.revenuePerSale;

  // If no bonuses to apply, return base revenue
  if (!appliedCards || appliedCards.length === 0) {
    return totalRevenue;
  }

  // Loop through applied cards and add bonuses
  for (const card of appliedCards) {
    // Optimize Checkout: Your Products sell for $1000 more
    if (card.effect === 'optimize_checkout') {
      totalRevenue += 1000;
    }
    // Add other tool/employee revenue bonuses here as they're implemented
  }

  // Apply temporary product-specific bonuses from effect context
  if (effectContext && product.id && effectContext.productRevenueBoosts?.[product.id]) {
    totalRevenue += effectContext.productRevenueBoosts[product.id];
  }

  return totalRevenue;
}

/**
 * Check if a specific tool effect is active in the applied cards
 * @param appliedCards - List of cards to check
 * @param effect - The effect name to look for
 * @returns Whether the effect is active
 */
export function hasActiveEffect(appliedCards: ClientCard[], effect: string): boolean {
  return appliedCards.some(card => card.effect === effect);
} 
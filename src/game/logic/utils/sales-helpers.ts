import type { GameState } from '../../state';
import type { Card } from '../../types';
import { findProductWithInventory } from './inventory-helpers';
import { gainRevenue } from './effect-helpers';

// Forward declaration for cardEffects to break circular dependency for sellProduct
// The actual cardEffects object will be passed in at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cardEffectsRegistry: Record<string, (G: GameState, playerID: string, card: Card) => void> = {};

export function _setSalesHelperCardEffectsRegistry(registry: Record<string, (G: GameState, playerID: string, card: Card) => void>) {
  cardEffectsRegistry = registry;
}

export function sellFirstAvailableProduct(G: GameState, playerID: string): boolean {
  const player = G.players[playerID];
  const product = findProductWithInventory(player);
  if (product) {
    // sellProduct is now in this file
    sellProduct(G, playerID, product, 1);
    return true;
  }
  return false;
}

export function sellProduct(G: GameState, playerID: string, product: Card, quantity: number = 1): number {
  // Add inventory validation
  if (!product.inventory || product.inventory < quantity) {
    console.warn(`Cannot sell ${quantity} of ${product.name} - only ${product.inventory || 0} available`);
    return 0;
  }
  
  const player = G.players[playerID];
  const baseRevenue = (product.revenuePerSale || 0) * quantity;
  let totalRevenue = baseRevenue;
  
  // Apply Optimize Checkout bonus - $1000 more per product sold
  if (player.board.Tools.find(t => t.effect === 'optimize_checkout')) {
    totalRevenue += 1000 * quantity;
  }
  
  const ctx = G.effectContext?.[playerID];
  if (ctx) {
    // Apply per-product revenue boosts
    if (ctx.productRevenueBoosts && ctx.productRevenueBoosts[product.id]) {
      totalRevenue += ctx.productRevenueBoosts[product.id] * quantity;
      // Don't delete the boost - let it persist for the turn
      // It will be cleared in clearTempEffects
    }
  }
  
  product.inventory -= quantity;
  gainRevenue(G, playerID, totalRevenue); // Uses imported helper
  
  // Trigger the product's own sale effect, if any.
  // This is tricky due to potential circular dependencies with the main cardEffects registry.
  // A common pattern is for product sale effects to be named distinctively (e.g., 'productX_sale')
  // and for the game engine to look them up, or for products to have a dedicated 'onSaleEffect' field.
  // For now, this attempts to call an effect if it seems like a sale-specific one.
  if (product.effect && product.effect.endsWith('_sale') && cardEffectsRegistry[product.effect]) {
    cardEffectsRegistry[product.effect](G, playerID, product);
  }
  
  if (ctx) {
    ctx.soldProductThisTurn = true;
    ctx.itemsSoldThisTurn = (ctx.itemsSoldThisTurn || 0) + quantity;
  }
  return totalRevenue;
} 
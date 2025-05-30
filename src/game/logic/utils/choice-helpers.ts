import type { PlayerState } from '../../state';
import type { Card } from '../../types';
import { addInventoryToSpecificProduct } from './inventory-helpers'; // Assuming it's in the same utils folder

// Creates a pending choice for the player if multiple products match a criteria,
// or auto-resolves if only one matches.
export function createProductChoice(player: PlayerState, effect: string, filter?: (p: Card) => boolean): void {
  const products = filter
    ? player.board.Products.filter(p => p.isActive !== false && filter(p))
    : player.board.Products.filter(p => p.isActive !== false);

  if (products.length === 0) return;

  if (products.length === 1) {
    // Auto-resolve if only one choice, applying the effect directly
    handleSingleProductChoice(products[0], effect);
  } else {
    // Create pending choice for multiple options
    player.pendingChoice = {
      type: 'choose_card',
      effect,
      cards: products.map(p => ({ ...p })), // Send copies to client
    };
  }
}

// Handles the direct application of an effect when only one product is a valid target.
// Called by createProductChoice.
export function handleSingleProductChoice(product: Card, effect: string): void {
  switch (effect) {
    case 'add_inventory_to_product':
      addInventoryToSpecificProduct(product, 2);
      break;
    case 'add_inventory_if_empty':
      if (product.inventory === 0) product.inventory = 3;
      break;
    case 'simple_inventory_boost':
    case 'draw_and_inventory': // For 'Inventory Forecast Tool' which draws then adds 1 inv
      addInventoryToSpecificProduct(product, 1);
      break;
    // Other single-target auto-resolve effects could be added here
  }
} 
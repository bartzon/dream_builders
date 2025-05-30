import type { PlayerState } from '../../state';
import type { Card } from '../../types';

// Creates a pending choice for the player if multiple products match a criteria.
// Player must always make a choice if there are any valid targets.
export function createProductChoice(player: PlayerState, effect: string, filter?: (p: Card) => boolean): void {
  const products = filter
    ? player.board.Products.filter(p => p.isActive !== false && filter(p))
    : player.board.Products.filter(p => p.isActive !== false);

  if (products.length > 0) {
    // Always create pending choice if there are any valid products
    player.pendingChoice = {
      type: 'choose_card',
      effect,
      cards: products.map(p => ({ ...p })), // Send copies to client
    };
  }
  // If products.length === 0, no choice is created, effect might do nothing or have other non-targeting behavior.
}

// handleSingleProductChoice is being removed as choices are no longer auto-resolved. 
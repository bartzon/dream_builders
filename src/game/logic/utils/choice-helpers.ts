import type { PlayerState } from '../../state';
import type { Card } from '../../types';
import type { PendingChoice } from '../../state';

// Creates a pending choice for the player if multiple products match a criteria.
// Player must always make a choice if there are any valid targets.
export function createProductChoice(player: PlayerState, effect: string, filter?: (p: Card) => boolean): void {
  const products = filter
    ? player.board.Products.filter(p => p.isActive !== false && filter(p))
    : player.board.Products.filter(p => p.isActive !== false);

  if (products.length > 0) {
    // Always create pending choice if there are any valid products
    addPendingChoice(player, {
      type: 'choose_card',
      effect,
      cards: products.map(p => ({ ...p })), // Send copies to client
    });
  }
  // If products.length === 0, no choice is created, effect might do nothing or have other non-targeting behavior.
}

// handleSingleProductChoice is being removed as choices are no longer auto-resolved.

/**
 * Add a pending choice to the player's queue
 */
export function addPendingChoice(player: PlayerState, choice: PendingChoice): void {
  player.pendingChoices.push(choice);
}

/**
 * Get the current pending choice (first in queue)
 */
export function getCurrentPendingChoice(player: PlayerState): PendingChoice | undefined {
  return player.pendingChoices[0];
}

/**
 * Remove and return the current pending choice
 */
export function resolveCurrentPendingChoice(player: PlayerState): PendingChoice | undefined {
  return player.pendingChoices.shift();
}

/**
 * Check if player has any pending choices
 */
export function hasPendingChoice(player: PlayerState): boolean {
  return player.pendingChoices.length > 0;
}

/**
 * Clear all pending choices (used for cleanup)
 */
export function clearPendingChoices(player: PlayerState): void {
  player.pendingChoices = [];
} 
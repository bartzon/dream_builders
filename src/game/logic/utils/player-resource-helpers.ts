import type { PlayerState } from '../../state';

/**
 * Spend capital from a player
 */
export function spendCapital(player: PlayerState, amount: number): boolean {
  if (player.capital >= amount) {
    player.capital -= amount;
    return true;
  }
  return false;
}

// Other resource-related helpers could go here:
// e.g., addAudience, spendAudience, checkResource(player, resourceType, amount) 
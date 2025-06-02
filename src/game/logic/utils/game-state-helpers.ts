import type { GameState } from '../../state';
import { GAME_CONFIG } from '../../constants';

/**
 * Check if the game has ended based on win/loss conditions.
 */
export function checkGameEnd(G: GameState): void {
  // Win condition: Player revenue >= goal
  for (const playerID in G.players) {
    const player = G.players[playerID];
    if (player.revenue >= GAME_CONFIG.REVENUE_GOAL) {
      G.gameOver = true;
      G.winner = true;
      return;
    }
  }
  
  // Loss condition: All players have exhausted decks AND no products with inventory
  let allPlayersLost = true;
  for (const playerID in G.players) {
    const player = G.players[playerID];
    
    // If player still has cards in deck, they haven't lost
    if (player.deck.length > 0) {
      allPlayersLost = false;
      break;
    }
    
    // If player has any products with inventory, they haven't lost
    const hasProductsWithInventory = player.board.Products.some(
      product => product.inventory && product.inventory > 0 && product.isActive !== false
    );
    if (hasProductsWithInventory) {
      allPlayersLost = false;
      break;
    }
  }
  
  if (allPlayersLost) {
    G.gameOver = true;
    G.winner = false; // Explicitly set winner to false for loss condition
  }
} 
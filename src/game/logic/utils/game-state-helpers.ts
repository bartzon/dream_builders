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
  
  // Loss condition: All players have exhausted decks, no playable cards, and no products with inventory
  let allPlayersStuck = true;
  for (const playerID in G.players) {
    const player = G.players[playerID];
    
    if (player.deck.length > 0) {
      allPlayersStuck = false;
      break;
    }
    
    const hasPlayableCard = player.hand.some(card => card.cost <= player.capital);
    if (hasPlayableCard) {
      allPlayersStuck = false;
      break;
    }
    
    const hasProductsWithInventory = player.board.Products.some(
      product => product.inventory && product.inventory > 0 && product.isActive !== false
    );
    if (hasProductsWithInventory) {
      allPlayersStuck = false;
      break;
    }
  }
  
  if (allPlayersStuck) {
    G.gameOver = true;
    G.winner = false; // Explicitly set winner to false for loss condition
  }
} 
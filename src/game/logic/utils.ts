import type { PlayerState, GameState } from "../state";
import type { Card } from "../types";
import { GAME_CONFIG } from "../constants";

/**
 * Draw a card from the player's deck to their hand
 */
export function drawCard(player: PlayerState): void {
  if (player.deck.length > 0) {
    const card = player.deck.pop();
    if (card) {
      player.hand.push(card);
    }
  }
}

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

/**
 * Check if the game has ended
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
  
  // Loss condition: All players have exhausted decks and can't act
  let allPlayersStuck = true;
  
  for (const playerID in G.players) {
    const player = G.players[playerID];
    
    // Player can still act if they have cards in deck or playable cards in hand
    if (player.deck.length > 0) {
      allPlayersStuck = false;
      break;
    }
    
    // Check if player has any playable cards
    const hasPlayableCard = player.hand.some(card => card.cost <= player.capital);
    if (hasPlayableCard) {
      allPlayersStuck = false;
      break;
    }
  }
  
  if (allPlayersStuck) {
    G.gameOver = true;
    G.winner = false;
  }
}

/**
 * Initialize a player's state
 */
export function initializePlayer(
  hero: PlayerState["hero"],
  deck: Card[]
): PlayerState {
  const player: PlayerState = {
    hand: [],
    deck: [...deck], // Copy the deck
    board: {
      Tools: [],
      Products: [],
      Employees: [],
    },
    revenue: 0,
    capital: 0,
    hero,
    heroAbilityUsed: false,
  };
  
  // Shuffle deck
  for (let i = player.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
  }
  
  // Draw initial hand
  for (let i = 0; i < GAME_CONFIG.STARTING_HAND_SIZE; i++) {
    drawCard(player);
  }
  
  return player;
} 
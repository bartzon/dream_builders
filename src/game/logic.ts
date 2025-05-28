import type { GameState, PlayerState } from "./state";
import type { Card } from "./types";
import { INVALID_MOVE } from "boardgame.io/core";
import { GAME_CONFIG } from "./constants";

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
 * Play a card from hand
 */
export function playCard(
  G: GameState,
  playerID: string,
  cardIndex: number
): typeof INVALID_MOVE | void {
  const player = G.players[playerID];
  
  if (cardIndex < 0 || cardIndex >= player.hand.length) {
    return INVALID_MOVE;
  }
  
  const card = player.hand[cardIndex];
  
  // Check if player can afford the card
  if (!spendCapital(player, card.cost)) {
    return INVALID_MOVE;
  }
  
  // Remove card from hand
  player.hand.splice(cardIndex, 1);
  
  // Place card on board or resolve immediately
  switch (card.type) {
    case "Tool":
      player.board.Tools.push(card);
      break;
    case "Product":
      player.board.Products.push(card);
      break;
    case "Employee":
      player.board.Employees.push(card);
      break;
    case "Action":
      // Actions resolve immediately
      applyCardEffect(G, playerID, card);
      break;
  }
  
  // Apply any immediate effects for non-Action cards
  if (card.type !== "Action") {
    applyCardEffect(G, playerID, card);
  }
}

/**
 * Apply a card's effect (stub for now)
 */
export function applyCardEffect(
  G: GameState,
  playerID: string,
  card: Card
): void {
  // Stub: Card effects will be implemented later
  // This is where card-specific logic would go
  console.log(`Applying effect for card: ${card.name}`);
  
  // Example stub for revenue-generating cards
  if (card.type === "Product") {
    // Placeholder revenue calculation
    const revenue = card.cost * 1000; // Simple placeholder
    G.players[playerID].revenue += revenue;
    G.teamRevenue += revenue;
  }
}

/**
 * Apply all recurring effects for a player
 */
export function applyRecurringEffects(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  
  // Check all cards on the player's board for Recurring keyword
  const allBoardCards = [
    ...player.board.Tools,
    ...player.board.Products,
    ...player.board.Employees,
  ];
  
  for (const card of allBoardCards) {
    if (card.keywords?.includes("Recurring")) {
      applyCardEffect(G, playerID, card);
    }
  }
}

/**
 * Apply overhead effects (drains capital/revenue)
 */
export function applyOverheadEffects(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  
  // Check all cards for Overhead keyword
  const allBoardCards = [
    ...player.board.Tools,
    ...player.board.Products,
    ...player.board.Employees,
  ];
  
  for (const card of allBoardCards) {
    if (card.keywords?.includes("Overhead")) {
      // Stub: Overhead logic would go here
      // For now, just drain 1 capital per overhead card
      player.capital = Math.max(0, player.capital - 1);
    }
  }
}

/**
 * Check if the game has ended
 */
export function checkGameEnd(G: GameState): void {
  // Win condition: Team revenue >= goal
  if (G.teamRevenue >= GAME_CONFIG.REVENUE_GOAL) {
    G.gameOver = true;
    G.winner = true;
    return;
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
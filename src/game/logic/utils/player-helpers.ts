import type { PlayerState } from '../../state';
import type { Card } from '../../types';
import { GAME_CONFIG } from '../../constants';
import { drawCard } from './deck-helpers';

/**
 * Initialize a player's state, including shuffling their deck and drawing an initial hand.
 */
export function initializePlayer(
  hero: PlayerState["hero"],
  deck: Card[]
): PlayerState {
  const player: PlayerState = {
    hand: [],
    deck: [...deck], // Copy the deck to prevent mutation of the source
    board: {
      Tools: [],
      Products: [],
      Employees: [],
    },
    revenue: 0,
    capital: 0, // Initial capital is typically set in game.setup after this
    hero,
    heroAbilityUsed: false,
    pendingChoices: [], // Initialize empty pending choices queue
  };
  
  // Shuffle deck
  // This could also be a utility in deck-helpers.ts: shuffleDeck(player.deck);
  for (let i = player.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
  }
  
  // Draw initial hand
  for (let i = 0; i < GAME_CONFIG.STARTING_HAND_SIZE; i++) {
    drawCard(player); // Uses imported drawCard from deck-helpers
  }
  
  return player;
} 
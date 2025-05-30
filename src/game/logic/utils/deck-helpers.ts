import type { PlayerState } from '../../state';
// import type { Card } from '../../types'; // Card might not be strictly needed here if only manipulating deck/hand

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

// Other deck-related helpers could go here, e.g.:
// - shuffleDeck(player: PlayerState): void
// - addCardToDeck(player: PlayerState, card: Card, position: 'top' | 'bottom'): void
// - moveCardFromHandToDeck(player: PlayerState, cardId: string, position: 'top' | 'bottom'): void 
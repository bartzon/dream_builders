import type { PlayerState } from '../../state';
import type { Card } from '../../types';

/**
 * Draw a card from the player's deck to their hand
 * @param player - The player drawing the card
 * @param reason - Optional reason for drawing (for game log)
 * @param gameLog - Optional game log array to log the draw
 * @returns The card that was drawn, or undefined if deck was empty
 */
export function drawCard(player: PlayerState, reason?: string, gameLog?: string[]): Card | undefined {
  if (player.deck.length > 0) {
    const card = player.deck.pop();
    if (card) {
      player.hand.push(card);
      if (gameLog && reason) {
        gameLog.push(`${reason}: Drew ${card.name}`);
      } else if (gameLog) {
        gameLog.push(`Drew ${card.name}`);
      }
      return card;
    }
  } else {
    if (gameLog) {
      gameLog.push(`${reason ? reason + ': ' : ''}Cannot draw - deck is empty!`);
    }
  }
  return undefined;
}

// Other deck-related helpers could go here, e.g.:
// - shuffleDeck(player: PlayerState): void
// - addCardToDeck(player: PlayerState, card: Card, position: 'top' | 'bottom'): void
// - moveCardFromHandToDeck(player: PlayerState, cardId: string, position: 'top' | 'bottom'): void 
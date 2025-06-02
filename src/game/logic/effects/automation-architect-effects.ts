import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  gainCapital,
  drawCards,
  applyTemporaryBonus
} from '../utils/effect-helpers';
import { addPendingChoice } from '../utils/choice-helpers';

const passiveEffect = () => {};

// Effects for Automation Architect cards
export const automationArchitectCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Auto Fulfill: Recurring: Gain 1 capital if you sold a Product last turn.
  'auto_fulfill': passiveEffect,
  // Optimize Checkout: Your Products sell for $1000 more.
  'optimize_checkout': passiveEffect,
  // Analytics Dashboard: Recurring: Look at the top 2 cards of your deck. You may discard one.
  'analytics_dashboard': passiveEffect,
  // Email Automation: Recurring: Gain 1 capital.
  'email_automation': passiveEffect,
  // A/B Test: Draw 2 cards. Discard 1 (one of the two drawn).
  'ab_test': (G, playerID, card) => {
    const player = G.players[playerID];
    const handSizeBeforeDraw = player.hand.length;
    drawCards(G, playerID, 2, 'A/B Test');
    const cardsDrawnCount = player.hand.length - handSizeBeforeDraw;

    if (cardsDrawnCount > 0) {
      const drawnCards = player.hand.slice(-cardsDrawnCount);
      if (drawnCards.length > 0) {
        addPendingChoice(player, {
          type: 'choose_from_drawn_to_discard',
          effect: 'ab_test_discard',
          cards: drawnCards.map(c => ({ ...c })),
          count: 1,
          sourceCard: card ? { ...card } : undefined
        });
      }
    } else {
      if(G.gameLog) G.gameLog.push('A/B Test: Drew no cards, no discard necessary.');
    }
  },
  // Scale Systems: Recurring: Gain 1 capital.
  'scale_systems': passiveEffect,
  // Optimize Workflow: Your next card costs 2 less.
  'optimize_workflow': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 2);
  },
  // Custom App: When played: draw 1 card. Recurring: Gain 1 capital.
  'custom_app': (G, playerID) => {
    // Immediate effect: draw 1 card
    drawCards(G, playerID, 1, 'Custom App');
    // The recurring effect (gain 1 capital) is handled by passive-effects.ts
  },
  // Zap Everything: Gain 2 capital. If you control 3+ Tools, gain 1 more.
  'zap_everything': (G, playerID) => {
    const player = G.players[playerID];
    const toolCount = player.board.Tools.length;
    
    // Gain 2 capital base
    gainCapital(G, playerID, 2);
    
    // If 3 or more Tools, gain 1 additional capital
    if (toolCount >= 3) {
      gainCapital(G, playerID, 1);
      if (G.gameLog) {
        G.gameLog.push(`Zap Everything: Gained 3 capital total (bonus for having ${toolCount} Tools)`);
      }
    } else if (G.gameLog) {
      G.gameLog.push(`Zap Everything: Gained 2 capital`);
    }
  },
  // Technical Cofounder: Your Tools cost 1 less.
  'technical_cofounder': passiveEffect,
}; 
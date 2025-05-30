import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  gainCapital,
  drawCards,
  applyTemporaryBonus
} from '../utils/effect-helpers';
import { drawCard as drawSingleCard } from '../utils/deck-helpers';

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
    drawCards(G, playerID, 2);
    const cardsDrawnCount = player.hand.length - handSizeBeforeDraw;

    if (cardsDrawnCount > 0) {
      const drawnCards = player.hand.slice(-cardsDrawnCount);
      if (drawnCards.length > 0) {
        player.pendingChoice = {
          type: 'choose_from_drawn_to_discard',
          effect: 'ab_test_discard',
          cards: drawnCards.map(c => ({ ...c })),
          count: 1,
          sourceCard: card ? { ...card } : undefined
        };
      }
    } else {
      if(G.gameLog) G.gameLog.push('A/B Test: Drew no cards, no discard necessary.');
    }
  },
  // Scale Systems: At the end of your turn, repeat the first Recurring effect you triggered this turn.
  'scale_systems': passiveEffect,
  // Optimize Workflow: Your next card costs 2 less.
  'optimize_workflow': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 2);
  },
  // Custom App: You may play this as an Action to copy a Tool's effect this turn.
  'custom_app': passiveEffect,
  // Zap Everything: Trigger all your Tools' Recurring effects.
  'zap_everything': (G, playerID) => {
    const player = G.players[playerID];
    const gameLog = G.gameLog || [];
    gameLog.push(`Player ${playerID} plays Zap Everything!`);
    player.board.Tools.forEach((tool: Card) => {
      let triggered = false;
      switch (tool.effect) {
        case 'auto_fulfill':
          if (G.effectContext?.[playerID]?.soldProductLastTurn) {
            gainCapital(G, playerID, 1);
            triggered = true;
          }
          break;
        case 'email_automation': gainCapital(G, playerID, 1); triggered = true; break;
        case 'basic_script': gainCapital(G, playerID, 1); triggered = true; break;
        case 'ml_model': { 
          const toolCount = player.board.Tools.length;
          gainCapital(G, playerID, toolCount);
          triggered = true;
          break;
        }
        case 'legacy_playbook': drawSingleCard(player); triggered = true; break;
        case 'board_of_directors': gainCapital(G, playerID, 2); triggered = true; break;
        case 'shoestring_budget': gameLog.push(`${tool.name} recurring effect noted (normally applies to next card play).`); break;
      }
      if (triggered) gameLog.push(`Zapped ${tool.name}: its recurring effect was triggered.`);
    });
    G.gameLog = gameLog;
  },
  // Technical Cofounder: Your Tools cost 1 less.
  'technical_cofounder': passiveEffect,
}; 
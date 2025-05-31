import type { GameState } from '../../state';
import type { Card } from '../../types'; // Import Card type
import { drawCard } from '../utils/deck-helpers'; // Assuming drawCard is what's needed
import { addPendingChoice } from '../utils/choice-helpers';

export function handleSerialFounderChoicePassives(G: GameState, playerID: string): void {
  const player = G.players[playerID];

  // Legacy Playbook - draw 1 extra card at the start of your turn
  const legacyPlaybook = player.board.Tools.find(t => t.effect === 'legacy_playbook');
  if (legacyPlaybook) {
    drawCard(player);
    if(G.gameLog) G.gameLog.push('Legacy Playbook drew an extra card.');
  }

  // Board of Directors - Recurring: Gain 2 capital
  const boardOfDirectors = player.board.Tools.find(t => t.effect === 'board_of_directors');
  if (boardOfDirectors) {
    player.capital = Math.min(10, player.capital + 2);
    if(G.gameLog) G.gameLog.push('Board of Directors provided +2 Capital.');
  }

  // Growth Hacking - choose bonus each turn
  const growthHacking = player.board.Tools.find(t => t.effect === 'growth_hacking');
  if (growthHacking) {
    const turnMod = G.turn % 3;
    if (turnMod === 0) {
      player.capital = Math.min(10, player.capital + 1);
      if(G.gameLog) G.gameLog.push('Growth Hacking provided +1 Capital.');
    } else if (turnMod === 1) {
      drawCard(player);
      if(G.gameLog) G.gameLog.push('Growth Hacking provided +1 Card.');
    } else {
      player.revenue += 20000;
      if(G.gameLog) G.gameLog.push('Growth Hacking provided +$20k Revenue.');
    }
  }
  
  // Business Development - choose different bonus each turn
  const businessDev = player.board.Employees.find(e => e.effect === 'business_development');
  if (businessDev) {
    const turnMod = G.turn % 3;
    if (turnMod === 1) { 
      player.capital = Math.min(10, player.capital + 1);
      if(G.gameLog) G.gameLog.push('Business Development provided +1 Capital.');
    } else if (turnMod === 2) {
      drawCard(player);
      if(G.gameLog) G.gameLog.push('Business Development provided +1 Card.');
    } else { 
      player.revenue += 25000;
      if(G.gameLog) G.gameLog.push('Business Development provided +$25k Revenue.');
    }
  }

  // Incubator Resources - choose capital or card draw at start of turn
  const incubatorResources = player.board.Tools.find(t => t.effect === 'incubator_resources');
  if (incubatorResources) {
    addPendingChoice(player, {
      type: 'choose_option',
      effect: 'incubator_resources_choice',
      options: ['Gain 1 Capital', 'Draw 1 Card'],
      sourceCard: { ...incubatorResources } as Card 
    });
    // The choice will be presented to the player via the UI
  }
} 
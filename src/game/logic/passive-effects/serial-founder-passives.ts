import type { GameState } from '../../state';
import type { Card } from '../../types'; // Import Card type
import { drawCard } from '../utils/deck-helpers'; // Assuming drawCard is what's needed

export function handleSerialFounderChoicePassives(G: GameState, playerID: string): void {
  const player = G.players[playerID];

  // Growth Hacking - choose bonus each turn
  const growthHacking = player.board.Tools.find(t => t.effect === 'growth_hacking');
  if (growthHacking) {
    // Simple rotation: capital, cards, revenue
    const turnMod = G.turn % 3;
    if (turnMod === 0) {
      player.capital = Math.min(10, player.capital + 1);
    } else if (turnMod === 1) {
      drawCard(player);
    } else {
      player.revenue += 20000;
    }
  }
  
  // Business Development - choose different bonus each turn
  const businessDev = player.board.Employees.find(e => e.effect === 'business_development');
  if (businessDev) {
    // Similar rotation
    const turnMod = G.turn % 3;
    if (turnMod === 1) { // Offset rotation from Growth Hacking
      player.capital = Math.min(10, player.capital + 1);
    } else if (turnMod === 2) {
      drawCard(player);
    } else { // turnMod === 0
      player.revenue += 25000;
    }
  }

  // Incubator Resources - choose capital or card draw at start of turn
  const incubatorResources = player.board.Tools.find(t => t.effect === 'incubator_resources');
  if (incubatorResources && !player.pendingChoice) { // Ensure no other choice is active
    player.pendingChoice = {
      type: 'choose_option',
      effect: 'incubator_resources_choice',
      options: ['Gain 1 Capital', 'Draw 1 Card'],
      sourceCard: { ...incubatorResources } as Card // Pass a copy of the source card
    };
  }
} 
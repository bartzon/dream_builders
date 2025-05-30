import type { GameState } from '../../state';
import { drawCard } from '../utils/deck-helpers';

export function handleCommunityLeaderPassives(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  const ctx = G.effectContext?.[playerID];
  
  // Hype Train effect - If you played 2+ cards last turn, gain 1 capital
  const hypeTrain = player.board.Tools.find(t => t.effect === 'hype_train');
  if (hypeTrain && ctx && ctx.cardsPlayedLastTurn && ctx.cardsPlayedLastTurn >= 2) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Mentorship Circle effect - Draw an extra card at the start of your turn
  const mentorshipCircle = player.board.Tools.find(t => t.effect === 'mentorship_circle');
  if (mentorshipCircle) {
    drawCard(player);
  }
  
  // Steady Fans effect - Gain 1 capital every other turn
  const steadyFans = player.board.Tools.find(t => t.effect === 'steady_fans');
  if (steadyFans) {
    // Use the game's turn counter - gain capital on even turns
    if (G.turn % 2 === 0) {
      player.capital = Math.min(10, player.capital + 1);
    }
  }
} 
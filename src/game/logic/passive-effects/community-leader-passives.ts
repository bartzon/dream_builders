import type { GameState } from '../../state';
import { drawCard } from '../utils/deck-helpers';
import { gainCapital } from '../utils/effect-helpers';

export function handleCommunityLeaderPassives(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  const ctx = G.effectContext?.[playerID];
  
  // Hype Train effect - If you played 2+ cards last turn, gain 1 capital
  const hypeTrain = player.board.Tools.find(t => t.effect === 'hype_train');
  if (hypeTrain && ctx && ctx.cardsPlayedLastTurn && ctx.cardsPlayedLastTurn >= 2) {
    gainCapital(G, playerID, 1);
    
    if (G.gameLog) {
      G.gameLog.push('Hype Train: Gained 1 capital for playing 2+ cards last turn.');
    }
  }
  
  // Mentorship Circle effect - Draw an extra card at the start of your turn
  const mentorshipCircle = player.board.Tools.find(t => t.effect === 'mentorship_circle');
  if (mentorshipCircle) {
    drawCard(player, 'Mentorship Circle', G.gameLog);
  }
  
  // Steady Fans effect - Gain 1 capital every other turn
  const steadyFans = player.board.Tools.find(t => t.effect === 'steady_fans');
  if (steadyFans) {
    // Check if it's an even or odd turn based on the global turn counter
    const globalTurn = G.turn || 1;
    
    if (globalTurn % 2 === 0) {
      gainCapital(G, playerID, 1);
      
      if (G.gameLog) {
        G.gameLog.push('Steady Fans: Gained 1 capital (every other turn).');
      }
    }
  }
} 
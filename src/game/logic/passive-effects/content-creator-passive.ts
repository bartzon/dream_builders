import type { GameState } from '../../state';

export function handleContentCreator(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  const contentCreator = player.board.Employees.find(e => e.effect === 'content_creator');
  if (contentCreator && G.effectContext?.[playerID]) {
    // This would need to track from previous turn in a full implementation
    // For now, just check if they have many cards in hand (active player)
    // This is a simplification and might need to be revisited for accurate 'last turn' logic.
    if (player.hand.length >= 5) { 
      player.revenue += 50000;
    }
  }
} 
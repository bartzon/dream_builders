import type { GameState } from '../../state';

export function handleCommunityManager(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  const communityManager = player.board.Employees.find(e => e.effect === 'community_manager');
  if (communityManager) {
    player.board.Products.forEach(product => {
      if (product.appeal && product.appeal > 0) {
        const bonus = product.appeal * 5000; // This value might need to be a constant
        player.revenue += bonus;
      }
    });
  }
} 
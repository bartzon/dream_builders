import type { GameState } from '../../state';

export function handleFulfillmentAppIntegration(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  if (G.effectContext?.[playerID]?.delayedInventoryBoostTurns && G.effectContext[playerID].delayedInventoryBoostTurns > 0) {
    const activeProducts = player.board.Products.filter(p => p.isActive !== false && p.inventory !== undefined);
    if (activeProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeProducts.length);
      const randomProduct = activeProducts[randomIndex];
      if (randomProduct.inventory !== undefined) {
        randomProduct.inventory += 1;
        if (G.gameLog) {
          G.gameLog.push(`Fulfillment App Integration: Added +1 inventory to ${randomProduct.name}`);
        }
      }
    }
    G.effectContext[playerID].delayedInventoryBoostTurns--;
  }
} 
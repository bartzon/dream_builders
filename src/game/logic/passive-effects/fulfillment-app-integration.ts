import type { GameState } from '../../state';

export function handleFulfillmentAppIntegration(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  const effectCtx = G.effectContext?.[playerID];

  // console.log(`[Turn ${G.turn}] Checking Fulfillment App for player ${playerID}. Turns remaining: ${effectCtx?.delayedInventoryBoostTurns}`);

  if (effectCtx?.delayedInventoryBoostTurns && effectCtx.delayedInventoryBoostTurns > 0) {
    // console.log(`[Turn ${G.turn}] Fulfillment App is active for player ${playerID}.`);
    const activeProducts = player.board.Products.filter(p => p.isActive !== false && p.inventory !== undefined);
    // console.log(`[Turn ${G.turn}] Found ${activeProducts.length} active products for Fulfillment App for player ${playerID}.`);

    if (activeProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeProducts.length);
      const randomProduct = activeProducts[randomIndex];
      if (randomProduct.inventory !== undefined) {
        randomProduct.inventory += 1;
        // console.log(`[Turn ${G.turn}] Fulfillment App: Increased inventory of ${randomProduct.name} (ID: ${randomProduct.id}) to ${randomProduct.inventory} for player ${playerID}.`);
        
        if (!effectCtx.recentlyAffectedCardIds) {
          effectCtx.recentlyAffectedCardIds = [];
        }
        effectCtx.recentlyAffectedCardIds = [randomProduct.id]; 
        // console.log(`[Turn ${G.turn}] Fulfillment App: Set recentlyAffectedCardIds to [${randomProduct.id}] for player ${playerID}.`);

        if (G.gameLog) {
          G.gameLog.push(`Fulfillment App Integration: Added +1 inventory to ${randomProduct.name}.`);
        }
      }
    }
    effectCtx.delayedInventoryBoostTurns--;
    // console.log(`[Turn ${G.turn}] Fulfillment App: Decremented turns to ${effectCtx.delayedInventoryBoostTurns} for player ${playerID}.`);
  } else if (effectCtx?.delayedInventoryBoostTurns === 0) {
    // console.log(`[Turn ${G.turn}] Fulfillment App: Turns reached 0, effect ended for player ${playerID}.`);
  }
} 
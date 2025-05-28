import type { Game } from 'boardgame.io';
import type { GameState, PlayerState } from './state';
import { 
  drawCard, 
  checkGameEnd,
  initializePlayer 
} from './logic';
import { allHeroes, type Hero } from './data/heroes';
import type { Card } from './types';
import { 
  cardEffects,
  sellProduct,
  heroAbilityEffects,
  processPassiveEffects,
  processOverheadCosts,
  processAutomaticSales,
  processRecurringRevenue,
  clearTempEffects,
  getCardDiscount,
  handleCardPlayEffects,
  initEffectContext
} from './logic/index';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GAME_CONFIG } from './constants';

// Helper function to create a 30-card deck from a 10-card starter deck
function createFullDeck(starterDeck: Card[]): Card[] {
  const fullDeck: Card[] = [];
  const maxCopiesPerCard = 4;
  const targetDeckSize = 30;
  
  // First, add 3 copies of each card (10 * 3 = 30)
  for (const card of starterDeck) {
    for (let i = 0; i < 3; i++) {
      fullDeck.push({
        ...card,
        keywords: card.keywords || [],
      });
    }
  }
  
  // If we need more cards to reach 30, add additional copies
  // (This logic is here for flexibility if we change the numbers later)
  while (fullDeck.length < targetDeckSize) {
    for (const card of starterDeck) {
      if (fullDeck.length >= targetDeckSize) break;
      
      // Count how many copies of this card we already have
      const copiesInDeck = fullDeck.filter(c => c.id === card.id).length;
      
      if (copiesInDeck < maxCopiesPerCard) {
        fullDeck.push({
          ...card,
          keywords: card.keywords || [],
        });
      }
    }
  }
  
  return fullDeck;
}

export const DreamBuildersGame: Game<GameState> = {
  name: 'dream-builders',
  
  setup: ({ ctx }) => {
    const players: Record<string, PlayerState> = {};
    
    // Initialize each player with a hero
    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerID = i.toString();
      const hero = allHeroes[i % allHeroes.length];
      
      // Create a 30-card deck from the hero's 10-card starter deck
      const fullDeck = createFullDeck(hero.starterDeck);
      
      // Capitalize hero ID for state compatibility
      const heroName = hero.id.charAt(0).toUpperCase() + hero.id.slice(1) as PlayerState['hero'];
      players[playerID] = initializePlayer(heroName, fullDeck);
      
      console.log(`Setup - Player ${playerID} (${heroName}): Starting capital = ${players[playerID].capital}`);
    }
    
    return {
      players,
      currentPlayer: '0',
      turn: 1,
      teamRevenue: 0,
      teamExpenses: 0,
      marketPressure: 0,
      gameOver: false,
      winner: false,
      effectContext: {},
    };
  },
  
  turn: {
    onBegin: ({ G, ctx }) => {
      const playerID = ctx.currentPlayer;
      const player = G.players[playerID];
      
      // Initialize effect context for this player if needed
      if (!G.effectContext) G.effectContext = {};
      if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
      
      // 1. Set Capital based on turn number (max 10)
      const oldCapital = player.capital;
      const baseCapital = Math.min(GAME_CONFIG.MAX_CAPITAL, G.turn);
      const newCapital = G.effectContext[playerID].doubleCapitalGain ? Math.min(GAME_CONFIG.MAX_CAPITAL, baseCapital * 2) : baseCapital;
      player.capital = newCapital;
      
      console.log(`Turn ${G.turn} - Player ${playerID}: Capital ${oldCapital} → ${player.capital} (turn-based)`);
      
      // 2. Process overhead costs (must pay or disable products)
      processOverheadCosts(G, playerID);
      
      // 3. Draw card(s)
      for (let i = 0; i < GAME_CONFIG.CARDS_DRAWN_PER_TURN; i++) {
        drawCard(player);
      }
      
      // 4. Process passive effects (additional capital, card draw, inventory increases)
      processPassiveEffects(G, playerID);
      
      // Reset hero ability usage
      player.heroAbilityUsed = false;
    },
    
    onEnd: ({ G, ctx }) => {
      const playerID = ctx.currentPlayer;
      
      // Process automatic sales
      processAutomaticSales(G, playerID);
      
      // Process recurring revenue (legacy)
      processRecurringRevenue(G, playerID);
      
      // Clear temporary effects
      clearTempEffects(G, playerID);
      
      // Check for game end
      checkGameEnd(G);
      
      // Advance turn counter when all players have played
      if (ctx.playOrderPos === ctx.numPlayers - 1) {
        G.turn++;
      }
    },
  },
  
  moves: {
    playCard: ({ G, ctx, playerID }, cardIndex: number) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      if (cardIndex < 0 || cardIndex >= player.hand.length) return INVALID_MOVE;
      
      const card = player.hand[cardIndex];
      
      // Check for special play restrictions
      if (card.effect === 'global_launch_event') {
        // Can only be played if two actions played this turn
        const actionsPlayed = G.effectContext?.[playerID]?.playedActionsThisTurn || 0;
        if (actionsPlayed < 2) return INVALID_MOVE;
      }
      
      // Check if player can play actions
      if (card.type === 'Action') {
        const extraActions = G.effectContext?.[playerID]?.extraActionPlays || 0;
        const actionsPlayed = G.effectContext?.[playerID]?.playedActionsThisTurn || 0;
        if (actionsPlayed >= 1 && extraActions <= 0) return INVALID_MOVE;
      }
      
      // Apply cost reduction
      const discount = getCardDiscount(G, playerID, card);
      const finalCost = Math.max(0, card.cost - discount);
      
      // Check if player can afford the card
      if (player.capital < finalCost) return INVALID_MOVE;
      
      // Check if player has extra card plays available
      const hasExtraPlays = G.effectContext?.[playerID]?.extraCardPlays && 
                           G.effectContext[playerID].extraCardPlays > 0;
      
      // Pay cost
      player.capital -= finalCost;
      
      // Remove from hand
      player.hand.splice(cardIndex, 1);
      
      // Handle card play effects
      handleCardPlayEffects(G, playerID, card);
      
      // Play the card based on type
      if (card.type === 'Action') {
        // Execute immediate effect
        if (card.effect && cardEffects[card.effect]) {
          cardEffects[card.effect](G, playerID, card);
        }
        
        // Use up extra action play if applicable
        if (G.effectContext?.[playerID] && G.effectContext[playerID].extraActionPlays) {
          G.effectContext[playerID].extraActionPlays = Math.max(0, G.effectContext[playerID].extraActionPlays - 1);
        }
      } else {
        // Add to appropriate board zone
        const boardZone = `${card.type}s` as keyof typeof player.board;
        if (player.board[boardZone]) {
          (player.board[boardZone] as Card[]).push(card);
        }
        
        // Execute any immediate effects
        if (card.effect && cardEffects[card.effect]) {
          cardEffects[card.effect](G, playerID, card);
        }
      }
      
      // Use up an extra card play if applicable
      if (hasExtraPlays && G.effectContext?.[playerID]) {
        G.effectContext[playerID].extraCardPlays = (G.effectContext[playerID].extraCardPlays || 0) - 1;
      }
    },
    
    sellProduct: ({ G, ctx, playerID }, productId: string) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      
      // Find the product on the board
      const productIndex = player.board.Products.findIndex(p => p.id === productId);
      if (productIndex === -1) return INVALID_MOVE;
      
      const product = player.board.Products[productIndex];
      
      // Check if product can be sold
      if (!product.inventory || product.inventory <= 0) return INVALID_MOVE;
      if (product.isActive === false) return INVALID_MOVE;
      
      // Sell the product
      sellProduct(G, playerID, product, 1);
      
      // Track items sold this turn
      if (G.effectContext?.[playerID]) {
        G.effectContext[playerID].itemsSoldThisTurn = 
          (G.effectContext[playerID].itemsSoldThisTurn || 0) + 1;
      }
      
      // Apply Disruptive Pivot effect if active
      if (G.effectContext?.[playerID]?.doubleRevenueThisTurn) {
        const lastRevenue = product.revenuePerSale || 0;
        player.revenue += lastRevenue;
        G.teamRevenue += lastRevenue;
      }
    },
    
    useHeroAbility: ({ G, ctx, playerID }) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      
      if (player.heroAbilityUsed) return INVALID_MOVE;
      
      // Find the hero with proper type
      const hero = allHeroes.find(h => h.id === player.hero.toLowerCase()) as Hero | undefined;
      if (!hero) return INVALID_MOVE;
      
      // Check cost using hero power
      if (player.capital < hero.heroPower.cost) return INVALID_MOVE;
      
      // Pay cost
      player.capital -= hero.heroPower.cost;
      player.heroAbilityUsed = true;
      
      // Execute hero power effect
      const effectName = hero.heroPower.effect;
      if (effectName && heroAbilityEffects[effectName]) {
        heroAbilityEffects[effectName](G, playerID);
      }
    },
  },
  
  endIf: ({ G }) => {
    if (G.gameOver) {
      return { winner: G.winner ? 'team' : 'defeat' };
    }
  },
  
  minPlayers: 1,
  maxPlayers: 4,
}; 
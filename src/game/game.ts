import type { Game } from 'boardgame.io';
import type { GameState, PlayerState } from './state';
import { allHeroes, type Hero } from './data/heroes';
import { sharedProductPool } from './data/shared-products';
import type { Card } from './types';
import { 
  cardEffects,
  heroAbilityEffects,
  processPassiveEffects,
  processOverheadCosts,
  processAutomaticSales,
  processRecurringRevenue,
  getCardDiscount,
  getCardCostInfo,
  handleCardPlayEffects,
  initEffectContext,
  clearTempEffects,
  drawCard,
  initializePlayer,
  checkGameEnd
} from './logic/index';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GAME_CONFIG } from './constants';

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to select random cards from an array
function selectRandomCards<T>(cards: T[], count: number): T[] {
  const shuffled = shuffleArray(cards);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// New drafting function that creates a 30-card deck
function createDraftedDeck(heroStarterDeck: Card[]): Card[] {
  // Get 15 random cards from hero's unique deck (now all non-Product cards)
  const heroCards = selectRandomCards(heroStarterDeck, 15);
  
  // Get 15 random cards from shared product pool
  const productCards = selectRandomCards(sharedProductPool, 15);
  
  // Combine and shuffle
  const combinedDeck = [...heroCards, ...productCards];
  return shuffleArray(combinedDeck);
}

export const DreamBuildersGame: Game<GameState> = {
  name: 'dream-builders',
  
  setup: ({ ctx }) => {
    const players: Record<string, PlayerState> = {};
    
    // Get selected hero from localStorage
    const selectedHeroId = typeof window !== 'undefined' ? localStorage.getItem('selectedHero') : null;
    
    // Initialize each player with a hero
    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerID = i.toString();
      let hero;
      
      if (ctx.numPlayers === 1 && selectedHeroId) {
        // Use selected hero for single player
        hero = allHeroes.find(h => h.id === selectedHeroId) || allHeroes[0];
      } else {
        // Default behavior for multiplayer
        hero = allHeroes[i % allHeroes.length];
      }
      
      // Create a 30-card deck from the hero's 10-card starter deck
      const fullDeck = createDraftedDeck(hero.starterDeck);
      
      // Use the hero ID directly (no capitalization needed)
      players[playerID] = initializePlayer(hero.id as PlayerState['hero'], fullDeck);
      
      // Set initial capital to turn 1 value
      players[playerID].capital = 1;
    }

    return {
      players,
      currentPlayer: '0',
      turn: 1,
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
      
      // 1. Automatic sales phase - SELL ALL PRODUCTS AUTOMATICALLY
      processAutomaticSales(G, playerID);
      
      // 2. Capital gain phase
      const baseCapital = Math.min(G.turn, GAME_CONFIG.MAX_CAPITAL);
      
      // Apply any capital modifications from effect context
      const newCapital = G.effectContext[playerID].doubleCapitalGain ? Math.min(GAME_CONFIG.MAX_CAPITAL, baseCapital * 2) : baseCapital;
      player.capital = newCapital;
      
      // 3. Process overhead costs (must pay or disable products)
      processOverheadCosts(G, playerID);
      
      // 4. Draw card(s)
      for (let i = 0; i < GAME_CONFIG.CARDS_DRAWN_PER_TURN; i++) {
        drawCard(player);
      }
      
      // 5. Process passive effects (additional capital, card draw, inventory increases)
      processPassiveEffects(G, playerID);
      
      // Reset hero ability usage
      player.heroAbilityUsed = false;
    },
    
    onEnd: ({ G, ctx }) => {
      const playerID = ctx.currentPlayer;
      
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
      
      if (card.effect === 'quick_learner') {
        // Can only be played if an Action was played this turn
        const lastActionEffect = G.effectContext?.[playerID]?.lastActionEffect;
        const lastActionCard = G.effectContext?.[playerID]?.lastActionCard;
        if (!lastActionEffect || !lastActionCard || lastActionCard.type !== 'Action') {
          return INVALID_MOVE;
        }
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
        // Track this Action for Quick Learner
        if (G.effectContext?.[playerID]) {
          G.effectContext[playerID].lastActionEffect = card.effect;
          G.effectContext[playerID].lastActionCard = { ...card }; // Store a copy
        }
        
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
          console.log(`Adding ${card.type} to board:`, { id: card.id, name: card.name, inventory: card.inventory });
          (player.board[boardZone] as Card[]).push(card);
          console.log(`Board now has ${(player.board[boardZone] as Card[]).length} ${card.type}s`);
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
    
    useHeroAbility: ({ G, ctx, playerID }) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      
      if (player.heroAbilityUsed) return INVALID_MOVE;
      
      // Find the hero - player.hero is now the direct hero ID
      const hero = allHeroes.find(h => h.id === player.hero) as Hero | undefined;
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

    makeChoice: ({ G, ctx, playerID }, choiceIndex: number) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      
      // Check if there's a pending choice
      if (!player.pendingChoice) return INVALID_MOVE;
      
      const choice = player.pendingChoice;
      
      // Handle different choice types
      if (choice.type === 'discard') {
        // Validate choice index
        if (choiceIndex < 0 || choiceIndex >= player.hand.length) return INVALID_MOVE;
        
        // Remove the chosen card from hand
        player.hand.splice(choiceIndex, 1);
        
        // Clear the pending choice
        player.pendingChoice = undefined;
      }
      
      // Add more choice types here as needed
    },

    triggerMidnightOilDiscard: ({ G, ctx, playerID }) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      
      // Check if midnight oil discard is pending
      if (!G.effectContext?.[playerID]?.midnightOilDiscardPending) return INVALID_MOVE;
      
      // Create the discard choice
      if (player.hand.length > 0) {
        player.pendingChoice = {
          type: 'discard',
          effect: 'midnight_oil',
        };
        
        // Clear the pending flag
        if (G.effectContext?.[playerID]) {
          G.effectContext[playerID].midnightOilDiscardPending = false;
        }
      }
    },
  },
  
  endIf: ({ G }) => {
    if (G.gameOver) {
      return { winner: G.winner ? 'victory' : 'defeat' };
    }
  },
  
  minPlayers: 1,
  maxPlayers: 1,
}; 
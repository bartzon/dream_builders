import type { Game } from 'boardgame.io';
import type { GameState, PlayerState } from './state';
import { allHeroes, type Hero } from './data/heroes';
import { sharedProductPool } from './data/shared-products';
import { inventorySupportCards } from './data/inventory-support-cards';
import type { Card } from './types';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GAME_CONFIG } from './constants';

// Logic Imports from their respective files
import { cardEffects, resolveFastPivotEffect } from './logic/cardEffects';
import { heroAbilityEffects } from './logic/heroAbilities';
import {
  processPassiveEffects,
  processOverheadCosts,
  processAutomaticSales,
  processRecurringRevenue,
  getCardDiscount,
} from './logic/turnEffects';
import { initEffectContext, clearTempEffects } from './logic/effectContext';
import { drawCard, initializePlayer, checkGameEnd, handleCardPlayEffects } from './logic/index'; // Assuming index.ts exports these

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

// New drafting function that creates a 40-card deck
function createDraftedDeck(heroStarterDeck: Card[]): Card[] {
  // GUARANTEED CARDS (20 total - 50% of deck):
  // 1. All 10 unique hero cards (no duplicates)
  const heroCards = [...heroStarterDeck];
  
  // 2. 10 additional hero cards (allows for duplicates of key cards)
  const additionalHeroCards = selectRandomCards(heroStarterDeck, 10);
  
  // INVENTORY SUPPORT (7 cards - 17.5% of deck):
  // 3. 7 random inventory support cards
  const inventoryCards = selectRandomCards(inventorySupportCards, 7);
  
  // PRODUCTS (13 cards - 32.5% of deck):
  // 4. 13 random products from shared pool
  const productCards = selectRandomCards(sharedProductPool, 13);
  
  // Combine all cards and shuffle
  const combinedDeck = [
    ...heroCards,           // 10 cards - hero identity (guaranteed uniques)
    ...additionalHeroCards, // 10 cards - hero synergy reinforcement
    ...inventoryCards,      // 7 cards - inventory management
    ...productCards         // 13 cards - revenue generation
  ];
  
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
      
      // Create a 40-card deck from the hero's 10-card starter deck
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
      gameLog: [],
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

    triggerFastPivotDestroyChoice: ({ G, ctx, playerID }) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      const player = G.players[playerID];

      if (!G.effectContext?.[playerID]?.fastPivotProductDestroyPending) return INVALID_MOVE;

      const productsOnBoard = player.board.Products.filter(p => p.isActive !== false);

      if (productsOnBoard.length > 0) {
        player.pendingChoice = {
          type: 'destroy_product',
          effect: 'fast_pivot',
          cards: productsOnBoard.map(p => ({ ...p })), 
        };
        if (G.effectContext?.[playerID]) {
          G.effectContext[playerID].fastPivotProductDestroyPending = false;
        }
      } else {
        if (G.effectContext?.[playerID]) {
          G.effectContext[playerID].fastPivotProductDestroyPending = false;
        }
      }
    },

    makeChoice: ({ G, ctx, playerID }, choiceIndex: number) => {
      if (playerID !== ctx.currentPlayer) return INVALID_MOVE;
      
      const player = G.players[playerID];
      
      if (!player.pendingChoice) return INVALID_MOVE;
      
      const choice = player.pendingChoice;
      
      if (choice.type === 'discard') {
        if (choiceIndex < 0 || choiceIndex >= player.hand.length) return INVALID_MOVE;
        player.hand.splice(choiceIndex, 1);
        player.pendingChoice = undefined;
        if (G.gameLog) {
          G.gameLog.push(`Player ${playerID} discarded a card.`);
        }
      } else if (choice.type === 'destroy_product' && choice.effect === 'fast_pivot') {
        if (!choice.cards || choiceIndex < 0 || choiceIndex >= choice.cards.length) return INVALID_MOVE;
        const productToDestroyId = choice.cards[choiceIndex].id;
        resolveFastPivotEffect(G, playerID, productToDestroyId);
        player.pendingChoice = undefined;
        if (G.gameLog) {
          G.gameLog.push(`Player ${playerID} used Fast Pivot to destroy ${choice.cards[choiceIndex].name}, draw 2 cards, and discount next Product.`);
        }
      }
      // Add more choice types here as needed
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
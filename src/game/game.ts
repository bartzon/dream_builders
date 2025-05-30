import type { Game } from 'boardgame.io';
import type { GameState, PlayerState } from './state';
import { allHeroes, type Hero } from './data/heroes';
import { sharedProductPool } from './data/shared-products';
import { inventorySupportCards } from './data/inventory-support-cards';
import type { Card } from './types';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GAME_CONFIG } from './constants';

// Logic Imports from their respective files - now mostly via index.ts or specific utils
import {
  cardEffects,
  resolveFastPivotEffect,
  heroAbilityEffects,
  processPassiveEffects,
  processOverheadCosts,
  processAutomaticSales,
  getCardDiscount,
  initEffectContext,
  clearTempEffects,
  handleCardPlayEffects,
  // Utilities that were in main utils.ts, now re-exported from index or direct from new paths
  drawCard, 
  initializePlayer, 
  checkGameEnd,
  sellProduct // Specifically import sellProduct if needed directly, though often used via other effects
} from './logic/index';

// Helper function to shuffle an array (remains local or could be a general game util)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to select random cards from an array (remains local or could be a general game util)
function selectRandomCards<T>(cards: T[], count: number): T[] {
  const shuffled = shuffleArray(cards);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// New drafting function that creates a 40-card deck
function createDraftedDeck(heroStarterDeck: Card[]): Card[] {
  const heroCards = [...heroStarterDeck];
  const additionalHeroCards = selectRandomCards(heroStarterDeck, 10);
  const inventoryCards = selectRandomCards(inventorySupportCards, 7);
  const productCards = selectRandomCards(sharedProductPool, 13);
  const combinedDeck = [
    ...heroCards,          
    ...additionalHeroCards, 
    ...inventoryCards,     
    ...productCards         
  ];
  return shuffleArray(combinedDeck);
}

export const DreamBuildersGame: Game<GameState> = {
  name: 'dream-builders',
  setup: ({ ctx }) => {
    const players: Record<string, PlayerState> = {};
    const selectedHeroId = typeof window !== 'undefined' ? localStorage.getItem('selectedHero') : null;
    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerID = i.toString();
      const hero = (ctx.numPlayers === 1 && selectedHeroId) 
        ? allHeroes.find(h => h.id === selectedHeroId) || allHeroes[0]
        : allHeroes[i % allHeroes.length];
      const fullDeck = createDraftedDeck(hero.starterDeck);
      players[playerID] = initializePlayer(hero.id as PlayerState['hero'], fullDeck);
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
      if (!G.effectContext) G.effectContext = {};
      if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
      processAutomaticSales(G, playerID);
      const baseCapital = Math.min(G.turn, GAME_CONFIG.MAX_CAPITAL);
      player.capital = G.effectContext[playerID].doubleCapitalGain ? Math.min(GAME_CONFIG.MAX_CAPITAL, baseCapital * 2) : baseCapital;
      processOverheadCosts(G, playerID);
      for (let i = 0; i < GAME_CONFIG.CARDS_DRAWN_PER_TURN; i++) {
        drawCard(player); // Uses imported drawCard
      }
      processPassiveEffects(G, playerID);
      player.heroAbilityUsed = false;
    },
    onEnd: ({ G, ctx }) => {
      const playerID = ctx.currentPlayer;
      
      clearTempEffects(G, playerID);
      checkGameEnd(G);
      
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
          G.effectContext[playerID].lastActionCard = { ...card }; 
        }
        // Execute immediate effect
        if (card.effect && cardEffects[card.effect]) {
          cardEffects[card.effect](G, playerID, card);
        }
        // Use up extra action play if applicable
        if (G.effectContext?.[playerID] && G.effectContext[playerID].extraActionPlays) {
          G.effectContext[playerID].extraActionPlays = Math.max(0, G.effectContext[playerID].extraActionPlays - 1);
        }
      } else if (card.effect === 'quick_learner') {
        // Quick Learner is an Employee but its effect triggers on play like an Action
        const lastActionEffect = G.effectContext?.[playerID]?.lastActionEffect;
        const lastActionCard = G.effectContext?.[playerID]?.lastActionCard;

        if (lastActionEffect && lastActionCard && cardEffects[lastActionEffect]) {
          if (G.gameLog) G.gameLog.push(`Quick Learner copies ${lastActionCard.name}!`);
          cardEffects[lastActionEffect](G, playerID, lastActionCard); // Execute the *last Action's* effect
        } else {
          // Should not happen if play restriction is working, but as a fallback:
          if (G.gameLog) G.gameLog.push(`Quick Learner found no Action to copy.`);
        }
        // Add Quick Learner to board (as it's an Employee)
        const boardZone = `${card.type}s` as keyof typeof player.board;
        if (player.board[boardZone]) {
          (player.board[boardZone] as Card[]).push(card);
        }
      } else { // For Tools, Products, other Employees
        // Add to appropriate board zone
        const boardZone = `${card.type}s` as keyof typeof player.board;
        if (player.board[boardZone]) {
          console.log(`Adding ${card.type} to board:`, { id: card.id, name: card.name, inventory: card.inventory });
          (player.board[boardZone] as Card[]).push(card);
          console.log(`Board now has ${(player.board[boardZone] as Card[]).length} ${card.type}s`);
        }
        // Execute any immediate on-play effects for these card types (if any)
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
      } else if (choice.type === 'choose_card') {
        if (!choice.cards || choiceIndex < 0 || choiceIndex >= choice.cards.length) return INVALID_MOVE;
        const chosenCard = choice.cards[choiceIndex];
        const boardProduct = player.board.Products.find(p => p.id === chosenCard.id);
        
        if (!boardProduct) return INVALID_MOVE;
        
        // Handle different inventory-related effects
        switch (choice.effect) {
          case 'add_inventory_to_product':
            if (boardProduct.inventory !== undefined) {
              boardProduct.inventory += 2;
            }
            break;
            
          case 'add_inventory_if_empty':
            if (boardProduct.inventory === 0) {
              boardProduct.inventory = 3;
            }
            break;
            
          case 'multi_product_inventory_boost':
            // For Warehouse Expansion - allows up to 3 selections
            if (boardProduct.inventory !== undefined) {
              boardProduct.inventory += 1;
              
              // Track how many we've selected
              if (G.effectContext?.[playerID]) {
                G.effectContext[playerID].warehouseExpansionCount = 
                  (G.effectContext[playerID].warehouseExpansionCount || 0) + 1;
                
                const selectedCount = G.effectContext[playerID].warehouseExpansionCount || 0;
                
                // If we haven't selected 3 yet and there are more products to choose
                if (selectedCount < 3) {
                  const remainingProducts = player.board.Products.filter(p => 
                    p.isActive !== false && 
                    p.id !== boardProduct.id // Exclude the one we just selected
                  );
                  
                  if (remainingProducts.length > 0) {
                    // Create another choice for the remaining selections
                    player.pendingChoice = {
                      type: 'choose_card',
                      effect: 'multi_product_inventory_boost',
                      cards: remainingProducts.map(p => ({ ...p })),
                    };
                    
                    if (G.gameLog) {
                      G.gameLog.push(`Warehouse Expansion: Selected ${boardProduct.name} (${selectedCount}/3). Choose another product or End Turn to finish.`);
                    }
                    return; // Don't clear pendingChoice yet
                  }
                }
                
                // Clear the counter when done
                G.effectContext[playerID].warehouseExpansionCount = 0;
              }
            }
            break;
            
          case 'inventory_and_sale_boost':
            if (boardProduct.inventory !== undefined) {
              boardProduct.inventory += 1;
              // Immediately sell 1 if possible
              if (boardProduct.inventory > 0) {
                sellProduct(G, playerID, boardProduct, 1);
              }
            }
            break;
            
          case 'inventory_boost_plus_revenue':
            if (boardProduct.inventory !== undefined) {
              boardProduct.inventory += 2;
              // Mark this product for revenue boost
              if (!G.effectContext?.[playerID]) break;
              const ctx = G.effectContext[playerID];
              if (!ctx.productRevenueBoosts) {
                ctx.productRevenueBoosts = {};
              }
              ctx.productRevenueBoosts[boardProduct.id] = 1000;
            }
            break;
            
          case 'draw_and_inventory':
          case 'simple_inventory_boost':
            if (boardProduct.inventory !== undefined) {
              boardProduct.inventory += 1;
            }
            break;
        }
        
        player.pendingChoice = undefined;
        if (G.gameLog) {
          G.gameLog.push(`Player ${playerID} chose ${chosenCard.name} for ${choice.effect}.`);
        }
      } else if (choice.type === 'choose_from_drawn_to_discard' && choice.effect === 'ab_test_discard') {
        if (!choice.cards || choiceIndex < 0 || choiceIndex >= choice.cards.length) {
          // Invalid choice index or no cards presented for choice (shouldn't happen if effect sets up correctly)
          return INVALID_MOVE;
        }
        const cardToDiscard = choice.cards[choiceIndex];
        
        // Find and remove the actual card from hand by its ID
        const handCardIndex = player.hand.findIndex(c => c.id === cardToDiscard.id);
        if (handCardIndex !== -1) {
          player.hand.splice(handCardIndex, 1);
          if (G.gameLog) {
            G.gameLog.push(`A/B Test: Player ${playerID} discarded ${cardToDiscard.name}.`);
          }
        } else {
          // This case should ideally not be reached if drawnCards were correctly identified
          if (G.gameLog) {
            G.gameLog.push(`A/B Test: Error - card to discard not found in hand.`);
          }
          // Potentially return INVALID_MOVE or handle error, but for now, just log and clear choice
        }
        player.pendingChoice = undefined;
      } else if (choice.type === 'view_deck_and_discard' && choice.effect === 'analytics_dashboard_discard') {
        if (!choice.cards || !choice.count) return INVALID_MOVE; // Should have cards and count from effect

        // choiceIndex: 0 to discard choice.cards[0], 1 to discard choice.cards[1]
        // -1 (or choice.cards.length) can signify "discard none"
        if (choiceIndex >= 0 && choiceIndex < choice.count) {
          const cardToDiscardFromDeck = choice.cards[choiceIndex]; // This is a copy
          
          // Find the actual card on top of the deck. 
          // choice.cards are reversed: choice.cards[0] is player.deck[player.deck.length - 1]
          // choice.cards[1] (if exists) is player.deck[player.deck.length - 2]
          let deckCardIndexToRemove = -1;
          if (choice.count === 1 && choiceIndex === 0 && player.deck.length > 0 && player.deck[player.deck.length - 1].id === cardToDiscardFromDeck.id) {
            deckCardIndexToRemove = player.deck.length - 1;
          } else if (choice.count === 2) {
            if (choiceIndex === 0 && player.deck.length > 0 && player.deck[player.deck.length - 1].id === cardToDiscardFromDeck.id) {
              deckCardIndexToRemove = player.deck.length - 1;
            } else if (choiceIndex === 1 && player.deck.length > 1 && player.deck[player.deck.length - 2].id === cardToDiscardFromDeck.id) {
              deckCardIndexToRemove = player.deck.length - 2;
            }
          }

          if (deckCardIndexToRemove !== -1) {
            const discardedCard = player.deck.splice(deckCardIndexToRemove, 1)[0];
            if (G.gameLog) {
              G.gameLog.push(`Analytics Dashboard: Player ${playerID} discarded ${discardedCard.name} from top of deck.`);
            }
            // If one card was discarded, the other (if presented) remains on top.
          } else {
            // Card ID mismatch or invalid index, should not happen if UI presents choices correctly based on pendingChoice.cards
            if (G.gameLog) {
              G.gameLog.push(`Analytics Dashboard: Error - card to discard from deck not found or mismatch.`);
            }
          }
        } else {
          // Player chose not to discard (e.g., choiceIndex === -1 or choice.cards.length)
          if (G.gameLog) {
            G.gameLog.push(`Analytics Dashboard: Player ${playerID} viewed top cards, no discard.`);
          }
        }
        player.pendingChoice = undefined;
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
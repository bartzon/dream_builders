import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { soloHustlerCardEffects } from '../../../game/logic/effects/solo-hustler-effects'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'
import { testCardEffect, testHeroAbility } from '../../test-helpers'

// Import card definitions
import { soloHustlerDeck, soloHustlerHero } from '../../../game/data/heroes/solo-hustler'

// Helper to find card by effect name
function findCardByEffect(effectName: string) {
  return soloHustlerDeck.find(card => card.effect === effectName)
}

describe('Solo Hustler Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Hero Power: Grind', () => {
    it('should draw 1 card and reduce Product cost if drawn', () => {
      // Hero Power: Grind
      // Effect: "Draw 1 card. If it's a Product, reduce its cost by 1 this turn."
      testHeroAbility(soloHustlerHero.name, soloHustlerHero.heroPower, () => {
        // Add a product to the deck
        const product = new CardBuilder().withCost(3).asProduct()
        G = new GameStateBuilder()
          .withDeck(product)
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        heroAbilityEffects.solo_hustler_grind(G, playerID)
        
        // Should draw 1 card
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
        
        // If it's a product, should have discounted it
        const drawnCard = G.players[playerID].hand[G.players[playerID].hand.length - 1]
        if (drawnCard.type === 'Product') {
          expect(G.effectContext?.[playerID]?.soloHustlerDiscountedCard).toBe(drawnCard.id)
        }
      })
    })
  })

  describe('midnight_oil', () => {
    it('should draw 3 cards then set up discard', () => {
      const card = findCardByEffect('midnight_oil')!
      // Card: Midnight Oil - Cost: 2, Type: Action
      // Effect: "Draw 3 cards, then discard 1 card."
      testCardEffect(card.name, card, () => {
        // Add cards to deck for drawing
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction(),
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialDeckSize = G.players[playerID].deck.length
        
        soloHustlerCardEffects.midnight_oil(G, playerID)
        
        // Should draw 3 cards
        expect(G.players[playerID].hand.length).toBe(3)
        expect(G.players[playerID].deck.length).toBe(initialDeckSize - 3)
        expect(G.effectContext?.[playerID]?.midnightOilDiscardPending).toBe(true)
      })
    })
  })

  describe('hustle_hard', () => {
    it('should draw 2 cards and gain 1 capital', () => {
      const card = findCardByEffect('hustle_hard')!
      // Card: Hustle Hard - Cost: 2, Type: Action
      // Effect: "Draw 2 cards. Gain 1 capital."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .withCapital(5)
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        soloHustlerCardEffects.hustle_hard(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
        expect(G.players[playerID].capital).toBe(6)
      })
    })
  })

  describe('bootstrap_capital', () => {
    it('should gain 2 capital', () => {
      const card = findCardByEffect('bootstrap_capital')!
      // Card: Bootstrap Capital - Cost: 1, Type: Action
      // Effect: "Gain 2 capital."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withCapital(3)
          .build()
        
        soloHustlerCardEffects.bootstrap_capital(G, playerID)
        
        expect(G.players[playerID].capital).toBe(5)
      })
    })
  })

  describe('fast_pivot', () => {
    it('should set up product destruction choice', () => {
      const card = findCardByEffect('fast_pivot')!
      // Card: Fast Pivot - Cost: 0, Type: Action
      // Effect: "Destroy a Product you control. Draw 3 cards."
      testCardEffect(card.name, card, () => {
        const product = new CardBuilder().asProduct()
        
        G = new GameStateBuilder()
          .withProducts(product)
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        soloHustlerCardEffects.fast_pivot(G, playerID)
        
        expect(G.effectContext?.[playerID]?.fastPivotProductDestroyPending).toBe(true)
      })
    })
  })

  describe('diy_assembly', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('diy_assembly')!
      // Card: DIY Assembly - Cost: 2, Type: Tool
      // Effect: "Recurring: Reduce Product costs by 1."
      testCardEffect(card.name, card, () => {
        expect(soloHustlerCardEffects.diy_assembly).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // This is a passive effect handled in getCardDiscount
      })
    })
  })

  describe('freelancer_network', () => {
    it('should draw 2 cards when played', () => {
      const card = findCardByEffect('freelancer_network')!
      // Card: Freelancer Network - Cost: 2, Type: Employee
      // Effect: "When played, draw 2 cards."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        soloHustlerCardEffects.freelancer_network(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
      })
    })
  })

  describe('resourceful_solutions', () => {
    it('should reduce next card cost by 2', () => {
      const card = findCardByEffect('resourceful_solutions')!
      // Card: Resourceful Solutions - Cost: 1, Type: Action
      // Effect: "Next card costs 2 less."
      testCardEffect(card.name, card, () => {
        soloHustlerCardEffects.resourceful_solutions(G, playerID)
        
        expect(G.effectContext?.[playerID]?.nextCardDiscount).toBe(2)
      })
    })
  })

  describe('scrappy_marketing', () => {
    it('should draw based on product count', () => {
      const card = findCardByEffect('scrappy_marketing')!
      // Card: Scrappy Marketing - Cost: 1, Type: Action
      // Effect: "If you have a Product in play, draw 2 cards."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        // Test without product - should draw 0 cards
        soloHustlerCardEffects.scrappy_marketing(G, playerID)
        expect(G.players[playerID].hand.length).toBe(initialHandSize)
        
        // Test with product - should draw 2 cards
        G = new GameStateBuilder()
          .withProducts(new CardBuilder().asProduct())
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        soloHustlerCardEffects.scrappy_marketing(G, playerID)
        expect(G.players[playerID].hand.length).toBe(2)
      })
    })
  })

  describe('quick_learner', () => {
    it('should be handled as special case in playCard', () => {
      const card = findCardByEffect('quick_learner')!
      // Card: Quick Learner - Cost: 0, Type: Action
      // Effect: "Draw 2 cards. Can only be played if you played another Action this turn."
      testCardEffect(card.name, card, () => {
        expect(soloHustlerCardEffects.quick_learner).toBeDefined()
        // Special case: can only be played after an Action
      })
    })
  })

  describe('shoestring_budget', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('shoestring_budget')!
      // Card: Shoestring Budget - Cost: 1, Type: Tool
      // Effect: "Recurring: All cards cost 1 less for you this turn."
      testCardEffect(card.name, card, () => {
        expect(soloHustlerCardEffects.shoestring_budget).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // This is a passive effect handled in getCardDiscount
      })
    })
  })
}) 
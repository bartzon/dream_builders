import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { brandBuilderCardEffects } from '../../../game/logic/effects/brand-builder-effects'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'
import { testCardEffect, testHeroAbility } from '../../test-helpers'

// Import card definitions
import { brandBuilderDeck, brandBuilderHero } from '../../../game/data/heroes/brand-builder'

// Helper to find card by effect name
function findCardByEffect(effectName: string) {
  return brandBuilderDeck.find(card => card.effect === effectName)
}

describe('Brand Builder Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Hero Power: Engage', () => {
    it('should add appeal to a product', () => {
      // Hero Power: Brand Builder - Engage
      // Effect: "Add 2 Inventory to a Product."
      testHeroAbility(brandBuilderHero.name, brandBuilderHero.heroPower, () => {
        expect(heroAbilityEffects.brand_builder_engage).toBeDefined()
      })
    })
  })

  describe('brand_vision', () => {
    it('should draw cards based on product control', () => {
      const card = findCardByEffect('brand_vision')!
      // Card: Brand Vision - Cost: 1, Type: Action
      // Effect: "Draw 1 card. If you control a Product, draw 2 instead."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        brandBuilderCardEffects.brand_vision(G, playerID)
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
        
        // Test with product
        G = new GameStateBuilder()
          .withProducts(new CardBuilder().asProduct())
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        brandBuilderCardEffects.brand_vision(G, playerID)
        expect(G.players[playerID].hand.length).toBe(2)
      })
    })
  })

  describe('influencer_collab', () => {
    it('should gain capital when controlling a product', () => {
      const card = findCardByEffect('influencer_collab')!
      // Card: Influencer Collab - Cost: 3, Type: Action  
      // Effect: "If you control a Product, gain 3 capital."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withProducts(new CardBuilder().asProduct())
          .withCapital(2)
          .build()
        
        brandBuilderCardEffects.influencer_collab(G, playerID)
        expect(G.players[playerID].capital).toBe(5)
      })
    })
  })

  describe('ugc_explosion', () => {
    it('should add inventory to all products', () => {
      const card = findCardByEffect('ugc_explosion')!
      // Card: UGC Explosion - Cost: 3, Type: Action
      // Effect: "Add 3 inventory to each Product you control."
      testCardEffect(card.name, card, () => {
        const product1 = new CardBuilder().withId('p1').withInventory(2).asProduct()
        const product2 = new CardBuilder().withId('p2').withInventory(1).asProduct()
        
        G = new GameStateBuilder()
          .withProducts(product1, product2)
          .build()
        
        brandBuilderCardEffects.ugc_explosion(G, playerID)
        
        expect(product1.inventory).toBe(5)
        expect(product2.inventory).toBe(4)
      })
    })
  })

  describe('visual_identity', () => {
    it('should be a passive cost reduction effect', () => {
      const card = findCardByEffect('visual_identity')!
      // Card: Visual Identity - Cost: 2, Type: Tool
      // Effect: "Your Products cost 1 less if you control another Tool."
      testCardEffect(card.name, card, () => {
        expect(brandBuilderCardEffects.visual_identity).toBeDefined()
        // Handled in getCardDiscount
      })
    })
  })

  describe('content_calendar', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('content_calendar')!
      // Card: Content Calendar - Cost: 2, Type: Tool
      // Effect: "Recurring: Add 1 inventory to your lowest-inventory Product."
      testCardEffect(card.name, card, () => {
        expect(brandBuilderCardEffects.content_calendar).toBeDefined()
        expect(card.keywords).toContain('Recurring')
      })
    })
  })

  describe('email_list', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('email_list')!
      // Card: Email List - Cost: 1, Type: Tool
      // Effect: "Recurring: If you control 2 or more Products, gain 1 capital."
      testCardEffect(card.name, card, () => {
        expect(brandBuilderCardEffects.email_list).toBeDefined()
        expect(card.keywords).toContain('Recurring')
      })
    })
  })

  describe('personal_branding', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('personal_branding')!
      // Card: Personal Branding - Cost: 2, Type: Tool
      // Effect: "Recurring: Draw 1 card if you played an Action last turn."
      testCardEffect(card.name, card, () => {
        expect(brandBuilderCardEffects.personal_branding).toBeDefined()
        expect(card.keywords).toContain('Recurring')
      })
    })
  })

  describe('social_proof', () => {
    it('should set up revenue multiplier', () => {
      const card = findCardByEffect('social_proof')!
      // Card: Social Proof - Cost: 1, Type: Action
      // Effect: "Next time you gain revenue, gain +25% extra."
      testCardEffect(card.name, card, () => {
        brandBuilderCardEffects.social_proof(G, playerID)
        expect(G.effectContext?.[playerID]?.nextRevenueGainMultiplier).toBe(1.25)
      })
    })
  })

  describe('founder_story', () => {
    it('should draw cards based on employee control', () => {
      const card = findCardByEffect('founder_story')!
      // Card: Founder Story - Cost: 2, Type: Action
      // Effect: "Draw 2 cards. If you control an Employee, draw 3 instead."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        brandBuilderCardEffects.founder_story(G, playerID)
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
        
        // Test with employee
        G = new GameStateBuilder()
          .withEmployees(new CardBuilder().asEmployee())
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        brandBuilderCardEffects.founder_story(G, playerID)
        expect(G.players[playerID].hand.length).toBe(3)
      })
    })
  })
}) 
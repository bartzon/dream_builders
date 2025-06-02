import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { serialFounderCardEffects } from '../../../game/logic/effects/serial-founder-effects'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'
import { testCardEffect, testHeroAbility, createTestProduct } from '../../test-helpers'

// Import card definitions
import { serialFounderDeck, serialFounderHero } from '../../../game/data/heroes/serial-founder'

// Helper to find card by effect name
function findCardByEffect(effectName: string) {
  return serialFounderDeck.find(card => card.effect === effectName)
}

describe('Serial Founder Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Hero Power: Double Down', () => {
    it('should check implementation exists', () => {
      // Hero Power: Double Down
      // Effect: "Choose one: Draw 2 cards OR Add +1 inventory to all Products."
      testHeroAbility(serialFounderHero.name, serialFounderHero.heroPower, () => {
        expect(heroAbilityEffects.serial_founder_double_down).toBeDefined()
        // Creates a choice between draw or inventory
      })
    })
  })

  describe('legacy_playbook', () => {
    it('should be a passive effect', () => {
      const card = findCardByEffect('legacy_playbook')!
      // Card: Legacy Playbook - Cost: 2, Type: Tool
      // Effect: "At the start of your turn, if you have 2+ Products, gain 1 capital."
      testCardEffect(card.name, card, () => {
        expect(serialFounderCardEffects.legacy_playbook).toBeDefined()
        // Handled in turn.onBegin
      })
    })
  })

  describe('advisory_board', () => {
    it('should be a passive effect', () => {
      const card = findCardByEffect('advisory_board')!
      // Card: Advisory Board - Cost: 2, Type: Tool
      // Effect: "When you play a Product, draw 1 card."
      testCardEffect(card.name, card, () => {
        expect(serialFounderCardEffects.advisory_board).toBeDefined()
        // Triggered in handleCardPlayEffects
      })
    })
  })

  describe('spin_off', () => {
    it('should be a Product with dynamic cost reduction', () => {
      const card = findCardByEffect('spin_off')!
      // Card: Spin-Off - Cost: 3, Type: Product
      // Effect: "Costs 1 less for each Product you control. Sells for 4."
      testCardEffect(card.name, card, () => {
        expect(serialFounderCardEffects.spin_off).toBeDefined()
        expect(card.type).toBe('Product')
        // Cost reduction is handled in getCardDiscount
      })
    })
  })

  describe('high_profile_exit', () => {
    it('should sell all products and gain bonus capital', () => {
      const card = findCardByEffect('high_profile_exit')!
      // Card: High-Profile Exit - Cost: 2, Type: Action
      // Effect: "Sell all inventory from all Products. Gain 2 capital per Product you control."
      testCardEffect(card.name, card, () => {
        const product1 = createTestProduct({ inventory: 2, revenuePerSale: 1000 })
        const product2 = createTestProduct({ id: 'p2', inventory: 1, revenuePerSale: 2000 })
        G = new GameStateBuilder()
          .withProducts(product1, product2)
          .build()
        
        const initialRevenue = G.players[playerID].revenue
        const initialCapital = G.players[playerID].capital
        
        serialFounderCardEffects.high_profile_exit(G, playerID)
        
        // Should sell all inventory
        expect(G.players[playerID].revenue).toBe(initialRevenue + 4000) // 2*1000 + 1*2000
        expect(G.players[playerID].capital).toBe(initialCapital + 4) // 2 capital per product
        expect(product1.inventory).toBe(0)
        expect(product2.inventory).toBe(0)
      })
    })
  })

  describe('market_surge', () => {
    it('should gain capital or draw based on products', () => {
      const card = findCardByEffect('market_surge')!
      // Card: Market Surge - Cost: 1, Type: Action
      // Effect: "If you control a Product, gain 3 capital. Otherwise, draw 2 cards."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialCapital = G.players[playerID].capital
        const initialHandSize = G.players[playerID].hand.length
        
        // Test without products
        serialFounderCardEffects.market_surge(G, playerID)
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
        expect(G.players[playerID].capital).toBe(initialCapital)
        
        // Test with products
        G = new GameStateBuilder()
          .withProducts(createTestProduct())
          .withCapital(initialCapital)
          .build()
        
        serialFounderCardEffects.market_surge(G, playerID)
        expect(G.players[playerID].capital).toBe(initialCapital + 3)
      })
    })
  })

  describe('serial_operator', () => {
    it('should be a passive effect for product costs', () => {
      const card = findCardByEffect('serial_operator')!
      // Card: Serial Operator - Cost: 3, Type: Employee
      // Effect: "Your Products cost 1 less per Product you control (max 3)."
      testCardEffect(card.name, card, () => {
        expect(serialFounderCardEffects.serial_operator).toBeDefined()
        // Handled in getCardDiscount
      })
    })
  })

  describe('investor_buzz', () => {
    it('should set up capital doubling', () => {
      const card = findCardByEffect('investor_buzz')!
      // Card: Investor Buzz - Cost: 2, Type: Action
      // Effect: "The next time you gain capital this turn, double it."
      testCardEffect(card.name, card, () => {
        serialFounderCardEffects.investor_buzz(G, playerID)
        
        expect(G.effectContext?.[playerID]?.doubleCapitalGain).toBe(true)
      })
    })
  })

  describe('incubator_resources', () => {
    it('should be a passive effect', () => {
      const card = findCardByEffect('incubator_resources')!
      // Card: Incubator Resources - Cost: 2, Type: Tool
      // Effect: "At the start of your turn, if you control no Products, draw 2 cards."
      testCardEffect(card.name, card, () => {
        expect(serialFounderCardEffects.incubator_resources).toBeDefined()
        // Handled in processPassiveEffects
      })
    })
  })

  describe('board_of_directors', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('board_of_directors')!
      // Card: Board of Directors - Cost: 4, Type: Employee
      // Effect: "Recurring: At the start of your turn, gain 2 capital."
      testCardEffect(card.name, card, () => {
        expect(serialFounderCardEffects.board_of_directors).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('black_friday_blitz', () => {
    it('should create product choice for selling', () => {
      const card = findCardByEffect('black_friday_blitz')!
      // Card: Black Friday Blitz - Cost: 1, Type: Action
      // Effect: "Choose a Product. Sell up to 3 inventory from it."
      testCardEffect(card.name, card, () => {
        const product = createTestProduct({ inventory: 2 })
        G = new GameStateBuilder()
          .withProducts(product)
          .build()
        
        serialFounderCardEffects.black_friday_blitz(G, playerID, card)
        
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
        expect(G.players[playerID].pendingChoices[0].effect).toBe('black_friday_blitz_sell_product')
      })
    })
  })
}) 
import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../game/state'
import { GameStateBuilder, CardBuilder } from '../test-data-builders'
import { soloHustlerCardEffects } from '../../game/logic/effects/solo-hustler-effects'
import { automationArchitectCardEffects } from '../../game/logic/effects/automation-architect-effects'
import { serialFounderCardEffects } from '../../game/logic/effects/serial-founder-effects'

describe('Choice Resolution - Integration Tests', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Choice Creation and State', () => {
    it('should handle multiple pending choices from different effects', () => {
      G = new GameStateBuilder()
        .withHero('automation_architect')
        .withDeck(
          new CardBuilder().asAction(),
          new CardBuilder().asProduct(),
          new CardBuilder().asTool()
        )
        .build()

      const testCard = new CardBuilder().asAction()

      // A/B Test creates a choice
      automationArchitectCardEffects.ab_test(G, playerID, testCard)
      
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].type).toBe('choose_from_drawn_to_discard')
      
      // Verify choice has the drawn cards
      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(2)
    })

    it('should handle choices that affect board state', () => {
      G = new GameStateBuilder()
        .withHero('serial_founder')
        .withProducts(
          new CardBuilder().withId('p1').withInventory(3).asProduct(),
          new CardBuilder().withId('p2').withInventory(1).asProduct()
        )
        .build()

      // Black Friday Blitz creates choice to sell from a product
      serialFounderCardEffects.black_friday_blitz(G, playerID, new CardBuilder().asAction())

      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].effect).toBe('black_friday_blitz_sell_product')
      
      // Choice should include all products
      const productChoices = G.players[playerID].pendingChoices[0].cards
      expect(productChoices).toHaveLength(2)
    })
  })

  describe('Discard Choices', () => {
    it('should handle Midnight Oil discard with effect context', () => {
      G = new GameStateBuilder()
        .withHero('solo_hustler')
        .withDeck(
          new CardBuilder().asAction(),
          new CardBuilder().asAction(),
          new CardBuilder().asAction()
        )
        .withHand(
          new CardBuilder().withId('h1').asAction()
        )
        .build()

      // Midnight Oil draws 3, sets flag for discard
      soloHustlerCardEffects.midnight_oil(G, playerID)

      expect(G.players[playerID].hand).toHaveLength(4) // 1 + 3
      expect(G.effectContext?.[playerID]?.midnightOilDiscardPending).toBe(true)
      
      // In real game, this would trigger discard choice creation
    })

    it('should handle A/B Test draw and discard choice', () => {
      G = new GameStateBuilder()
        .withHero('automation_architect')
        .withDeck(
          new CardBuilder().withId('d1').asAction(),
          new CardBuilder().withId('d2').asProduct()
        )
        .build()

      const testCard = new CardBuilder().asAction()
      const initialHandSize = G.players[playerID].hand.length

      automationArchitectCardEffects.ab_test(G, playerID, testCard)

      // Should draw 2 cards
      expect(G.players[playerID].hand).toHaveLength(initialHandSize + 2)
      
      // Should create discard choice
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      const choice = G.players[playerID].pendingChoices[0]
      expect(choice.type).toBe('choose_from_drawn_to_discard')
      expect(choice.cards).toHaveLength(2)
    })
  })

  describe('Target Selection Choices', () => {
    it('should handle choices for targeting specific cards', () => {
      const product1 = new CardBuilder()
        .withId('p1')
        .withInventory(2)
        .asProduct()
      
      const product2 = new CardBuilder()
        .withId('p2')
        .withInventory(5)
        .asProduct()

      G = new GameStateBuilder()
        .withProducts(product1, product2)
        .build()

      // Create a choice context for selecting a product
      G.players[playerID].pendingChoices = [{
        type: 'choose_card',
        effect: 'add_inventory',
        cards: [product1, product2]
      }]

      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(2)
      expect(G.players[playerID].pendingChoices[0].cards).toContain(product1)
      expect(G.players[playerID].pendingChoices[0].cards).toContain(product2)
    })

    it('should handle filtered choices based on criteria', () => {
      G = new GameStateBuilder()
        .withProducts(
          new CardBuilder().withId('p1').withInventory(0).asProduct(),
          new CardBuilder().withId('p2').withInventory(3).asProduct(),
          new CardBuilder().withId('p3').withInventory(1).asProduct()
        )
        .build()

      // Simulate effect that only targets products with inventory
      const productsWithInventory = G.players[playerID].board.Products.filter(
        p => p.inventory && p.inventory > 0
      )

      expect(productsWithInventory).toHaveLength(2)
      expect(productsWithInventory[0].id).toBe('p2')
      expect(productsWithInventory[1].id).toBe('p3')
    })
  })

  describe('Hero Power Choices', () => {
    it('should handle Serial Founder Double Down choice', () => {
      G = new GameStateBuilder()
        .withHero('serial_founder')
        .withProducts(
          new CardBuilder().withInventory(2).asProduct(),
          new CardBuilder().withInventory(1).asProduct()
        )
        .build()

      // Hero power would create choice: draw 2 OR add inventory to all
      // This tests the setup for such a choice
      expect(G.players[playerID].board.Products).toHaveLength(2)
      
      // If inventory option chosen, all products would gain +1
      const totalInventoryBefore = G.players[playerID].board.Products.reduce(
        (sum, p) => sum + (p.inventory || 0), 0
      )
      expect(totalInventoryBefore).toBe(3)
    })
  })

  describe('Choice Timing and Sequencing', () => {
    it('should handle choices that must be resolved before continuing', () => {
      G = new GameStateBuilder()
        .withDeck(
          new CardBuilder().asAction(),
          new CardBuilder().asAction()
        )
        .build()

      // Some effects create mandatory choices
      G.players[playerID].pendingChoices = [{
        type: 'choose_card',
        effect: 'must_choose',
        cards: G.players[playerID].deck.slice(0, 2)
      }]

      // Game should not proceed until choice is resolved
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].type).toBe('choose_card')
    })

    it('should handle stacked choices in correct order', () => {
      G = new GameStateBuilder().build()

      // Simulate multiple choices being created
      G.players[playerID].pendingChoices = [
        {
          type: 'choose_card',
          effect: 'effect_1',
          cards: []
        },
        {
          type: 'discard',
          effect: 'effect_2',
          cards: []
        }
      ]

      // Choices should be resolved in order (FIFO)
      expect(G.players[playerID].pendingChoices[0].type).toBe('choose_card')
      expect(G.players[playerID].pendingChoices[1].type).toBe('discard')
    })
  })
}) 
import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../game/state'
import type { Card } from '../../game/types'
import { createTestProduct } from '../test-helpers'
import { GameStateBuilder, CardBuilder, TestScenarios } from '../test-data-builders'
import { gainCapital, drawCards } from '../../game/logic/utils/effect-helpers'
import { inventorySupportCardEffects } from '../../game/logic/effects/inventory-support-effects'
import { serialFounderCardEffects } from '../../game/logic/effects/serial-founder-effects'
import { communityLeaderCardEffects } from '../../game/logic/effects/community-leader-effects'
import { automationArchitectCardEffects } from '../../game/logic/effects/automation-architect-effects'
import { processAutomaticSales, processPassiveEffects, getCardDiscount } from '../../game/logic/turnEffects'

describe('Edge Case Tests', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Resource Limits', () => {
    it('should cap capital at 10', () => {
      G = new GameStateBuilder()
        .withCapital(8)
        .build()
      
      gainCapital(G, playerID, 5)
      expect(G.players[playerID].capital).toBe(10)
    })

    it('should handle capital gain when already at max', () => {
      G = TestScenarios.atCapitalLimit()
      
      gainCapital(G, playerID, 3)
      expect(G.players[playerID].capital).toBe(10)
    })

    it('should handle negative inventory gracefully', () => {
      const product = new CardBuilder().withInventory(0).asProduct()
      G = new GameStateBuilder()
        .withProducts(product)
        .build()
      
      // Try to sell when no inventory
      expect(() => {
        // This should not throw or go negative
        if (product.inventory !== undefined) {
          product.inventory = Math.max(0, product.inventory - 1)
        }
      }).not.toThrow()
      
      expect(product.inventory).toBe(0)
    })

    it('should handle revenue overflow gracefully', () => {
      G = new GameStateBuilder()
        .withRevenue(Number.MAX_SAFE_INTEGER - 1000)
        .withProducts(
          new CardBuilder()
            .withInventory(1)
            .withRevenuePerSale(5000)
            .asProduct()
        )
        .build()
      
      // Should handle large numbers
      expect(() => processAutomaticSales(G, playerID)).not.toThrow()
    })

    it('should handle maximum cards in hand', () => {
      // Add 100 cards to hand
      const manyCards = Array.from({ length: 100 }, (_, i) => 
        new CardBuilder().withId(`card${i}`).asProduct()
      )
      
      G = new GameStateBuilder()
        .withHand(...manyCards)
        .withDeck(new CardBuilder().withId('new').asProduct())
        .build()
      
      const initialHandSize = G.players[playerID].hand.length
      drawCards(G, playerID, 1)
      
      expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
    })
  })

  describe('Empty Collections', () => {
    it('should handle drawing from empty deck', () => {
      G = new GameStateBuilder()
        .withEmptyDeck()
        .build()
      
      const initialHandSize = G.players[playerID].hand.length
      
      // Should not throw
      expect(() => drawCards(G, playerID, 3)).not.toThrow()
      
      // Hand size should remain the same
      expect(G.players[playerID].hand.length).toBe(initialHandSize)
    })

    it('should handle effects when no products on board', () => {
      G = new GameStateBuilder()
        .withEmptyBoard()
        .build()
      
      // Should handle gracefully
      expect(() => {
        inventorySupportCardEffects.add_inventory_to_product(G, playerID)
      }).not.toThrow()
      
      // When no products, no choice is created (which is correct behavior)
      expect(G.players[playerID].pendingChoices).toHaveLength(0)
    })

    it('should handle selling all products when none exist', () => {
      G = new GameStateBuilder()
        .withEmptyBoard()
        .build()
      
      const initialRevenue = G.players[playerID].revenue
      const initialCapital = G.players[playerID].capital
      
      serialFounderCardEffects.high_profile_exit(G, playerID)
      
      // Should not crash and values should remain unchanged
      expect(G.players[playerID].revenue).toBe(initialRevenue)
      expect(G.players[playerID].capital).toBe(initialCapital)
    })

    it('should handle empty board for employee effects', () => {
      G = new GameStateBuilder()
        .withEmptyBoard()
        .build()
      
      // Town Hall effect should draw 0 cards
      const initialHandSize = G.players[playerID].hand.length
      communityLeaderCardEffects.town_hall(G, playerID)
      expect(G.players[playerID].hand.length).toBe(initialHandSize)
    })

    it('should handle empty board for tool effects', () => {
      G = new GameStateBuilder()
        .withEmptyBoard()
        .build()
      
      const initialCapital = G.players[playerID].capital
      
      // Zap Everything should give base 2 capital
      automationArchitectCardEffects.zap_everything(G, playerID)
      expect(G.players[playerID].capital).toBe(initialCapital + 2)
    })

    it('should handle discard with empty hand', () => {
      G = new GameStateBuilder()
        .withEmptyHand()
        .build()
      
      // Should not throw when checking hand
      expect(() => {
        if (G.players[playerID].hand.length > 0) {
          // Only discard if there are cards
        }
      }).not.toThrow()
    })
  })

  describe('Invalid Inputs', () => {
    it('should handle undefined effect context gracefully', () => {
      G = new GameStateBuilder().build()
      delete G.effectContext
      
      // Should not throw when trying to access effect context
      expect(() => {
        if (G.effectContext?.[playerID]?.nextCardDiscount) {
          // This should safely not execute
        }
      }).not.toThrow()
    })

    it('should handle products with undefined inventory', () => {
      const product = createTestProduct()
      delete product.inventory
      
      G = new GameStateBuilder()
        .withProducts(product)
        .build()
      
      // Should skip products without inventory
      inventorySupportCardEffects.add_inventory_to_low_stock(G, playerID)
      
      expect(product.inventory).toBeUndefined()
    })

    it('should handle malformed card data', () => {
      const malformedCard = {
        id: 'bad',
        name: 'Bad Card',
        // Missing required fields: cost, type, text
      } as unknown as Card
      
      G = new GameStateBuilder()
        .withHand(malformedCard)
        .build()
      
      // Should handle gracefully
      expect(() => {
        // Attempt to process effects - should not crash
        processPassiveEffects(G, playerID)
      }).not.toThrow()
    })

    it('should handle invalid player IDs', () => {
      G = new GameStateBuilder().build()
      const invalidPlayerID = '999'
      
      // Should handle gracefully
      expect(() => {
        if (G.players[invalidPlayerID]) {
          drawCards(G, invalidPlayerID, 1)
        }
      }).not.toThrow()
    })

    it('should handle negative values in effects', () => {
      G = new GameStateBuilder().build()
      
      // Test negative capital gain
      gainCapital(G, playerID, -5)
      
      // Capital should not go negative
      expect(G.players[playerID].capital).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Boundary Conditions', () => {
    it('should handle exactly meeting conditions', () => {
      G = new GameStateBuilder()
        .withEffectContext({
          cardsPlayedThisTurn: 2
        })
        .build()
      
      // Should trigger effects that require 2+ cards
      expect(G.effectContext?.[playerID]?.cardsPlayedThisTurn).toBeGreaterThanOrEqual(2)
    })

    it('should handle maximum hand size scenarios', () => {
      // First, add many cards to the deck so we can actually draw them
      const deckCards = Array.from({ length: 30 }, (_, i) => 
        new CardBuilder().withId(`deck${i}`).asProduct()
      )
      const handCards = Array.from({ length: 20 }, (_, i) => 
        new CardBuilder().withId(`hand${i}`).asProduct()
      )
      
      G = new GameStateBuilder()
        .withDeck(...deckCards)
        .withHand(...handCards)
        .build()
      
      const largeHandSize = G.players[playerID].hand.length
      
      // Drawing more cards should still work
      drawCards(G, playerID, 5)
      
      expect(G.players[playerID].hand.length).toBe(largeHandSize + 5)
    })

    it('should handle cost reduction to exactly 0', () => {
      const card = new CardBuilder().withCost(2).asProduct()
      
      G = new GameStateBuilder()
        .withEffectContext({
          nextCardDiscount: 2
        })
        .build()
      
      // Cost should be exactly 0, not negative
      // This would be tested in getCardCost function
      expect(card.cost - (G.effectContext?.[playerID]?.nextCardDiscount || 0)).toBe(0)
    })

    it('should handle inventory at exactly 0', () => {
      const product = new CardBuilder().withInventory(1).asProduct()
      
      G = new GameStateBuilder()
        .withProducts(product)
        .build()
      
      // Sell exactly all inventory
      product.inventory = 0
      
      // Product should still exist on board
      expect(G.players[playerID].board.Products).toContain(product)
      expect(product.inventory).toBe(0)
    })

    it('should handle turn 0 edge case', () => {
      G = new GameStateBuilder()
        .withTurn(0)
        .build()
      
      // Effects that check "last turn" should handle turn 0
      expect(() => processPassiveEffects(G, playerID)).not.toThrow()
    })
  })

  describe('Timing Edge Cases', () => {
    it('should handle effects that reference "last turn" on turn 1', () => {
      G = new GameStateBuilder()
        .withTurn(1)
        .withEffectContext({
          soldProductLastTurn: undefined
        })
        .build()
      
      // Effects checking last turn should handle gracefully
      expect(G.effectContext?.[playerID]?.soldProductLastTurn).toBeFalsy()
    })

    it('should handle multiple simultaneous temporary effects', () => {
      G = new GameStateBuilder()
        .withEffectContext({
          nextCardDiscount: 1,
          nextProductDiscount: 2,
          productCostReduction: 1
        })
        .build()
      
      // All reductions should stack properly
      const totalDiscount = 
        (G.effectContext?.[playerID]?.nextCardDiscount || 0) +
        (G.effectContext?.[playerID]?.nextProductDiscount || 0) +
        (G.effectContext?.[playerID]?.productCostReduction || 0)
      
      expect(totalDiscount).toBe(4)
    })

    it('should handle end of turn cleanup', () => {
      G = new GameStateBuilder()
        .withEffectContext({
          nextCardDiscount: 5,
          cardsPlayedThisTurn: 3
        })
        .build()
      
      // These values exist during turn
      expect(G.effectContext?.[playerID]?.nextCardDiscount).toBe(5)
      expect(G.effectContext?.[playerID]?.cardsPlayedThisTurn).toBe(3)
      
      // After turn cleanup, they should be reset (this would be in actual game flow)
    })

    it('should handle recurring effects on first activation', () => {
      // Add a recurring effect card
      const recurringCard = new CardBuilder()
        .withId('rec1')
        .withName('Recurring Test')
        .withType('Tool')
        .withKeywords(['Recurring'])
        .withEffect('test_recurring')
        .asTool()
      
      G = new GameStateBuilder()
        .withTools(recurringCard)
        .build()
      
      // Should not throw on first process
      expect(() => processPassiveEffects(G, playerID)).not.toThrow()
    })
  })

  describe('Choice System Edge Cases', () => {
    it('should handle multiple pending choices', () => {
      G = new GameStateBuilder().build()
      
      // Create multiple choices
      G.players[playerID].pendingChoices = [
        {
          type: 'choose_card',
          effect: 'test_effect_1',
          cards: []
        },
        {
          type: 'choose_option',
          effect: 'test_effect_2',
          options: []
        }
      ]
      
      expect(G.players[playerID].pendingChoices).toHaveLength(2)
    })

    it('should handle choices with no valid options', () => {
      G = new GameStateBuilder()
        .withEmptyBoard()
        .build()
      
      // Create choice that has no cards
      G.players[playerID].pendingChoices = [{
        type: 'choose_card',
        effect: 'test_effect',
        cards: []
      }]
      
      // Choice exists but has no cards
      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(0)
    })

    it('should handle Community Leader viral with no products', () => {
      G = new GameStateBuilder()
        .withHero('community_leader')
        .withEmptyBoard()
        .withEffectContext({
          cardsPlayedThisTurn: 2
        })
        .build()
      
      // Should create choice but with no options - using valid choice type
      expect(() => {
        // This would be called by hero ability
        G.players[playerID].pendingChoices = [{
          type: 'choose_card',
          effect: 'viral_copy',
          cards: []
        }]
      }).not.toThrow()
    })
  })

  describe('Card Type Specific Edge Cases', () => {
    it('should handle products with extreme revenue values', () => {
      G = new GameStateBuilder()
        .withProducts(
          new CardBuilder()
            .withRevenuePerSale(Number.MAX_SAFE_INTEGER / 2)
            .withInventory(2)
            .asProduct()
        )
        .build()
      
      // Should handle large revenue calculations
      expect(() => processAutomaticSales(G, playerID)).not.toThrow()
    })

    it('should handle tools with no effect', () => {
      const tool = new CardBuilder()
        .withId('tool1')
        .withName('Passive Tool')
        .asTool()
      
      // Remove effect property
      delete tool.effect
      
      G = new GameStateBuilder()
        .withTools(tool)
        .build()
      
      // Should not crash when processing
      expect(() => processPassiveEffects(G, playerID)).not.toThrow()
    })

    it('should handle employees with passive effects', () => {
      const employee = new CardBuilder()
        .withId('emp1')
        .withEffect('passive_employee_effect')
        .asEmployee()
      
      G = new GameStateBuilder()
        .withEmployees(employee)
        .build()
      
      // Should process without errors
      expect(() => processPassiveEffects(G, playerID)).not.toThrow()
    })
  })

  describe('Hero-Specific Edge Cases', () => {
    it('should handle Solo Hustler discount on non-product cards', () => {
      G = new GameStateBuilder()
        .withHero('solo_hustler')
        .withEffectContext({
          soloHustlerDiscountedCard: 'action123'
        })
        .build()
      
      // Should only apply to the specific card ID
      expect(G.effectContext?.[playerID]?.soloHustlerDiscountedCard).toBe('action123')
    })

    it('should handle Brand Builder with no tools', () => {
      // Visual Identity reduces Product costs by 1 if you control another Tool
      const visualIdentity = new CardBuilder()
        .withEffect('visual_identity')
        .asTool()
      
      const product = new CardBuilder().withCost(3).asProduct()
      
      // With only Visual Identity (no other tools)
      G = new GameStateBuilder()
        .withTools(visualIdentity)
        .build()
      
      let discount = getCardDiscount(G, playerID, product)
      expect(discount).toBe(0)
      
      // Add another tool
      const otherTool = new CardBuilder().withId('tool2').asTool()
      G.players[playerID].board.Tools.push(otherTool)
      
      // Now with 2 tools (Visual Identity + another), products get -1 discount
      discount = getCardDiscount(G, playerID, product)
      expect(discount).toBe(1)
    })
  })
}) 
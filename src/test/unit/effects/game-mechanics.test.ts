import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { processAutomaticSales } from '../../../game/logic/turnEffects'
import { gainCapital } from '../../../game/logic/utils/effect-helpers'
import { spendCapital } from '../../../game/logic/utils/player-resource-helpers'
import { inventorySupportCardEffects } from '../../../game/logic/effects/inventory-support-effects'
import { checkGameEnd } from '../../../game/logic/utils/game-state-helpers'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'

describe('Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Automatic Sales', () => {
    it('should sell 1 inventory from each product at turn start', () => {
      const products = [
        new CardBuilder().withId('p1').withInventory(3).withRevenuePerSale(1000).asProduct(),
        new CardBuilder().withId('p2').withInventory(2).withRevenuePerSale(1500).asProduct()
      ]
      
      G = new GameStateBuilder()
        .withProducts(...products)
        .build()

      processAutomaticSales(G, playerID)
      
      // Each product should have sold 1 inventory
      expect(products[0].inventory).toBe(2)
      expect(products[1].inventory).toBe(1)
      
      // Revenue should be sum of all sales
      expect(G.players[playerID].revenue).toBe(2500)
      
      // Should track that products were sold
      const ctx = G.effectContext?.[playerID]
      expect(ctx?.soldProductThisTurn).toBe(true)
      expect(ctx?.itemsSoldThisTurn).toBe(4)
    })

    it('should not sell from products with 0 inventory', () => {
      const products = [
        new CardBuilder().withId('p1').withInventory(0).withRevenuePerSale(1000).asProduct(),
        new CardBuilder().withId('p2').withInventory(1).withRevenuePerSale(1500).asProduct()
      ]
      
      G = new GameStateBuilder()
        .withProducts(...products)
        .build()

      processAutomaticSales(G, playerID)
      
      // Only product with inventory should sell
      expect(products[0].inventory).toBe(0)
      expect(products[1].inventory).toBe(0)
      expect(G.players[playerID].revenue).toBe(1500)
    })

    it('should not sell from inactive products', () => {
      const activeProduct = new CardBuilder()
        .withId('p1')
        .withInventory(2)
        .withRevenuePerSale(1000)
        .asProduct()
      
      const inactiveProduct = new CardBuilder()
        .withId('p2')
        .withInventory(2)
        .withRevenuePerSale(1500)
        .asProduct()
      
      inactiveProduct.isActive = false
      
      G = new GameStateBuilder()
        .withProducts(activeProduct, inactiveProduct)
        .build()

      processAutomaticSales(G, playerID)
      
      // Only active product should sell
      expect(activeProduct.inventory).toBe(1)
      expect(inactiveProduct.inventory).toBe(2)
      expect(G.players[playerID].revenue).toBe(1000)
    })
  })

  describe('Inventory Support Effects', () => {
    it('should add inventory to a product', () => {
      const product = new CardBuilder()
        .withId('prod1')
        .withInventory(2)
        .asProduct()
      
      G = new GameStateBuilder()
        .withProducts(product)
        .build()

      inventorySupportCardEffects.add_inventory_to_product(G, playerID)
      
      // Should create a pending choice
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].type).toBe('choose_card')
      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(1)
    })

    it('should add inventory if product has none', () => {
      const productWithStock = new CardBuilder()
        .withId('prod1')
        .withInventory(3)
        .asProduct()
      
      const productEmpty = new CardBuilder()
        .withId('prod2')
        .withInventory(0)
        .asProduct()
      
      G = new GameStateBuilder()
        .withProducts(productWithStock, productEmpty)
        .build()

      inventorySupportCardEffects.add_inventory_if_empty(G, playerID)
      
      // Should create a pending choice for empty products
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].cards?.[0].id).toBe('prod2')
    })

    it('should add inventory to low stock products', () => {
      const lowStock = new CardBuilder()
        .withId('prod1')
        .withInventory(1)
        .asProduct()
      
      const highStock = new CardBuilder()
        .withId('prod2')
        .withInventory(5)
        .asProduct()
      
      G = new GameStateBuilder()
        .withProducts(lowStock, highStock)
        .build()

      inventorySupportCardEffects.add_inventory_to_low_stock(G, playerID)
      
      // Should only boost low stock product
      expect(lowStock.inventory).toBe(2)
      expect(highStock.inventory).toBe(5)
    })

    it('should boost multiple products', () => {
      const products = [
        new CardBuilder().withId('prod1').withInventory(2).asProduct(),
        new CardBuilder().withId('prod2').withInventory(3).asProduct(),
        new CardBuilder().withId('prod3').withInventory(1).asProduct()
      ]
      
      G = new GameStateBuilder()
        .withProducts(...products)
        .build()

      inventorySupportCardEffects.multi_product_inventory_boost(G, playerID)
      
      // Should create a choice for selecting products
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(3)
    })

    it('should set up delayed inventory boost', () => {
      G = new GameStateBuilder().build()
      
      inventorySupportCardEffects.delayed_inventory_boost(G, playerID)
      
      // Should set up delay for 2 turns
      expect(G.effectContext?.[playerID]?.delayedInventoryBoostTurns).toBe(2)
    })

    it('should draw cards and add inventory', () => {
      const product = new CardBuilder()
        .withId('prod1')
        .withInventory(2)
        .asProduct()
      
      // Add cards to deck to draw
      const deckCards = [
        new CardBuilder().asAction(),
        new CardBuilder().asAction()
      ]
      
      G = new GameStateBuilder()
        .withProducts(product)
        .withDeck(...deckCards)
        .build()

      const initialHandSize = G.players[playerID].hand.length
      
      inventorySupportCardEffects.draw_and_inventory(G, playerID)
      
      // Should draw 1 card (not 2)
      expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
      // Should create pending choice for inventory
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
    })
  })

  describe('Game End Conditions', () => {
    it('should end game when revenue target is reached', () => {
      G = new GameStateBuilder()
        .withRevenue(500_000)
        .build()
      
      checkGameEnd(G)
      expect(G.gameOver).toBe(true)
      expect(G.winner).toBe(true)
    })

    it('should not end game when revenue is below target', () => {
      G = new GameStateBuilder()
        .withRevenue(5000)
        .build()
      
      checkGameEnd(G)
      expect(G.gameOver).toBe(false)
    })
  })

  describe('Capital Management', () => {
    it('should spend capital correctly', () => {
      G = new GameStateBuilder()
        .withCapital(5)
        .build()
      
      const player = G.players[playerID]
      const success = spendCapital(player, 3)
      expect(success).toBe(true)
      expect(player.capital).toBe(2)
    })

    it('should not spend more capital than available', () => {
      G = new GameStateBuilder()
        .withCapital(2)
        .build()
      
      const player = G.players[playerID]
      const success = spendCapital(player, 5)
      expect(success).toBe(false)
      expect(player.capital).toBe(2)
    })

    it('should gain capital correctly', () => {
      G = new GameStateBuilder()
        .withCapital(3)
        .build()
      
      gainCapital(G, playerID, 4)
      expect(G.players[playerID].capital).toBe(7)
    })

    it('should cap capital at 10', () => {
      G = new GameStateBuilder()
        .withCapital(8)
        .build()
      
      gainCapital(G, playerID, 5)
      expect(G.players[playerID].capital).toBe(10)
    })
  })
}) 
import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { inventorySupportCardEffects } from '../../../game/logic/effects/inventory-support-effects'
import { testCardEffect, createTestProduct } from '../../test-helpers'

// Import card definitions
import { inventorySupportCards } from '../../../game/data/inventory-support-cards'

// Helper to find card by effect name
function findCardByEffect(effectName: string) {
  return inventorySupportCards.find(card => card.effect === effectName)
}

describe('Inventory Support Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('add_inventory_to_product', () => {
    it('should create a product choice', () => {
      const card = findCardByEffect('add_inventory_to_product')!
      // Card: Bulk Order Deal - Cost: 1, Type: Action
      // Effect: "Choose a Product. Add +2 inventory."
      testCardEffect(card.name, card, () => {
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
    })
  })

  describe('add_inventory_if_empty', () => {
    it('should only allow choosing products with 0 inventory', () => {
      const card = findCardByEffect('add_inventory_if_empty')!
      // Card: Reorder Notification - Cost: 2, Type: Action
      // Effect: "Choose a Product with 0 inventory. Add +3 inventory."
      testCardEffect(card.name, card, () => {
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
    })
  })

  describe('add_inventory_to_low_stock', () => {
    it('should add inventory to products with less than 2 inventory', () => {
      const card = findCardByEffect('add_inventory_to_low_stock')!
      // Card: Dropship Restock - Cost: 1, Type: Action
      // Effect: "All Products with less than 2 inventory gain +1."
      testCardEffect(card.name, card, () => {
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
    })
  })

  describe('multi_product_inventory_boost', () => {
    it('should create choice for multiple products', () => {
      const card = findCardByEffect('multi_product_inventory_boost')!
      // Card: Warehouse Expansion - Cost: 3, Type: Action
      // Effect: "Choose up to 3 Products. Add +1 inventory to each."
      testCardEffect(card.name, card, () => {
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
    })
  })

  describe('inventory_and_sale_boost', () => {
    it('should create product choice', () => {
      const card = findCardByEffect('inventory_and_sale_boost')!
      // Card: Viral Unboxing Video - Cost: 2, Type: Action
      // Effect: "Choose a Product. Add +1 inventory and +1 sale this turn."
      testCardEffect(card.name, card, () => {
        const product = createTestProduct({ inventory: 2 })
        G = new GameStateBuilder()
          .withProducts(product)
          .build()
        
        inventorySupportCardEffects.inventory_and_sale_boost(G, playerID)
        
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
        expect(G.players[playerID].pendingChoices[0].effect).toBe('inventory_and_sale_boost')
      })
    })
  })

  describe('inventory_boost_plus_revenue', () => {
    it('should create product choice', () => {
      const card = findCardByEffect('inventory_boost_plus_revenue')!
      // Card: Supplier Collab - Cost: 2, Type: Action
      // Effect: "Choose a Product. Add +2 inventory. Its next sale earns +1000."
      testCardEffect(card.name, card, () => {
        const product = createTestProduct()
        G = new GameStateBuilder()
          .withProducts(product)
          .build()
        
        inventorySupportCardEffects.inventory_boost_plus_revenue(G, playerID)
        
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
        expect(G.players[playerID].pendingChoices[0].effect).toBe('inventory_boost_plus_revenue')
      })
    })
  })

  describe('delayed_inventory_boost', () => {
    it('should set up delayed inventory boost', () => {
      const card = findCardByEffect('delayed_inventory_boost')!
      // Card: Fulfillment App Integration - Cost: 2, Type: Tool
      // Effect: "At the start of your next 2 turns, add +1 inventory to a random Product."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder().build()
        
        inventorySupportCardEffects.delayed_inventory_boost(G, playerID)
        
        // Should set up delay for 2 turns
        expect(G.effectContext?.[playerID]?.delayedInventoryBoostTurns).toBe(2)
      })
    })
  })

  describe('draw_and_inventory', () => {
    it('should draw card and create inventory choice', () => {
      const card = findCardByEffect('draw_and_inventory')!
      // Card: Inventory Forecast Tool - Cost: 1, Type: Action
      // Effect: "Draw 1. Then choose a Product to gain +1 inventory."
      testCardEffect(card.name, card, () => {
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
        
        // Should draw 1 card
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
        // Should create pending choice for inventory
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
      })
    })
  })

  describe('simple_inventory_boost', () => {
    it('should create product choice', () => {
      const card = findCardByEffect('simple_inventory_boost')!
      // Card: Last-Minute Restock - Cost: 0, Type: Action
      // Effect: "Choose any Product. Add +1 inventory."
      testCardEffect(card.name, card, () => {
        const product = createTestProduct()
        G = new GameStateBuilder()
          .withProducts(product)
          .build()
        
        inventorySupportCardEffects.simple_inventory_boost(G, playerID)
        
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
        expect(G.players[playerID].pendingChoices[0].effect).toBe('simple_inventory_boost')
      })
    })
  })
}) 
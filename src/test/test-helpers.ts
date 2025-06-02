import type { GameState, PlayerState } from '../game/state'
import type { Card } from '../game/types'
import { initEffectContext } from '../game/logic/effectContext'

export function createInitialGameState(): GameState {
  return {
    players: {
      '0': createTestPlayer()
    },
    currentPlayer: '0',
    turn: 1,
    gameOver: false,
    winner: false,
    effectContext: {
      '0': initEffectContext()
    },
    gameLog: []
  }
}

export function createTestPlayer(): PlayerState {
  return {
    hand: [],
    deck: createTestDeck(),
    board: {
      Products: [],
      Tools: [],
      Employees: []
    },
    revenue: 0,
    capital: 5,
    hero: 'solo_hustler',
    heroAbilityUsed: false,
    pendingChoices: []
  }
}

export function createTestDeck(): Card[] {
  return [
    { id: 'test_card_1', name: 'Test Card 1', cost: 1, type: 'Product', text: 'Test product', inventory: 3 },
    { id: 'test_card_2', name: 'Test Card 2', cost: 2, type: 'Product', text: 'Another test product', inventory: 2 },
    { id: 'test_card_3', name: 'Test Card 3', cost: 1, type: 'Action', text: 'Test action' },
  ]
}

export function createTestProduct(overrides: Partial<Card> = {}): Card {
  return {
    id: 'test_product',
    name: 'Test Product',
    cost: 2,
    type: 'Product',
    text: 'A test product card',
    inventory: 3,
    revenuePerSale: 3000,
    ...overrides
  }
}

export function createTestAction(overrides: Partial<Card> = {}): Card {
  return {
    id: 'test_action',
    name: 'Test Action',
    cost: 1,
    type: 'Action',
    text: 'A test action card',
    effect: 'test_effect',
    ...overrides
  }
}

// Test wrapper for card effects
export function testCardEffect(
  cardName: string,
  cardDefinition: { text?: string; effect?: string; cost?: number; type?: string; id?: string; name?: string },
  testFn: () => void
) {
  try {
    testFn()
  } catch (error) {
    console.error(`\n=== CARD DEFINITION FOR FAILED TEST ===`)
    console.error(`Card: ${cardName}`)
    console.error(`Text: ${cardDefinition.text || 'No text'}`)
    console.error(`Effect: ${cardDefinition.effect || 'No effect'}`)
    console.error(`Full Definition:`, JSON.stringify(cardDefinition, null, 2))
    console.error(`=====================================\n`)
    throw error
  }
}

// Test wrapper for hero abilities
export function testHeroAbility(
  heroName: string,
  abilityDefinition: { name?: string; text?: string; cost?: number; effect?: string },
  testFn: () => void
) {
  try {
    testFn()
  } catch (error) {
    console.error(`\n=== HERO ABILITY DEFINITION FOR FAILED TEST ===`)
    console.error(`Hero: ${heroName}`)
    console.error(`Ability: ${abilityDefinition.name || 'Unknown'}`)
    console.error(`Text: ${abilityDefinition.text || 'No text'}`)
    console.error(`Cost: ${abilityDefinition.cost || 0}`)
    console.error(`Effect: ${abilityDefinition.effect || 'No effect'}`)
    console.error(`==============================================\n`)
    throw error
  }
} 
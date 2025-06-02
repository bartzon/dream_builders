import type { GameState, PlayerState } from '../game/state'
import type { Card } from '../game/types'
import { createInitialGameState } from './test-helpers'
import { initEffectContext, type EffectContext } from '../game/logic/effectContext'

/**
 * Fluent builder for creating GameState objects in tests
 * Makes test setup more readable and maintainable
 */
export class GameStateBuilder {
  private state: GameState
  private currentPlayerID: string = '0'

  constructor() {
    this.state = createInitialGameState()
  }

  /**
   * Set the current player
   */
  withPlayer(playerID: string): this {
    this.currentPlayerID = playerID
    if (!this.state.players[playerID]) {
      this.state.players[playerID] = this.createDefaultPlayer()
    }
    this.state.currentPlayer = playerID
    return this
  }

  /**
   * Add products to the current player's board
   */
  withProducts(...products: Card[]): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].board.Products.push(...products)
    return this
  }

  /**
   * Add tools to the current player's board
   */
  withTools(...tools: Card[]): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].board.Tools.push(...tools)
    return this
  }

  /**
   * Add employees to the current player's board
   */
  withEmployees(...employees: Card[]): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].board.Employees.push(...employees)
    return this
  }

  /**
   * Set the current player's capital
   */
  withCapital(amount: number): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].capital = amount
    return this
  }

  /**
   * Set the current player's revenue
   */
  withRevenue(amount: number): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].revenue = amount
    return this
  }

  /**
   * Add cards to the current player's hand
   */
  withHand(...cards: Card[]): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].hand.push(...cards)
    return this
  }

  /**
   * Add cards to the current player's deck
   */
  withDeck(...cards: Card[]): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].deck.push(...cards)
    return this
  }

  /**
   * Set the game turn
   */
  withTurn(turn: number): this {
    this.state.turn = turn
    return this
  }

  /**
   * Set the hero for the current player
   */
  withHero(hero: PlayerState['hero']): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].hero = hero
    return this
  }

  /**
   * Mark hero ability as used/unused
   */
  withHeroAbilityUsed(used: boolean = true): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].heroAbilityUsed = used
    return this
  }

  /**
   * Add effect context values
   */
  withEffectContext(effectContext: Partial<EffectContext>): this {
    this.ensurePlayer()
    if (!this.state.effectContext) {
      this.state.effectContext = {}
    }
    if (!this.state.effectContext[this.currentPlayerID]) {
      this.state.effectContext[this.currentPlayerID] = initEffectContext()
    }
    Object.assign(this.state.effectContext[this.currentPlayerID], effectContext)
    return this
  }

  /**
   * Set up a complete board state with multiple card types
   */
  withBoard(board: { tools?: Card[], products?: Card[], employees?: Card[] }): this {
    if (board.tools) this.withTools(...board.tools)
    if (board.products) this.withProducts(...board.products)
    if (board.employees) this.withEmployees(...board.employees)
    return this
  }

  /**
   * Clear the current player's board
   */
  withEmptyBoard(): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].board = {
      Tools: [],
      Products: [],
      Employees: []
    }
    return this
  }

  /**
   * Clear the current player's hand
   */
  withEmptyHand(): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].hand = []
    return this
  }

  /**
   * Clear the current player's deck
   */
  withEmptyDeck(): this {
    this.ensurePlayer()
    this.state.players[this.currentPlayerID].deck = []
    return this
  }

  /**
   * Build and return the GameState
   */
  build(): GameState {
    return this.state
  }

  private ensurePlayer(): void {
    if (!this.state.players[this.currentPlayerID]) {
      this.state.players[this.currentPlayerID] = this.createDefaultPlayer()
    }
  }

  private createDefaultPlayer(): PlayerState {
    return {
      hand: [],
      deck: [],
      board: {
        Tools: [],
        Products: [],
        Employees: []
      },
      revenue: 0,
      capital: 5,
      hero: 'solo_hustler',
      heroAbilityUsed: false,
      pendingChoices: []
    }
  }
}

/**
 * Fluent builder for creating Card objects in tests
 */
export class CardBuilder {
  private card: Partial<Card> = {}

  withId(id: string): this {
    this.card.id = id
    return this
  }

  withName(name: string): this {
    this.card.name = name
    return this
  }

  withCost(cost: number): this {
    this.card.cost = cost
    return this
  }

  withType(type: Card['type']): this {
    this.card.type = type
    return this
  }

  withText(text: string): this {
    this.card.text = text
    return this
  }

  withEffect(effect: string): this {
    this.card.effect = effect
    return this
  }

  withKeywords(keywords: string[]): this {
    this.card.keywords = keywords
    return this
  }

  withFlavor(flavor: string): this {
    this.card.flavor = flavor
    return this
  }

  /**
   * Product-specific properties
   */
  withInventory(inventory: number): this {
    this.card.inventory = inventory
    return this
  }

  withRevenuePerSale(revenue: number): this {
    this.card.revenuePerSale = revenue
    return this
  }

  /**
   * Create a Product card with defaults
   */
  asProduct(overrides: Partial<Card> = {}): Card {
    return {
      id: 'p1',
      name: 'Test Product',
      cost: 2,
      type: 'Product',
      text: 'Sells for $1000',
      inventory: 3,
      revenuePerSale: 1000,
      ...this.card,
      ...overrides
    } as Card
  }

  /**
   * Create a Tool card with defaults
   */
  asTool(overrides: Partial<Card> = {}): Card {
    return {
      id: 't1',
      name: 'Test Tool',
      cost: 2,
      type: 'Tool',
      text: 'Does something useful',
      ...this.card,
      ...overrides
    } as Card
  }

  /**
   * Create an Employee card with defaults
   */
  asEmployee(overrides: Partial<Card> = {}): Card {
    return {
      id: 'e1',
      name: 'Test Employee',
      cost: 3,
      type: 'Employee',
      text: 'Helps you out',
      ...this.card,
      ...overrides
    } as Card
  }

  /**
   * Create an Action card with defaults
   */
  asAction(overrides: Partial<Card> = {}): Card {
    return {
      id: 'a1',
      name: 'Test Action',
      cost: 1,
      type: 'Action',
      text: 'Do something once',
      ...this.card,
      ...overrides
    } as Card
  }

  /**
   * Build a generic card (requires all properties to be set)
   */
  build(): Card {
    if (!this.card.id || !this.card.name || this.card.cost === undefined || 
        !this.card.type || !this.card.text) {
      throw new Error('Card builder missing required properties: id, name, cost, type, text')
    }
    return this.card as Card
  }
}

/**
 * Factory functions for common test scenarios
 */
export const TestScenarios = {
  /**
   * Create a game state with products ready to sell
   */
  withProductsReadyToSell(productCount: number = 2): GameState {
    const products = Array.from({ length: productCount }, (_, i) => 
      new CardBuilder()
        .withId(`product${i}`)
        .withInventory(2)
        .withRevenuePerSale(1000)
        .asProduct()
    )
    
    return new GameStateBuilder()
      .withProducts(...products)
      .build()
  },

  /**
   * Create a game state with a full board
   */
  withFullBoard(): GameState {
    return new GameStateBuilder()
      .withTools(
        new CardBuilder().withId('tool1').asTool(),
        new CardBuilder().withId('tool2').asTool()
      )
      .withProducts(
        new CardBuilder().withId('prod1').asProduct(),
        new CardBuilder().withId('prod2').asProduct()
      )
      .withEmployees(
        new CardBuilder().withId('emp1').asEmployee()
      )
      .build()
  },

  /**
   * Create a game state at capital limit
   */
  atCapitalLimit(): GameState {
    return new GameStateBuilder()
      .withCapital(10)
      .build()
  },

  /**
   * Create a game state with specific hero and board setup
   */
  withHeroSetup(hero: PlayerState['hero'], setup: {
    tools?: number,
    products?: number,
    employees?: number,
    capital?: number
  } = {}): GameState {
    const builder = new GameStateBuilder().withHero(hero)
    
    if (setup.capital !== undefined) {
      builder.withCapital(setup.capital)
    }
    
    if (setup.tools) {
      const tools = Array.from({ length: setup.tools }, (_, i) => 
        new CardBuilder().withId(`tool${i}`).asTool()
      )
      builder.withTools(...tools)
    }
    
    if (setup.products) {
      const products = Array.from({ length: setup.products }, (_, i) => 
        new CardBuilder().withId(`product${i}`).asProduct()
      )
      builder.withProducts(...products)
    }
    
    if (setup.employees) {
      const employees = Array.from({ length: setup.employees }, (_, i) => 
        new CardBuilder().withId(`employee${i}`).asEmployee()
      )
      builder.withEmployees(...employees)
    }
    
    return builder.build()
  }
} 
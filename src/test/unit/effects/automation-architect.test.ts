import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { automationArchitectCardEffects } from '../../../game/logic/effects/automation-architect-effects'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'
import { testCardEffect, testHeroAbility } from '../../test-helpers'

// Import card definitions
import { automationArchitectDeck, automationArchitectHero } from '../../../game/data/heroes/automation-architect'

// Helper to find card by effect name
function findCardByEffect(effectName: string) {
  return automationArchitectDeck.find(card => card.effect === effectName)
}

describe('Automation Architect Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Hero Power: Deploy Script', () => {
    it('should gain 1 recurring capital next turn', () => {
      // Hero Power: Deploy Script
      // Effect: "Gain 1 capital at the start of your next turn."
      testHeroAbility(automationArchitectHero.name, automationArchitectHero.heroPower, () => {
        heroAbilityEffects.automation_architect_deploy(G, playerID)
        
        expect(G.effectContext?.[playerID]?.recurringCapitalNextTurn).toBe(1)
      })
    })
  })

  describe('auto_fulfill', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('auto_fulfill')!
      // Card: Auto-Fulfill Script - Cost: 2, Type: Tool
      // Effect: "Recurring: Your first Product each turn enters with +1 inventory."
      testCardEffect(card.name, card, () => {
        expect(automationArchitectCardEffects.auto_fulfill).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('optimize_checkout', () => {
    it('should be a passive effect for product revenue', () => {
      const card = findCardByEffect('optimize_checkout')!
      // Card: Optimize Checkout - Cost: 2, Type: Tool
      // Effect: "Products generate +250 revenue per sale."
      testCardEffect(card.name, card, () => {
        expect(automationArchitectCardEffects.optimize_checkout).toBeDefined()
        // Handled in getProductSaleRevenue
      })
    })
  })

  describe('analytics_dashboard', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('analytics_dashboard')!
      // Card: Analytics Dashboard - Cost: 3, Type: Tool
      // Effect: "Recurring: At the start of your turn, if you sold a Product last turn, draw 1 card."
      testCardEffect(card.name, card, () => {
        expect(automationArchitectCardEffects.analytics_dashboard).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('email_automation', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('email_automation')!
      // Card: Email Automation - Cost: 1, Type: Tool
      // Effect: "Recurring: When you sell a Product, gain 1 capital."
      testCardEffect(card.name, card, () => {
        expect(automationArchitectCardEffects.email_automation).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('ab_test', () => {
    it('should draw 2 cards and set up discard choice', () => {
      const card = findCardByEffect('ab_test')!
      // Card: A/B Test Everything - Cost: 1, Type: Action
      // Effect: "Draw 2 cards, then discard 1 card."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        automationArchitectCardEffects.ab_test(G, playerID, card)
        
        // Should draw 2 cards
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
        
        // Should create a discard choice
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
        expect(G.players[playerID].pendingChoices[0].type).toBe('choose_from_drawn_to_discard')
        expect(G.players[playerID].pendingChoices[0].effect).toBe('ab_test_discard')
      })
    })
  })

  describe('scale_systems', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('scale_systems')!
      // Card: Scale Systems - Cost: 3, Type: Tool
      // Effect: "Recurring: Gain 1 capital per Tool you control."
      testCardEffect(card.name, card, () => {
        expect(automationArchitectCardEffects.scale_systems).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('optimize_workflow', () => {
    it('should reduce next card cost by 2', () => {
      const card = findCardByEffect('optimize_workflow')!
      // Card: Optimize Workflow - Cost: 1, Type: Action
      // Effect: "Your next card this turn costs 2 less."
      testCardEffect(card.name, card, () => {
        automationArchitectCardEffects.optimize_workflow(G, playerID)
        
        expect(G.effectContext?.[playerID]?.nextCardDiscount).toBe(2)
      })
    })
  })

  describe('custom_app', () => {
    it('should draw 1 card immediately', () => {
      const card = findCardByEffect('custom_app')!
      // Card: Custom App - Cost: 2, Type: Tool
      // Effect: "When played: Draw 1. Recurring: Draw 1 at the start of your turn."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(new CardBuilder().asAction())
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        automationArchitectCardEffects.custom_app(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
        // Recurring effect handled in processPassiveEffects
      })
    })
  })

  describe('zap_everything', () => {
    it('should gain 2 capital, +1 if 3+ Tools', () => {
      const card = findCardByEffect('zap_everything')!
      // Card: Zap Everything - Cost: 1, Type: Action
      // Effect: "Gain 2 capital. If you control 3+ Tools, gain 3 instead."
      testCardEffect(card.name, card, () => {
        const initialCapital = G.players[playerID].capital
        
        // Test with < 3 tools
        automationArchitectCardEffects.zap_everything(G, playerID)
        expect(G.players[playerID].capital).toBe(initialCapital + 2)
        
        // Test with 3+ tools
        G = new GameStateBuilder()
          .withCapital(initialCapital)
          .withTools(
            new CardBuilder().asTool(),
            new CardBuilder().asTool(),
            new CardBuilder().asTool()
          )
          .build()
        
        automationArchitectCardEffects.zap_everything(G, playerID)
        expect(G.players[playerID].capital).toBe(initialCapital + 3)
      })
    })
  })

  describe('technical_cofounder', () => {
    it('should be a passive effect for Tool costs', () => {
      const card = findCardByEffect('technical_cofounder')!
      // Card: Technical Cofounder - Cost: 3, Type: Employee
      // Effect: "Your Tools cost 1 less."
      testCardEffect(card.name, card, () => {
        expect(automationArchitectCardEffects.technical_cofounder).toBeDefined()
        // Handled in getCardDiscount
      })
    })
  })
}) 
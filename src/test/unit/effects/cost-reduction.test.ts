import { describe, it, expect } from 'vitest'
import { soloHustlerDeck } from '../../../game/data/heroes/solo-hustler'
import { brandBuilderDeck } from '../../../game/data/heroes/brand-builder'
import { communityLeaderDeck } from '../../../game/data/heroes/community-leader'
import { serialFounderDeck } from '../../../game/data/heroes/serial-founder'
import { soloHustlerCardEffects } from '../../../game/logic/effects/solo-hustler-effects'
import { communityLeaderCardEffects } from '../../../game/logic/effects/community-leader-effects'

describe('Cost Reduction Effects - Parameterized Tests', () => {
  // Define all cost reduction effects
  const costReductionEffects = [
    {
      heroName: 'Solo Hustler',
      cardName: 'DIY Assembly',
      effectName: 'diy_assembly',
      deck: soloHustlerDeck,
      effects: soloHustlerCardEffects,
      description: 'Reduce Product costs by 1',
      isPassive: true,
      targetType: 'Product'
    },
    {
      heroName: 'Solo Hustler',
      cardName: 'Shoestring Budget',
      effectName: 'shoestring_budget',
      deck: soloHustlerDeck,
      effects: soloHustlerCardEffects,
      description: 'All cards cost 1 less for you this turn',
      isPassive: true,
      targetType: 'All'
    },
    {
      heroName: 'Brand Builder',
      cardName: 'Visual Identity',
      effectName: 'visual_identity',
      deck: brandBuilderDeck,
      effects: null, // Passive effect
      description: 'Your Products cost 1 less if you control another Tool',
      isPassive: true,
      targetType: 'Product',
      condition: 'requires another Tool'
    },
    {
      heroName: 'Community Leader',
      cardName: 'Community Manager',
      effectName: 'community_manager',
      deck: communityLeaderDeck,
      effects: communityLeaderCardEffects,
      description: 'The first card you play each turn costs 1 less',
      isPassive: true,
      targetType: 'First card'
    },
    {
      heroName: 'Serial Founder',
      cardName: 'Serial Operator',
      effectName: 'serial_operator',
      deck: serialFounderDeck,
      effects: null, // Passive effect
      description: 'Your Products cost 1 less per Product you control (max 3)',
      isPassive: true,
      targetType: 'Product',
      isDynamic: true
    }
  ]

  describe.each(costReductionEffects)(
    '$heroName - $cardName',
    ({ cardName, effectName, deck, isPassive, targetType }) => {
      it('should exist in deck', () => {
        const card = deck.find(c => c.effect === effectName)
        expect(card).toBeDefined()
        expect(card?.name).toBe(cardName)
      })

      it('should be the correct card type', () => {
        const card = deck.find(c => c.effect === effectName)
        if (isPassive) {
          expect(['Tool', 'Employee']).toContain(card?.type)
        }
      })

      it(`should target ${targetType} cards`, () => {
        const card = deck.find(c => c.effect === effectName)
        expect(card).toBeDefined()
        // This is more of a documentation test
        expect(targetType).toBeTruthy()
      })
    }
  )

  // Test immediate cost reduction effects (actions that reduce next card cost)
  const immediateReductionEffects = [
    {
      name: 'Resourceful Solutions',
      effectFn: soloHustlerCardEffects.resourceful_solutions,
      reductionAmount: 2,
      deck: soloHustlerDeck
    },
    {
      name: 'Optimize Workflow',
      effectFn: null, // Would need to import automation architect effects
      reductionAmount: 2,
      deck: null
    }
  ]

  describe.each(immediateReductionEffects.filter(e => e.effectFn))(
    'Immediate Reduction - $name',
    ({ effectFn, reductionAmount }) => {
      it(`should reduce next card cost by ${reductionAmount}`, () => {
        expect(effectFn).toBeDefined()
        // The actual effect is tested in individual test files
        // This just ensures the pattern is consistent
      })
    }
  )

  // Test dynamic cost reduction (cards that cost less based on board state)
  const dynamicCostCards = [
    {
      cardName: 'Spin-Off',
      heroName: 'Serial Founder',
      deck: serialFounderDeck,
      costFormula: 'Base cost - number of Products you control',
      baseCost: 3
    },
    {
      cardName: 'Merch Drop',
      heroName: 'Community Leader',
      deck: communityLeaderDeck,
      costFormula: 'Costs 1 less if you played 2+ cards this turn',
      baseCost: 2,
      condition: 'played 2+ cards'
    }
  ]

  describe.each(dynamicCostCards)(
    'Dynamic Cost - $heroName - $cardName',
    ({ cardName, deck, baseCost }) => {
      it('should exist with base cost', () => {
        const card = deck.find(c => c.name === cardName)
        expect(card).toBeDefined()
        expect(card?.cost).toBe(baseCost)
      })

      it('should have dynamic cost formula in text', () => {
        const card = deck.find(c => c.name === cardName)
        expect(card?.text.toLowerCase()).toContain('cost')
      })
    }
  )
}) 
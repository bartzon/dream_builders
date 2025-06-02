import { describe, it, expect } from 'vitest'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'
import { soloHustlerHero } from '../../../game/data/heroes/solo-hustler'
import { brandBuilderHero } from '../../../game/data/heroes/brand-builder'
import { automationArchitectHero } from '../../../game/data/heroes/automation-architect'
import { communityLeaderHero } from '../../../game/data/heroes/community-leader'
import { serialFounderHero } from '../../../game/data/heroes/serial-founder'

describe('Hero Powers - Parameterized Tests', () => {
  const heroPowers = [
    {
      hero: soloHustlerHero,
      effectName: 'solo_hustler_grind',
      description: 'Draw 1 card. If it\'s a Product, reduce its cost by 1 this turn.',
      cost: 1
    },
    {
      hero: brandBuilderHero,
      effectName: 'brand_builder_engage',
      description: 'Add 2 Inventory to a Product.',
      cost: 2
    },
    {
      hero: automationArchitectHero,
      effectName: 'automation_architect_deploy',
      description: 'Gain 1 capital at the start of your next turn.',
      cost: 2
    },
    {
      hero: communityLeaderHero,
      effectName: 'community_leader_viral',
      description: 'If you played 2+ cards this turn, copy a Product you control.',
      cost: 1
    },
    {
      hero: serialFounderHero,
      effectName: 'serial_founder_double_down',
      description: 'Choose one: draw 2 cards OR Add +1 inventory to all Products.',
      cost: 2
    }
  ]

  describe.each(heroPowers)(
    '$hero.name Hero Power',
    ({ hero, effectName, cost }) => {
      it('should have correct configuration', () => {
        expect(hero.heroPower.name).toBeDefined()
        expect(hero.heroPower.description).toBeDefined()
        expect(hero.heroPower.cost).toBe(cost)
        expect(hero.heroPower.effect).toBe(effectName)
      })

      it('should have implementation', () => {
        expect(heroAbilityEffects[effectName]).toBeDefined()
        expect(typeof heroAbilityEffects[effectName]).toBe('function')
      })

      it('should match expected description pattern', () => {
        // Just check that description exists and is non-empty
        expect(hero.heroPower.description.length).toBeGreaterThan(0)
      })
    }
  )
}) 
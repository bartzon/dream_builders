import type { HeroClass } from '../types';
import { soloHustlerHero } from './heroes/solo-hustler';
import { brandBuilderHero } from './heroes/brand-builder';
import { automationArchitectHero } from './heroes/automation-architect';
import { communityLeaderHero } from './heroes/community-leader';
import { serialFounderHero } from './heroes/serial-founder';

export interface HeroPower {
  name: string;
  description: string;
  cost: number;
  effect: string;
}

export interface Hero extends HeroClass {
  heroPower: HeroPower;
  flavorText: string;
  playstyle: string;
}

// Export all heroes as an array for convenience
export const allHeroes: Hero[] = [
  soloHustlerHero,
  brandBuilderHero,
  automationArchitectHero,
  communityLeaderHero,
  serialFounderHero,
]; 
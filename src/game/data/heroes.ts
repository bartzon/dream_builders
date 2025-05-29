import type { HeroClass } from '../types';
import { 
  soloHustlerDeck, 
  brandBuilderDeck, 
  automationArchitectDeck, 
  communityLeaderDeck, 
  serialFounderDeck 
} from './decks';

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

// New Hero Definitions
export const soloHustlerHero: Hero = {
  id: 'solo_hustler',
  name: 'The Solo Hustler',
  color: 'Red',
  abilityName: 'Grind',
  abilityDescription: 'Draw 1 card. If it\'s a Product, reduce its cost by 1 this turn.',
  starterDeck: soloHustlerDeck,
  flavorText: 'A first-time merchant juggling everything from design to fulfillment.',
  playstyle: 'Fast and scrappy, focused on card draw and early tempo.',
  heroPower: {
    name: 'Grind',
    description: 'Draw 1 card. If it\'s a Product, reduce its cost by 1 this turn.',
    cost: 1,
    effect: 'solo_hustler_grind',
  },
};

export const brandBuilderHero: Hero = {
  id: 'brand_builder',
  name: 'The Brand Builder',
  color: 'White',
  abilityName: 'Engage',
  abilityDescription: 'Give a Product +1 Appeal this turn.',
  starterDeck: brandBuilderDeck,
  flavorText: 'Believes in design, storytelling, and long-term community.',
  playstyle: 'Synergy-focused, slow burn with strong product support.',
  heroPower: {
    name: 'Engage',
    description: 'Give a Product +1 Appeal this turn.',
    cost: 2,
    effect: 'brand_builder_engage',
  },
};

export const automationArchitectHero: Hero = {
  id: 'automation_architect',
  name: 'The Automation Architect',
  color: 'Blue',
  abilityName: 'Deploy Script',
  abilityDescription: 'Gain 1 recurring Capital next turn.',
  starterDeck: automationArchitectDeck,
  flavorText: 'A technical founder building tools that run the business for them.',
  playstyle: 'Builds an engine of passive income over time.',
  heroPower: {
    name: 'Deploy Script',
    description: 'Gain 1 recurring Capital next turn.',
    cost: 2,
    effect: 'automation_architect_deploy',
  },
};

export const communityLeaderHero: Hero = {
  id: 'community_leader',
  name: 'The Community Leader',
  color: 'Green',
  abilityName: 'Go Viral',
  abilityDescription: 'If you played 2+ cards this turn, add a copy of a Product in play to your inventory.',
  starterDeck: communityLeaderDeck,
  flavorText: 'Uses social media and content creation to drive engagement.',
  playstyle: 'High variance, explosive combo turns with viral momentum.',
  heroPower: {
    name: 'Go Viral',
    description: 'If you played 2+ cards this turn, add a copy of a Product in play to your inventory.',
    cost: 1,
    effect: 'community_leader_viral',
  },
};

export const serialFounderHero: Hero = {
  id: 'serial_founder',
  name: 'The Serial Founder',
  color: 'Black',
  abilityName: 'Double Down',
  abilityDescription: 'Choose one: draw a card OR refresh 1 used Product.',
  starterDeck: serialFounderDeck,
  flavorText: 'Veteran merchant running multiple stores and growth strategies.',
  playstyle: 'Balanced and flexible with a powerful mid-game.',
  heroPower: {
    name: 'Double Down',
    description: 'Choose one: draw a card OR refresh 1 used Product.',
    cost: 2,
    effect: 'serial_founder_double_down',
  },
};

// Export all heroes as an array for convenience
export const allHeroes: Hero[] = [
  soloHustlerHero,
  brandBuilderHero,
  automationArchitectHero,
  communityLeaderHero,
  serialFounderHero,
]; 
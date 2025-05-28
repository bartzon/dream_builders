import type { HeroClass } from '../types';
import { marketerDeck, developerDeck, operatorDeck, visionaryDeck } from './decks';

export interface HeroPower {
  name: string;
  description: string;
  cost: number;
  effect: string;
}

export interface Hero extends HeroClass {
  heroPower: HeroPower;
}

export const marketerHero: Hero = {
  id: 'marketer',
  name: 'The Marketer',
  color: 'Red',
  abilityName: 'Launch Campaign',
  abilityDescription: 'Gain 1 capital and draw a card.',
  starterDeck: marketerDeck,
  heroPower: {
    name: 'Launch Campaign',
    description: 'Gain 2 capital and draw a card. All Products generate +$10,000 this turn.',
    cost: 2,
    effect: 'marketer_hero_power',
  },
};

export const developerHero: Hero = {
  id: 'developer',
  name: 'The Developer',
  color: 'Blue',
  abilityName: 'Deploy Code',
  abilityDescription: 'Reduce the cost of the next card you play by 1.',
  starterDeck: developerDeck,
  heroPower: {
    name: 'Deploy Code',
    description: 'The next card you play this turn costs 2 less. Draw a card.',
    cost: 1,
    effect: 'developer_hero_power',
  },
};

export const operatorHero: Hero = {
  id: 'operator',
  name: 'The Operator',
  color: 'Green',
  abilityName: 'Optimize',
  abilityDescription: 'Gain 1 capital and +1 sales this turn.',
  starterDeck: operatorDeck,
  heroPower: {
    name: 'Optimize Operations',
    description: 'Gain 1 capital. All your cards generate +$20,000 this turn.',
    cost: 2,
    effect: 'operator_hero_power',
  },
};

export const visionaryHero: Hero = {
  id: 'visionary',
  name: 'The Visionary',
  color: 'Black',
  abilityName: 'Think Big',
  abilityDescription: 'Draw 2 cards, lose 1 capital.',
  starterDeck: visionaryDeck,
  heroPower: {
    name: 'Think Big',
    description: 'Draw 3 cards, then discard 1. Gain $50,000.',
    cost: 1,
    effect: 'visionary_hero_power',
  },
};

// Export all heroes as an array for convenience
export const allHeroes: Hero[] = [
  marketerHero,
  developerHero,
  operatorHero,
  visionaryHero,
]; 
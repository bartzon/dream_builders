import type { Card } from '../../types';
import type { Hero } from '../heroes';

export const brandBuilderDeck: Card[] = [
  {
    id: 'bb1',
    name: 'Brand Vision',
    cost: 1,
    type: 'Action',
    keywords: ['Draw'],
    text: 'Draw 1 card. If you control a Product, draw 2 instead.',
    effect: 'brand_vision',
    flavor: 'Clarity inspires confidence—and conversions.',
  },
  {
    id: 'bb2',
    name: 'Influencer Collab',
    cost: 3,
    type: 'Action',
    keywords: ['Capital', 'Synergy'],
    text: 'If you control a Product, gain 3 capital.',
    effect: 'influencer_collab',
    flavor: 'They post. You profit.',
  },
  {
    id: 'bb3',
    name: 'Content Calendar',
    cost: 2,
    type: 'Tool',
    keywords: ['Recurring'],
    text: 'Recurring: Add 1 inventory to your lowest-inventory Product.',
    effect: 'content_calendar',
    flavor: 'Schedule it. Forget it. Grow.',
  },
  {
    id: 'bb4',
    name: 'Viral Post',
    cost: 2,
    type: 'Action',
    keywords: ['Combo', 'Capital'],
    text: 'If you played another Action this turn, gain 2 capital. Otherwise, draw 1 card.',
    effect: 'viral_post',
    flavor: 'One share away from breakout.',
  },
  {
    id: 'bb5',
    name: 'Email List',
    cost: 1,
    type: 'Tool',
    keywords: ['Recurring', 'Capital'],
    text: 'Recurring: If you control 2 or more Products, gain 1 capital.',
    effect: 'email_list',
    flavor: 'The most valuable pixel is the inbox.',
  },
  {
    id: 'bb6',
    name: 'Visual Identity',
    cost: 2,
    type: 'Tool',
    keywords: ['Synergy'],
    text: 'Your Products cost 1 less if you control another Tool.',
    effect: 'visual_identity',
    flavor: 'Consistency breeds trust.',
  },
  {
    id: 'bb7',
    name: 'Founder Story',
    cost: 2,
    type: 'Action',
    keywords: ['Draw'],
    text: 'Draw 2 cards. If you control an Employee, draw 3 instead.',
    effect: 'founder_story',
    flavor: 'People don\'t just buy what you do—they buy why you do it.',
  },
  {
    id: 'bb8',
    name: 'Social Proof',
    cost: 1,
    type: 'Action',
    keywords: ['Synergy'],
    text: 'Next time you gain revenue, gain +25% extra.',
    effect: 'social_proof',
    flavor: 'If others love it, maybe they will too.',
  },
  {
    id: 'bb9',
    name: 'UGC Explosion',
    cost: 3,
    type: 'Action',
    keywords: ['Combo', 'Inventory'],
    text: 'Add 3 inventory to each Product you control.',
    effect: 'ugc_explosion',
    flavor: 'Your fans become your funnel.',
  },
  {
    id: 'bb10',
    name: 'Personal Branding',
    cost: 2,
    type: 'Tool',
    keywords: ['Recurring', 'Draw'],
    text: 'Recurring: Draw 1 card if you played an Action last turn.',
    effect: 'personal_branding',
    flavor: 'Be your own best marketing channel.',
  },
];

export const brandBuilderHero: Hero = {
  id: 'brand_builder',
  name: 'The Brand Builder',
  color: 'White',
  image: '/dream_builders/assets/heroes/brand_builder.png',
  starterDeck: brandBuilderDeck,
  flavorText: 'Believes in design, storytelling, and long-term community.',
  playstyle: 'Synergy-focused, slow burn with strong product support.',
  heroPower: {
    name: 'Engage',
    description: 'Add 2 Inventory to a Product.',
    cost: 2,
    effect: 'brand_builder_engage',
  },
};
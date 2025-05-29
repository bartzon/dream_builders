// Game configuration constants
export const GAME_CONFIG = {
  // Win/Loss conditions
  REVENUE_GOAL: 1_000_000,
  
  // Capital
  MAX_CAPITAL: 10,
  CAPITAL_PER_TURN: 1,
  
  // Cards
  STARTING_HAND_SIZE: 3,
  CARDS_DRAWN_PER_TURN: 1,
  
  // Hero abilities
  HERO_ABILITY_COSTS: {
    // Legacy heroes
    marketer: 2,
    developer: 1,
    operator: 2,
    visionary: 1,
    // New heroes
    solo_hustler: 1,
    brand_builder: 2,
    automation_architect: 2,
    community_leader: 1,
    serial_founder: 2,
  },
} as const;

// Card type colors for UI
export const CARD_TYPE_COLORS = {
  Action: 'bg-blue-500',
  Tool: 'bg-purple-500',
  Product: 'bg-green-500',
  Employee: 'bg-orange-500',
} as const;

// Card type border colors for UI
export const CARD_TYPE_BORDER_COLORS = {
  Action: 'border-blue-400',
  Tool: 'border-purple-400',
  Product: 'border-green-400',
  Employee: 'border-orange-400',
} as const;

// Hero colors for UI
export const HERO_COLORS = {
  // Legacy heroes
  marketer: 'bg-red-600',
  developer: 'bg-blue-600',
  operator: 'bg-gray-600',
  visionary: 'bg-purple-600',
  // New heroes
  solo_hustler: 'bg-red-600',      // Red - Fast and scrappy
  brand_builder: 'bg-pink-600',    // Pink/White - Design and community
  automation_architect: 'bg-blue-600', // Blue - Technical
  community_leader: 'bg-green-600',    // Green - Growth and viral
  serial_founder: 'bg-gray-800',       // Black - Experienced and balanced
} as const; 
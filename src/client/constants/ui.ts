// Font size constants (increased by 25% from previous)
export const FONT_SIZES = {
  title: '38px',        // Main title
  heading: '25px',      // Section headings  
  subheading: '23px',   // Subsection headings
  large: '20px',        // Large text (revenue stats)
  body: '19px',         // Regular body text
  medium: '18px',       // Medium text (buttons, card names)
  small: '16px',        // Small text (card details)
  tooltip: '23px',      // Tooltip main text
  tooltipTitle: '25px', // Tooltip titles
  tooltipMeta: '19px'   // Tooltip metadata
} as const

// Common styles
export const CARD_STYLES = {
  padding: '12px',
  borderRadius: '5px',
  minWidth: '120px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  fontWeight: 'bold',
  fontSize: FONT_SIZES.medium
} as const

export const BUTTON_STYLES = {
  padding: '15px',
  border: 'none',
  borderRadius: '5px',
  fontSize: FONT_SIZES.medium,
  fontWeight: 'bold'
} as const

// Color palette
export const COLORS = {
  // Card type colors
  product: '#059669',
  productDark: '#065f46',
  tool: '#7c3aed',
  toolBorder: '#8b5cf6',
  action: '#dc2626',
  employee: '#2563eb',
  employeeBorder: '#3b82f6',
  default: '#6b7280',
  
  // UI colors
  primary: '#4f46e5',
  primaryDark: '#1d4ed8',
  success: '#10b981',
  successBorder: '#10b981',
  successLight: '#6ee7b7',
  warning: '#fbbf24',
  warningBorder: '#fbbf24',
  warningLight: '#fcd34d',
  danger: '#dc2626',
  dangerBorder: '#ef4444',
  
  // Background colors
  bgDark: '#0f172a',
  bgMedium: '#1e293b',
  bgLight: '#374151',
  
  // Text colors
  textLight: '#e2e8f0',
  textMuted: '#94a3b8',
  textPurple: '#a78bfa',
  textNeutral: '#999',
  
  // Neutral colors
  disabled: '#666',
  black: '#000',
  white: '#fff'
} as const 

// Hero ability costs
export const HERO_ABILITY_COSTS: Record<string, number> = {
  marketer: 2,
  developer: 1,
  operator: 2,
  visionary: 1,
  Marketer: 2,
  Developer: 1,
  Operator: 2,
  Visionary: 1,
  solo_hustler: 1,
  brand_builder: 2,
  automation_architect: 2,
  community_leader: 1,
  serial_founder: 2,
} as const

// Hero power descriptions
export const HERO_POWER_INFO: Record<string, { name: string, description: string }> = {
  marketer: { name: 'Marketing Blitz', description: 'Gain 2 capital, draw 1 card, all Products +$10k this turn' },
  developer: { name: 'Code Sprint', description: 'Next card costs 2 less, draw 1 card' },
  operator: { name: 'Operational Excellence', description: 'Gain 1 capital, all cards +$20k revenue this turn' },
  visionary: { name: 'Visionary Insight', description: 'Draw 3 cards, discard 1, gain $50k' },
  Marketer: { name: 'Marketing Blitz', description: 'Gain 2 capital, draw 1 card, all Products +$10k this turn' },
  Developer: { name: 'Code Sprint', description: 'Next card costs 2 less, draw 1 card' },
  Operator: { name: 'Operational Excellence', description: 'Gain 1 capital, all cards +$20k revenue this turn' },
  Visionary: { name: 'Visionary Insight', description: 'Draw 3 cards, discard 1, gain $50k' },
  solo_hustler: { name: 'Grind', description: 'Draw 1 card. If it\'s a Product, reduce its cost by 1 this turn' },
  brand_builder: { name: 'Engage', description: 'Give a Product +1 Appeal this turn' },
  automation_architect: { name: 'Deploy Script', description: 'Gain 1 recurring Capital next turn' },
  community_leader: { name: 'Go Viral', description: 'If you played 2+ cards this turn, add a copy of a Product in play to your inventory' },
  serial_founder: { name: 'Double Down', description: 'Choose one: draw a card OR refresh 1 used Product' },
} as const

// Game constants
export const REVENUE_GOAL = 1_000_000

// Card type color mapping
export const CARD_TYPE_COLORS: Record<string, string> = {
  product: COLORS.product,
  tool: COLORS.tool,
  action: COLORS.action,
  employee: COLORS.employee,
  default: COLORS.default,
} as const 
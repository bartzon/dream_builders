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

// Card type color mapping
export const CARD_TYPE_COLORS: Record<string, string> = {
  product: COLORS.product,
  tool: COLORS.tool,
  action: COLORS.action,
  employee: COLORS.employee,
  default: COLORS.default,
} as const 
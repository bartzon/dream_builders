import React from 'react'
// import { FONT_SIZES, CARD_TYPE_COLORS } from '../../../constants/ui' // Removed
import type { ClientCard } from '../../../types/game'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'

interface CardTooltipProps {
  card?: ClientCard
  visible: boolean
  displayModeOverride?: CardDisplayMode
  revenueBonus?: number
  // x: number // Removed
  // y: number // Removed
}

export const CardTooltip = React.memo(({ card, visible, displayModeOverride, revenueBonus = 0 }: CardTooltipProps) => {
  if (!visible || !card) return null

  // const typeColor = CARD_TYPE_COLORS[card.type.toLowerCase()] || CARD_TYPE_COLORS.default // Removed

  return (
    <div
      style={{
        // position: 'fixed', // Removed, will be positioned by parent
        // left: x + 10, // Removed
        // top: y - 10, // Removed
        zIndex: 1000, // May or may not be needed depending on stacking context in sidebar
        // boxShadow: '0 10px 25px rgba(0,0,0,0.5)', // UniversalCard might handle this, or sidebar can
        pointerEvents: 'none',
      }}
    >
      <UniversalCard
        card={card}
        displayMode={displayModeOverride || 'tooltip'}
        forceShowArt={true}
        revenueBonus={revenueBonus}
      />
    </div>
  )
})

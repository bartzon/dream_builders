import React from 'react'
import type { ClientCard } from '../../../types/game'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'

interface CardTooltipProps {
  card?: ClientCard
  visible: boolean
  displayModeOverride?: CardDisplayMode
  revenueBonus?: number
}

export const CardTooltip = React.memo(({ card, visible, displayModeOverride, revenueBonus = 0 }: CardTooltipProps) => {
  if (!visible || !card) return null

  // const typeColor = CARD_TYPE_COLORS[card.type.toLowerCase()] || CARD_TYPE_COLORS.default // Removed

  return (
    <div
      style={{
        zIndex: 1000, // May or may not be needed depending on stacking context in sidebar
        pointerEvents: 'none',
      }}
    >
      <UniversalCard
        card={card}
        displayMode={displayModeOverride || 'tooltip'}
        revenueBonus={revenueBonus}
      />
    </div>
  )
})

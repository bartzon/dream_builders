import React from 'react'
import { FONT_SIZES } from '../../../constants/ui'
import type { EffectContextUI } from '../../../types/game'
import { formatCurrency } from '../../../utils/formatHelpers'
import { GAME_CONFIG } from '../../../../game/constants'

interface GameHeaderProps {
  heroName: string
  capital: number
  turn: number
  deckSize: number
  revenue: number
  effectContext: EffectContextUI
  hasShoestringBudget: boolean
}

export const GameHeader = React.memo(({
  capital,
  turn,
  deckSize,
  revenue,
  effectContext,
  hasShoestringBudget
}: GameHeaderProps) => {
  const revenueGoal = GAME_CONFIG.REVENUE_GOAL
  const revenueProgress = Math.min(revenue / revenueGoal * 100, 100)
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: FONT_SIZES.body }}>
        <div>
          <strong style={{ color: '#10b981' }}>Capital:</strong> {capital} / 10
        </div>
        <div>
          <strong style={{ color: '#3b82f6' }}>Revenue:</strong> {formatCurrency(revenue)} / {formatCurrency(revenueGoal)}
          <span style={{ 
            marginLeft: '10px', 
            fontSize: FONT_SIZES.small, 
            color: revenueProgress >= 100 ? '#10b981' : '#6b7280' 
          }}>
            ({revenueProgress.toFixed(0)}%)
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: FONT_SIZES.body }}>
        <div>
          <strong style={{ color: '#8b5cf6' }}>Turn:</strong> {turn}
        </div>
        <div>
          <strong style={{ color: '#ec4899' }}>Cards Left In Deck:</strong> {deckSize}
        </div>
      </div>

      {/* Cost Reductions */}
      <div style={{ fontSize: FONT_SIZES.small, color: '#10b981', fontWeight: 'bold' }}>
        {/* Shoestring Budget */}
        {hasShoestringBudget && (!effectContext?.cardsPlayedThisTurn || effectContext.cardsPlayedThisTurn === 0) && (
          <div>First card free!</div>
        )}
      </div>
    </div>
  )
}) 
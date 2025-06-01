import React from 'react'
import { FONT_SIZES } from '../../../constants/ui'
import type { EffectContextUI } from '../../../types/game'

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
  heroName,
  capital,
  turn,
  deckSize,
  revenue,
  effectContext,
  hasShoestringBudget
}: GameHeaderProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: FONT_SIZES.body }}>
        <div>
          <strong style={{ color: '#f59e0b' }}>Hero:</strong> {heroName}
        </div>
        <div>
          <strong style={{ color: '#10b981' }}>Capital:</strong> {capital} / 10
        </div>
        <div>
          <strong style={{ color: '#3b82f6' }}>Revenue:</strong> ${revenue}
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
        {/* Meme Magic */}
        {effectContext.cardsPlayedThisTurn && effectContext.cardsPlayedThisTurn >= 2 && (
          <div>Meme Magic -$1</div>
        )}
        
        {/* Shoestring Budget */}
        {hasShoestringBudget && (!effectContext?.cardsPlayedThisTurn || effectContext.cardsPlayedThisTurn === 0) && (
          <div>First card free!</div>
        )}
        
        {/* Merch Drop */}
        {effectContext.productCardsPlayedThisTurn && effectContext.productCardsPlayedThisTurn >= 2 && (
          <div>Merch Drop -$1</div>
        )}
      </div>
    </div>
  )
}) 
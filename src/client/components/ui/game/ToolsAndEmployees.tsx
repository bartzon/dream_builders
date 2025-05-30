import React from 'react'
import { FONT_SIZES, COLORS } from '../../../constants/ui'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'
import type { ClientCard, EffectContextUI } from '../../../types/game'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'

interface ToolsAndEmployeesProps {
  cards: ClientCard[]
  effectContext: EffectContextUI
  affectedCardIds: Set<string>
  onShowTooltip: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip: () => void
}

export const ToolsAndEmployees = React.memo(({
  cards,
  effectContext,
  affectedCardIds,
  onShowTooltip,
  onHideTooltip
}: ToolsAndEmployeesProps) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ fontSize: FONT_SIZES.subheading }}>
        Your Tools & Employees ({cards.length})
      </h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {cards.length === 0 ? (
          <EmptyState message="No tools or employees" />
        ) : (
          cards.map((card, i) => {
            const isAffected = card.id ? affectedCardIds.has(card.id) : false;
            
            const bonuses: BonusInfo[] = [];
            if (card.effect === 'delayed_inventory_boost' && effectContext.delayedInventoryBoostTurns) {
              bonuses.push({
                type: 'delayed',
                value: effectContext.delayedInventoryBoostTurns,
                label: `${effectContext.delayedInventoryBoostTurns} turns`
              });
            }
            if (card.text?.includes('Recurring:')) {
              bonuses.push({
                type: 'delayed',
                value: '♻️',
                label: 'Recurring'
              });
            }
            if (card.isActive === false) {
                bonuses.push({ type: 'delayed', value: '😴', label: 'Inactive' });
            }

            return (
              <div key={`${card.id || 'tool-employee'}-${i}`} style={{position: 'relative'}}>
                <UniversalCard
                  card={card}
                  displayMode={'board' as CardDisplayMode}
                  isClickable={false}
                  isAffected={isAffected}
                  showBonuses={false}
                  onMouseEnterCard={(e) => onShowTooltip(card, e)}
                  onMouseLeaveCard={onHideTooltip}
                  onMouseMoveCard={(e) => onShowTooltip(card, e)}
                />
                {bonuses.length > 0 && <BonusIndicator bonuses={bonuses} position="top-right" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  )
})

// Empty state component
const EmptyState = ({ message }: { message: string }) => (
  <div style={{ 
    padding: '20px', 
    border: '2px dashed #666', 
    borderRadius: '5px',
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body
  }}>
    {message}
  </div>
)
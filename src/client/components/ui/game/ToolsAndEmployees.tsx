import React from 'react'
import { FONT_SIZES } from '../../../constants/ui'
import { GameCard } from './GameCard'
import type { BonusInfo } from './BonusIndicator'
import type { ClientCard, EffectContextUI } from '../../../types/game'

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h4 style={{ 
        fontSize: FONT_SIZES.subheading, 
        marginTop: 0,
        marginBottom: '15px',
        flexShrink: 0
      }}>
        Tools & Employees
      </h4>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        marginBottom: 0,
        flex: 1,
        alignContent: 'flex-start'
      }}>
        {
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
              <GameCard
                key={`${card.id || 'tool-employee'}-${i}`}
                card={card}
                displayMode="board"
                isAffected={isAffected}
                showBonuses={true}
                bonuses={bonuses}
                onShowTooltip={onShowTooltip}
                onHideTooltip={onHideTooltip}
                enableHover={true}
              />
            );
          }
        )}
      </div>
    </div>
  )
})
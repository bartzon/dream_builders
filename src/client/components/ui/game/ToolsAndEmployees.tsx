import React from 'react'
import { FONT_SIZES, CARD_STYLES } from '../../../constants/ui'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'
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
            return (
              <ToolEmployeeCard
                key={`${card.id || 'tool-employee'}-${i}`}
                card={card}
                effectContext={effectContext}
                isAffected={isAffected}
                onMouseEnter={(e) => onShowTooltip(card, e)}
                onMouseLeave={onHideTooltip}
                onMouseMove={(e) => onShowTooltip(card, e)}
              />
            )
          })
        )}
      </div>
    </div>
  )
})

// Card component for tools and employees
const ToolEmployeeCard = ({ 
  card, 
  effectContext, 
  isAffected,
  onMouseEnter, 
  onMouseLeave, 
  onMouseMove 
}: {
  card: ClientCard
  effectContext: EffectContextUI
  isAffected: boolean
  onMouseEnter: (e: React.MouseEvent) => void
  onMouseLeave: () => void
  onMouseMove: (e: React.MouseEvent) => void
}) => {
  // Check for delayed effects to display
  const bonuses: BonusInfo[] = []
  
  // Check if this is Fulfillment App Integration with active delayed inventory
  if (card.effect === 'delayed_inventory_boost' && effectContext.delayedInventoryBoostTurns) {
    bonuses.push({
      type: 'delayed',
      value: effectContext.delayedInventoryBoostTurns,
      label: `${effectContext.delayedInventoryBoostTurns} turns`
    })
  }
  
  // Check for recurring effects in card text
  if (card.text?.includes('Recurring:')) {
    bonuses.push({
      type: 'delayed',
      value: '♻️',
      label: 'Recurring'
    })
  }

  const baseStyle: React.CSSProperties = {
    ...CARD_STYLES,
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.3s ease-out',
  };

  const affectedStyle: React.CSSProperties = isAffected 
    ? { boxShadow: '0 0 12px 4px rgba(129, 230, 217, 0.8)' }
    : {};

  return (
    <div 
      style={{
        ...baseStyle,
        background: card.type === 'Employee' ? '#2563eb' : '#7c3aed',
        border: card.type === 'Employee' ? '1px solid #3b82f6' : '1px solid #8b5cf6',
        ...affectedStyle
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <BonusIndicator bonuses={bonuses} position="top-right" />
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '5px', 
        color: 'white', 
        fontSize: FONT_SIZES.medium 
      }}>
        {card.name}
      </div>
      <div style={{ 
        fontSize: FONT_SIZES.body, 
        marginBottom: '3px', 
        color: '#e2e8f0' 
      }}>
        Cost: {card.cost}
      </div>
      <div style={{ 
        fontSize: FONT_SIZES.small, 
        color: '#a78bfa' 
      }}>
        {card.type}
      </div>
      {card.isActive !== undefined && (
        <div style={{ 
          fontSize: FONT_SIZES.medium, 
          color: card.isActive ? '#10b981' : '#6b7280',
          fontWeight: 'bold'
        }}>
          {card.isActive ? 'Active' : 'Inactive'}
        </div>
      )}
    </div>
  )
}

// Empty state component
const EmptyState = ({ message }: { message: string }) => (
  <div style={{ 
    padding: '20px', 
    border: '2px dashed #666', 
    borderRadius: '5px',
    color: '#999',
    fontSize: FONT_SIZES.body
  }}>
    {message}
  </div>
)
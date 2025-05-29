import React from 'react'
import { FONT_SIZES, CARD_TYPE_COLORS } from '../../../constants/ui'
import type { ClientCard } from '../../../types/game'

interface CardTooltipProps {
  card?: ClientCard
  visible: boolean
  x: number
  y: number
}

export const CardTooltip = React.memo(({ card, visible, x, y }: CardTooltipProps) => {
  if (!visible || !card) return null

  const typeColor = CARD_TYPE_COLORS[card.type.toLowerCase()] || CARD_TYPE_COLORS.default

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 10,
        top: y - 10,
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
        border: '2px solid #374151',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: FONT_SIZES.tooltip,
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        pointerEvents: 'none'
      }}
    >
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #374151', 
        paddingBottom: '8px', 
        marginBottom: '8px' 
      }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: FONT_SIZES.tooltipTitle,
          color: '#f8fafc'
        }}>
          {card.name}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px'
        }}>
          <span style={{ 
            background: typeColor,
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: FONT_SIZES.tooltipMeta,
            fontWeight: 'bold'
          }}>
            {card.type}
          </span>
          <span style={{ 
            background: '#fbbf24',
            color: '#000',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: FONT_SIZES.tooltipMeta,
            fontWeight: 'bold'
          }}>
            Cost: {card.cost}
          </span>
        </div>
      </div>

      {/* Keywords */}
      {card.keywords && card.keywords.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: FONT_SIZES.tooltipMeta, color: '#94a3b8', marginBottom: '4px' }}>Keywords:</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {card.keywords.map((keyword, i) => (
              <span key={i} style={{
                background: '#4338ca',
                color: 'white',
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: FONT_SIZES.medium
              }}>
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {card.text && (
        <div style={{ 
          marginBottom: '8px',
          lineHeight: '1.4',
          color: '#e2e8f0'
        }}>
          {card.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: FONT_SIZES.tooltipMeta }}>
        {card.resilience !== undefined && (
          <div style={{ color: '#10b981' }}>
            <strong>Resilience:</strong> {card.resilience}
          </div>
        )}
        {card.inventory !== undefined && (
          <div style={{ color: '#3b82f6' }}>
            <strong>Inventory:</strong> {card.inventory}
          </div>
        )}
        {card.revenuePerSale !== undefined && (
          <div style={{ color: '#059669' }}>
            <strong>Revenue/Sale:</strong> {card.revenuePerSale}
          </div>
        )}
        {card.overheadCost !== undefined && (
          <div style={{ color: '#dc2626' }}>
            <strong>Overhead:</strong> {card.overheadCost}
          </div>
        )}
        {card.appeal !== undefined && (
          <div style={{ color: '#8b5cf6' }}>
            <strong>Appeal:</strong> {card.appeal}
          </div>
        )}
        {card.isActive !== undefined && (
          <div style={{ color: card.isActive ? '#10b981' : '#6b7280' }}>
            <strong>Status:</strong> {card.isActive ? 'Active' : 'Inactive'}
          </div>
        )}
      </div>

      {/* Synergy Condition */}
      {card.synergyCondition && (
        <div style={{ 
          marginTop: '8px',
          padding: '6px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '4px',
          fontSize: FONT_SIZES.tooltipMeta,
          color: '#c4b5fd'
        }}>
          <strong>Synergy:</strong> {card.synergyCondition}
        </div>
      )}

      {/* Flavor Text - Always at the bottom */}
      {card.flavor && (
        <div style={{ 
          marginTop: '12px',
          paddingTop: '8px',
          borderTop: '1px solid #374151',
          lineHeight: '1.4',
          color: '#94a3b8',
          fontStyle: 'italic',
          fontSize: FONT_SIZES.medium
        }}>
          "{card.flavor}"
        </div>
      )}
    </div>
  )
}) 
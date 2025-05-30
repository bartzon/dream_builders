import React from 'react'
import { FONT_SIZES, CARD_STYLES } from '../../../constants/ui'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'
import type { ClientCard, PendingChoice, EffectContextUI } from '../../../types/game'

interface ProductsSectionProps {
  products: ClientCard[]
  pendingChoice?: PendingChoice
  effectContext: EffectContextUI
  onMakeChoice: (index: number) => void
  onShowTooltip: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip: () => void
}

export const ProductsSection = React.memo(({
  products,
  pendingChoice,
  effectContext,
  onMakeChoice,
  onShowTooltip,
  onHideTooltip
}: ProductsSectionProps) => {
  const renderProduct = (product: ClientCard, index: number) => {
    const isDestroyMode = pendingChoice?.type === 'destroy_product'
    const canDestroy = isDestroyMode && pendingChoice?.cards?.some(c => c.id === product.id)
    
    const isChooseMode = pendingChoice?.type === 'choose_card'
    const canChoose = isChooseMode && pendingChoice?.cards?.some(c => c.id === product.id)
    
    // Special handling for add_inventory_if_empty effect - show all products
    const isReorderNotification = pendingChoice?.effect === 'add_inventory_if_empty'
    const meetsReorderCriteria = product.inventory === 0
    
    const isClickable = canDestroy || canChoose
    const isDimmed = (isChooseMode && !canChoose) || (isReorderNotification && !meetsReorderCriteria)
    
    const handleClick = () => {
      if (isClickable && pendingChoice?.cards) {
        const choiceIndex = pendingChoice.cards.findIndex(c => c.id === product.id)
        if (choiceIndex >= 0) {
          onMakeChoice(choiceIndex)
        }
      }
    }
    
    // Check for bonuses on this product
    const bonuses: BonusInfo[] = []
    if (product.id && effectContext.productRevenueBoosts?.[product.id]) {
      bonuses.push({
        type: 'revenue',
        value: effectContext.productRevenueBoosts[product.id]
      })
    }
    
    return (
      <div 
        key={`${product.id || 'product'}-${index}`}
        style={{
          ...CARD_STYLES,
          background: 
            (isDestroyMode && canDestroy) ? '#dc2626' : 
            (isChooseMode && canChoose) ? '#059669' :
            isDimmed ? '#4b5563' :
            '#065f46',
          border: 
            (isDestroyMode && canDestroy) ? '2px solid #ef4444' : 
            (isChooseMode && canChoose) ? '2px solid #10b981' :
            isDimmed ? '1px solid #6b7280' :
            '1px solid #059669',
          cursor: isClickable ? 'pointer' : 'default',
          position: 'relative',
          opacity: isDimmed ? 0.6 : 1
        }}
        onMouseEnter={(e) => onShowTooltip(product, e)}
        onMouseLeave={onHideTooltip}
        onMouseMove={(e) => onShowTooltip(product, e)}
        onClick={handleClick}
      >
        <BonusIndicator bonuses={bonuses} position="top-right" />
        
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '5px', 
          fontSize: FONT_SIZES.medium,
          color: isDimmed ? '#9ca3af' : 'white'
        }}>
          {product.name}
        </div>
        <div style={{ 
          fontSize: FONT_SIZES.body, 
          marginBottom: '3px',
          color: isDimmed ? '#9ca3af' : 'white'
        }}>
          Cost: {product.cost}
        </div>
        {product.inventory !== undefined && (
          <div style={{ 
            fontSize: FONT_SIZES.body, 
            marginBottom: '8px',
            color: isDimmed ? '#9ca3af' : 'white'
          }}>
            Stock: {product.inventory}
          </div>
        )}
        
        {isDestroyMode && canDestroy && (
          <ActionLabel text="DESTROY" color="#fbbf24" />
        )}
        
        {isChooseMode && canChoose && !isReorderNotification && (
          <ActionLabel text="BOOST" color="#10b981" textColor="#fff" />
        )}
        
        {isReorderNotification && meetsReorderCriteria && (
          <ActionLabel text="RESTOCK +3" color="#10b981" textColor="#fff" />
        )}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ fontSize: FONT_SIZES.subheading }}>
        Your Products ({products.length})
        {pendingChoice?.type === 'destroy_product' && (
          <span style={{ 
            color: '#ef4444', 
            marginLeft: '10px',
            fontSize: FONT_SIZES.body 
          }}>
            - Click a product to destroy it
          </span>
        )}
        {pendingChoice?.type === 'choose_card' && (
          <span style={{ 
            color: '#10b981', 
            marginLeft: '10px',
            fontSize: FONT_SIZES.body 
          }}>
            - {pendingChoice?.effect === 'add_inventory_if_empty' 
                ? 'Click a product with 0 inventory to add +3' 
                : pendingChoice?.effect === 'multi_product_inventory_boost'
                ? `Choose up to ${3 - (effectContext.warehouseExpansionCount || 0)} more product${3 - (effectContext.warehouseExpansionCount || 0) === 1 ? '' : 's'} (or End Turn to finish)`
                : 'Click a product to boost its inventory'}
          </span>
        )}
      </h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {products.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            border: '2px dashed #666', 
            borderRadius: '5px',
            color: '#999',
            fontSize: FONT_SIZES.body
          }}>
            No products
          </div>
        ) : (
          products.map(renderProduct)
        )}
      </div>
    </div>
  )
})

// Helper component for action labels
const ActionLabel = ({ text, color, textColor = '#000' }: { 
  text: string
  color: string
  textColor?: string 
}) => (
  <div style={{
    position: 'absolute',
    bottom: '5px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: color,
    color: textColor,
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold'
  }}>
    {text}
  </div>
) 
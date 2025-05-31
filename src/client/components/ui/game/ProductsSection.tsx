import React from 'react'
import type { ClientCard, EffectContextUI } from '../../../types/game'
import { FONT_SIZES } from '../../../constants/ui'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'
import { calculateProductRevenue } from "../../../utils/revenue-helpers"

interface ProductsSectionProps {
  products: ClientCard[]
  tools: ClientCard[]
  effectContext: EffectContextUI
  affectedCardIds: Set<string>
  onShowTooltip: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip: () => void
}

export const ProductsSection = React.memo(({
  products,
  tools,
  effectContext,
  affectedCardIds,
  onShowTooltip,
  onHideTooltip
}: ProductsSectionProps) => {
  // Check if Optimize Checkout tool is active for global bonus
  const optimizeCheckoutTools = tools.filter(tool => tool.effect === 'optimize_checkout')
  
  const renderProduct = (product: ClientCard, index: number) => {
    const bonuses: BonusInfo[] = []
    
    // Get Optimize Checkout tools that match this product's tier (based on cost)
    const matchingOptimizeTools = optimizeCheckoutTools.filter(tool => 
      tool.cost === product.cost
    )
    
    // Calculate total revenue using the helper
    const totalRevenue = calculateProductRevenue(
      product,
      matchingOptimizeTools,
      effectContext
    )
    
    // Calculate bonus amount (revenue minus base)
    const revenueBonus = totalRevenue - (product.revenuePerSale || 0)
    
    // Add bonus indicators
    if (product.id && effectContext.productRevenueBoosts?.[product.id]) {
      bonuses.push({
        type: 'revenue',
        value: effectContext.productRevenueBoosts[product.id]
      })
    }
    
    if (matchingOptimizeTools.length > 0) {
      bonuses.push({
        type: 'revenue',
        value: 1000 * matchingOptimizeTools.length,
        label: 'Optimize Checkout'
      })
    }
    
    if (product.isActive === false) {
        bonuses.push({ type: 'delayed', value: '😴', label: 'Inactive' })
    }
    
    const isAffected = product.id ? affectedCardIds.has(product.id) : false

    return (
      <div key={`${product.id || 'product'}-${index}`} style={{position: 'relative'}}>
        <UniversalCard
          card={product}
          displayMode={'board' as CardDisplayMode}
          isClickable={false}
          isAffected={isAffected}
          isSelected={false}
          showBonuses={true}
          revenueBonus={revenueBonus}
          onMouseEnterCard={(e) => onShowTooltip(product, e)}
          onMouseLeaveCard={onHideTooltip}
          onMouseMoveCard={(e) => onShowTooltip(product, e)}
        />
        {bonuses.length > 0 && <BonusIndicator bonuses={bonuses} position="bottom-left" />}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ fontSize: FONT_SIZES.subheading }}>
        Your Products ({products.length})
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
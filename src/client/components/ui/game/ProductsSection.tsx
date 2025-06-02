import React from 'react'
import type { ClientCard, EffectContextUI } from '../../../types/game'
import { FONT_SIZES } from '../../../constants/ui'
import { GameCard } from './GameCard'
import type { BonusInfo } from './BonusIndicator'
import { calculateProductRevenue } from "../../../utils/revenue-helpers"
import { SparkleEffect } from './SparkleEffect'

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
    const isRecentlySold = product.id && effectContext.recentlySoldProductIds?.includes(product.id)
    const hasNoInventory = product.inventory === 0

    return (
      <div 
        key={`${product.id || 'product'}-${index}`} 
        style={{ 
          position: 'relative',
          borderRadius: '8px',
          boxShadow: isRecentlySold ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none',
          animation: isRecentlySold ? 'pulse-glow 2s ease-out' : 'none'
        }}
      >
        <GameCard
          card={product}
          displayMode="board"
          isAffected={isAffected}
          showBonuses={true}
          revenueBonus={revenueBonus}
          bonuses={bonuses}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
          enableHover={true}
          style={{
            opacity: hasNoInventory ? 0.6 : 1,
            filter: hasNoInventory ? 'grayscale(50%)' : 'none'
          }}
        />
        {isRecentlySold && <SparkleEffect />}
        {hasNoInventory && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#ef4444',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap'
          }}>
            NO INVENTORY
          </div>
        )}
        {isRecentlySold && (
          <style>{`
            @keyframes pulse-glow {
              0% {
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
              }
              50% {
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);
              }
              100% {
                box-shadow: 0 0 20px rgba(255, 215, 0, 0);
              }
            }
          `}</style>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h4 style={{ 
        fontSize: FONT_SIZES.subheading, 
        marginTop: 0,
        marginBottom: '15px',
        flexShrink: 0
      }}>
        Products
      </h4>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        marginBottom: 0,
        flex: 1,
        alignContent: 'flex-start'
      }}>
        {products.map(renderProduct)}
      </div>
    </div>
  )
}) 
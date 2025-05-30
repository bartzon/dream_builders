import React from 'react'
import type { ClientCard, PendingChoice, EffectContextUI } from '../../../types/game'
import { FONT_SIZES, COLORS } from '../../../constants/ui'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'

interface ProductsSectionProps {
  products: ClientCard[]
  pendingChoice?: PendingChoice
  effectContext: EffectContextUI
  affectedCardIds: Set<string>
  onMakeChoice: (index: number) => void
  onShowTooltip: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip: () => void
}

export const ProductsSection = React.memo(({
  products,
  pendingChoice,
  effectContext,
  affectedCardIds,
  onMakeChoice,
  onShowTooltip,
  onHideTooltip
}: ProductsSectionProps) => {
  const renderProduct = (product: ClientCard, index: number) => {
    const isDestroyMode = pendingChoice?.type === 'destroy_product'
    const productInChoiceList = pendingChoice?.cards?.find(c => c.id === product.id)
    const canDestroy = isDestroyMode && !!productInChoiceList
    
    const isChooseMode = pendingChoice?.type === 'choose_card'
    const canChoose = isChooseMode && !!productInChoiceList
    
    const isReorderNotification = pendingChoice?.effect === 'add_inventory_if_empty'
    const meetsReorderCriteria = product.inventory === 0
    
    let isClickableForChoice = false
    if (isDestroyMode && canDestroy) isClickableForChoice = true
    if (isChooseMode && canChoose && (!isReorderNotification || meetsReorderCriteria)) isClickableForChoice = true

    const handleClick = () => {
      if (isClickableForChoice && pendingChoice?.cards) {
        const choiceIndex = pendingChoice.cards.findIndex(c => c.id === product.id)
        if (choiceIndex >= 0) {
          onMakeChoice(choiceIndex)
        }
      }
    }
    
    const bonuses: BonusInfo[] = []
    if (product.id && effectContext.productRevenueBoosts?.[product.id]) {
      bonuses.push({
        type: 'revenue',
        value: effectContext.productRevenueBoosts[product.id]
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
          isClickable={isClickableForChoice}
          onClick={handleClick}
          isAffected={isAffected}
          isSelected={isClickableForChoice || (isDestroyMode && canDestroy) || (isChooseMode && canChoose && (!isReorderNotification || meetsReorderCriteria))}
          showBonuses={true}
          onMouseEnterCard={(e) => onShowTooltip(product, e)}
          onMouseLeaveCard={onHideTooltip}
          onMouseMoveCard={(e) => onShowTooltip(product, e)}
        />
        {isDestroyMode && canDestroy && (
          <ActionLabel text="DESTROY" color={COLORS.danger} />
        )}
        {isChooseMode && canChoose && !isReorderNotification && (
          <ActionLabel text="BOOST" color={COLORS.success} textColor={COLORS.white} />
        )}
        {isReorderNotification && meetsReorderCriteria && (
          <ActionLabel text="RESTOCK +3" color={COLORS.success} textColor={COLORS.white} />
        )}
        {bonuses.length > 0 && <BonusIndicator bonuses={bonuses} position="bottom-left" />}
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
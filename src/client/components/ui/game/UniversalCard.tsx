import React from 'react';
import type { ClientCard } from '../../../types/game';
import { FONT_SIZES, CARD_STYLES, COLORS, CARD_TYPE_COLORS } from '../../../constants/ui';
import { CostDisplay } from '../CostDisplay';
import { BonusIndicator, type BonusInfo } from './BonusIndicator';

export type CardDisplayMode = 'hand' | 'board' | 'choiceModal' | 'tooltip';

interface UniversalCardProps {
  card: ClientCard;
  displayMode?: CardDisplayMode;
  onClick?: () => void;
  isClickable?: boolean;
  isSelected?: boolean; // For multi-selection UIs or specific highlights
  isAffected?: boolean; // For temporary glow effect
  costInfo?: { originalCost: number; discount: number; finalCost: number };
  showBonuses?: boolean;
  // Add specific mouse handlers if they need to be passed down
  onMouseEnterCard?: (e: React.MouseEvent) => void;
  onMouseLeaveCard?: (e: React.MouseEvent) => void;
  onMouseMoveCard?: (e: React.MouseEvent) => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = React.memo(({
  card,
  displayMode = 'board',
  onClick,
  isClickable = false,
  isSelected = false,
  isAffected = false,
  costInfo,
  showBonuses = true, // Show by default, can be turned off for very compact views
  onMouseEnterCard,
  onMouseLeaveCard,
  onMouseMoveCard,
}) => {
  const cardTypeColor = CARD_TYPE_COLORS[card.type.toLowerCase()] || COLORS.default;
  const defaultBoxShadow = '0 2px 4px rgba(0,0,0,0.1)';

  const isCompact = displayMode === 'choiceModal' || displayMode === 'tooltip';
  const finalCostInfo = costInfo || { originalCost: card.cost, discount: 0, finalCost: card.cost };

  const containerStyle: React.CSSProperties = {
    ...CARD_STYLES,
    width: isCompact ? '130px' : (displayMode === 'hand' ? '150px' : '160px'),
    minHeight: isCompact ? '80px' : (displayMode === 'hand' ? '100px' : '110px'),
    padding: isCompact ? '8px' : '10px',
    background: `linear-gradient(to bottom, ${cardTypeColor} 15%, ${COLORS.bgMedium} 100%)`,
    border: `2px solid ${isSelected ? COLORS.warning : (isAffected ? COLORS.warningLight : cardTypeColor)}`,
    color: COLORS.white,
    textAlign: 'left',
    cursor: isClickable && onClick ? 'pointer' : 'default',
    boxShadow: isAffected ? `0 0 12px 4px ${COLORS.warningLight}` : (isSelected ? `0 0 10px 3px ${COLORS.warning}` : defaultBoxShadow),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: CARD_STYLES.transition + ', box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
    transform: isSelected || isAffected ? 'scale(1.03)' : 'scale(1)',
  };

  const bonuses: BonusInfo[] = [];
  if (showBonuses && finalCostInfo.discount > 0) {
    bonuses.push({ type: 'cost', value: finalCostInfo.discount });
  }
  // Add logic here to populate other bonuses if UniversalCard should handle them directly
  // e.g., from card.activeBonuses or a context passed down.

  return (
    <div 
      style={containerStyle} 
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={onMouseEnterCard}
      onMouseLeave={onMouseLeaveCard}
      onMouseMove={onMouseMoveCard}
    >
      {showBonuses && <BonusIndicator bonuses={bonuses} position="top-right" />}
      <div>
        <div style={{
          fontWeight: 'bold',
          fontSize: isCompact ? FONT_SIZES.small : FONT_SIZES.medium,
          color: COLORS.textLight,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: '5px',
        }}>
          {card.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCompact ? '2px' : '4px' }}>
          <CostDisplay originalCost={finalCostInfo.originalCost} discount={finalCostInfo.discount} size={isCompact ? 'small' : 'small'} className='text-white' />
          <span style={{ fontSize: isCompact ? '10px' : FONT_SIZES.small, color: COLORS.textMuted }}>{card.type}</span>
        </div>
        {card.keywords && card.keywords.length > 0 && !isCompact && (
          <div style={{ marginBottom: '4px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {card.keywords.slice(0, displayMode === 'hand' ? 3 : 2).map(kw => (
              <span key={kw} style={{
                background: COLORS.primaryDark,
                color: COLORS.textLight,
                fontSize: '10px',
                padding: '1px 4px',
                borderRadius: '3px',
              }}>{kw}</span>
            ))}
          </div>
        )}
      </div>
      {!isCompact && card.text && (
        <p style={{
          fontSize: '11px',
          color: COLORS.textLight,
          lineHeight: '1.3',
          maxHeight: displayMode === 'hand' ? '3.9em' : '2.6em', // Approx 3 or 2 lines
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: displayMode === 'hand' ? 3 : 2,
          margin: '0',
          marginTop: 'auto',
        }}>
          {card.text}
        </p>
      )}
    </div>
  );
}); 
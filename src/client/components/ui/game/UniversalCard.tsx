import React from 'react';
import type { ClientCard } from '../../../types/game';
import { FONT_SIZES, CARD_STYLES, COLORS, CARD_TYPE_COLORS } from '../../../constants/ui';
import type { BonusInfo } from './BonusIndicator';

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
  const defaultBoxShadow = '0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)';

  const isCompact = displayMode === 'choiceModal' || displayMode === 'tooltip';
  const finalCostInfo = costInfo || { originalCost: card.cost, discount: 0, finalCost: card.cost };

  const containerStyle: React.CSSProperties = {
    ...CARD_STYLES,
    width: isCompact ? '130px' : (displayMode === 'hand' ? '160px' : '170px'), // Increased width
    minHeight: isCompact ? '100px' : (displayMode === 'hand' ? '220px' : '240px'), // Increased height for art
    padding: '0', // Padding will be handled by inner elements
    background: COLORS.bgDark, // Darker background for the card base
    border: `3px solid ${isSelected ? COLORS.warning : (isAffected ? COLORS.warningLight : COLORS.bgLight)}`,
    borderRadius: '10px', // Rounded corners
    color: COLORS.white,
    textAlign: 'center', // Center text for some elements
    cursor: isClickable && onClick ? 'pointer' : 'default',
    boxShadow: isAffected ? `0 0 15px 5px ${COLORS.warningLight}` : (isSelected ? `0 0 12px 4px ${COLORS.warning}` : defaultBoxShadow),
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between', // Removed to allow more manual control
    transition: CARD_STYLES.transition + ', box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out, transform 0.2s ease-in-out',
    transform: isSelected || isAffected ? 'scale(1.05)' : 'scale(1)', // Slightly more pronounced scale
    overflow: 'hidden', // Ensure inner elements respect border radius
  };

  const nameBannerStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${cardTypeColor}, ${COLORS.bgMedium})`,
    padding: '8px 10px',
    fontWeight: 'bold',
    fontSize: isCompact ? FONT_SIZES.small : FONT_SIZES.large, // Larger font for name
    color: COLORS.textLight, // Lighter text for contrast
    borderBottom: `2px solid ${COLORS.bgLight}`,
    textAlign: 'center',
    position: 'relative', // For cost display positioning
    minHeight: '40px', // Ensure banner has some height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const costContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-5px',
    left: '-5px',
    background: COLORS.primary,
    color: COLORS.white,
    width: isCompact ? '28px' : '36px', // Size of the cost circle
    height: isCompact ? '28px' : '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: isCompact ? FONT_SIZES.medium : FONT_SIZES.large,
    border: `2px solid ${COLORS.white}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  };

  const artPlaceholderStyle: React.CSSProperties = {
    height: isCompact ? '50px' : (displayMode === 'hand' ? '80px' : '100px'),
    background: COLORS.bgMedium, // Placeholder color
    margin: '10px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.small,
    border: `1px dashed ${COLORS.textMuted}`,
  };

  const descriptionStyle: React.CSSProperties = {
    padding: '0 10px 10px 10px',
    fontSize: isCompact ? '10px' : '12px',
    color: COLORS.textLight,
    lineHeight: '1.4',
    textAlign: 'center',
    flexGrow: 1, // Allow description to take available space
    overflowY: 'auto', // Scroll if text is too long
    maxHeight: displayMode === 'hand' ? '60px' : (isCompact ? '40px' : '50px'), // Limit height
  };

  const typeAndKeywordsStyle: React.CSSProperties = {
    padding: '5px 10px',
    background: COLORS.bgLight,
    borderTop: `1px solid ${COLORS.textMuted}`,
    fontSize: '10px',
    color: COLORS.textMuted,
    textAlign: 'center',
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
      {/* Name Banner with Cost */}
      <div style={nameBannerStyle}>
        {card.name}
        {finalCostInfo && (
           <div style={costContainerStyle}>
            {finalCostInfo.finalCost}
          </div>
        )}
      </div>

      {/* Card Art Placeholder */}
      {!isCompact && (
        <div style={artPlaceholderStyle}>
          Card Art
        </div>
      )}

      {/* Card Text/Description */}
      {card.text && (
        <div style={descriptionStyle}>
          {card.text}
        </div>
      )}

      {/* Type and Keywords */}
      {(!isCompact || (card.keywords && card.keywords.length > 0)) && (
        <div style={typeAndKeywordsStyle}>
          {card.type}
          {card.keywords && card.keywords.length > 0 && !isCompact && (
            <div style={{ marginTop: '3px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3px' }}>
              {card.keywords.slice(0, displayMode === 'hand' ? 2 : 2).map(kw => (
                <span key={kw} style={{
                  background: COLORS.primaryDark,
                  color: COLORS.textLight,
                  fontSize: '9px',
                  padding: '1px 4px',
                  borderRadius: '3px',
                }}>{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Original Bonus Indicator (optional, if needed elsewhere) */}
      {/* {showBonuses && <BonusIndicator bonuses={bonuses} position="top-right" />} */}

      {/* Remove old layout elements if they are fully replaced */}
      {/* For example, if CostDisplay is now part of nameBannerStyle, remove its original placement */}
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCompact ? '2px' : '4px' }}>
        <CostDisplay originalCost={finalCostInfo.originalCost} discount={finalCostInfo.discount} size={isCompact ? 'small' : 'small'} className='text-white' />
        <span style={{ fontSize: isCompact ? '10px' : FONT_SIZES.small, color: COLORS.textMuted }}>{card.type}</span>
      </div> */}
      {/* Old name and keywords divs are replaced by the new structure */}

    </div>
  );
});

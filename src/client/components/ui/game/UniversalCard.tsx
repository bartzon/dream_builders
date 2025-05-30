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
  showPlayableBorder?: boolean;
  isSelected?: boolean;
  isAffected?: boolean;
  costInfo?: { originalCost: number; discount: number; finalCost: number };
  showBonuses?: boolean;
  onMouseEnterCard?: (e: React.MouseEvent) => void;
  onMouseLeaveCard?: (e: React.MouseEvent) => void;
  onMouseMoveCard?: (e: React.MouseEvent) => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = React.memo(({
  card,
  displayMode = 'board',
  onClick,
  isClickable = false,
  showPlayableBorder = false,
  isSelected = false,
  isAffected = false,
  costInfo,
  showBonuses = true,
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
    width: '170px',
    height: '280px',
    padding: '0',
    background: COLORS.bgDark,
    border: `3px solid ${showPlayableBorder ? COLORS.success : (isSelected ? COLORS.warning : (isAffected ? COLORS.warningLight : COLORS.bgLight))}`,
    borderRadius: '10px',
    color: COLORS.white,
    textAlign: 'center',
    cursor: isClickable && onClick ? 'pointer' : 'default',
    boxShadow: isAffected ? `0 0 15px 5px ${COLORS.warningLight}` : (isSelected ? `0 0 12px 4px ${COLORS.warning}` : defaultBoxShadow),
    display: 'flex',
    flexDirection: 'column',
    transition: CARD_STYLES.transition + ', box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out, transform 0.2s ease-in-out',
    transform: isSelected || isAffected ? 'scale(1.05)' : 'scale(1)',
    overflow: 'hidden',
  };

  const nameBannerStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${cardTypeColor}, ${COLORS.bgMedium})`,
    padding: '8px 10px',
    fontWeight: 'bold',
    fontSize: isCompact ? FONT_SIZES.small : FONT_SIZES.large,
    color: COLORS.textLight,
    borderBottom: `2px solid ${COLORS.bgLight}`,
    textAlign: 'center',
    position: 'relative',
    minHeight: '40px',
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
    width: isCompact ? '28px' : '36px',
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
    height: isCompact ? '50px' : '100px',
    background: COLORS.bgMedium,
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
    fontSize: '10px',
    color: COLORS.textLight,
    lineHeight: '1.4',
    textAlign: 'center',
    flexGrow: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: isCompact ? 2 : 3,
    WebkitBoxOrient: 'vertical',
    maxHeight: isCompact ? '40px' : '50px',
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

  return (
    <div
      style={containerStyle}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={onMouseEnterCard}
      onMouseLeave={onMouseLeaveCard}
      onMouseMove={onMouseMoveCard}
    >
      <div style={nameBannerStyle}>
        {card.name}
        {finalCostInfo && (
           <div style={costContainerStyle}>
            {finalCostInfo.finalCost}
          </div>
        )}
      </div>

      {!isCompact && (
        <div style={artPlaceholderStyle}>
          Card Art
        </div>
      )}

      {card.text && (
        <div style={descriptionStyle}>
          {card.text}
        </div>
      )}

      {(!isCompact || (card.keywords && card.keywords.length > 0)) && (
        <div style={typeAndKeywordsStyle}>
          {card.type}
          {card.keywords && card.keywords.length > 0 && !isCompact && (
            <div style={{ marginTop: '3px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3px' }}>
              {card.keywords.slice(0, 2).map(kw => (
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

    </div>
  );
});

import React from 'react';
import type { ClientCard } from '../../../types/game';
import { FONT_SIZES, CARD_STYLES, COLORS, CARD_TYPE_COLORS } from '../../../constants/ui';

interface ChoiceCardDisplayProps {
  card: ClientCard;
  onClick?: () => void;
  isClickable?: boolean;
  compact?: boolean;
  // Add any other props needed for simple display, e.g., isSelected if we want to show a selection state
}

export const ChoiceCardDisplay: React.FC<ChoiceCardDisplayProps> = React.memo(({
  card,
  onClick,
  isClickable = false,
  compact = false,
}) => {
  const cardTypeColor = CARD_TYPE_COLORS[card.type.toLowerCase()] || COLORS.default;
  const defaultBoxShadow = '0 2px 4px rgba(0,0,0,0.1)'; // Softer default shadow

  const containerStyle: React.CSSProperties = {
    ...CARD_STYLES,
    minWidth: compact ? '100px' : '150px',
    maxWidth: compact ? '120px' : '180px',
    minHeight: compact ? '70px' : '100px',
    padding: compact ? '8px' : '12px',
    background: `linear-gradient(to bottom, ${cardTypeColor} 20%, ${COLORS.bgMedium} 100%)`,
    border: `2px solid ${cardTypeColor}`,
    color: COLORS.white,
    textAlign: 'left',
    cursor: isClickable && onClick ? 'pointer' : 'default',
    boxShadow: defaultBoxShadow, // Default shadow, can be overridden by hover/selection if needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: CARD_STYLES.transition + ', box-shadow 0.2s ease-in-out',
  };

  return (
    <div 
      style={containerStyle} 
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={(e) => {
        if (isClickable && onClick) {
          e.currentTarget.style.boxShadow = `0 0 10px 3px ${COLORS.warning}`;
          e.currentTarget.style.transform = 'scale(1.03)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable && onClick) {
          e.currentTarget.style.boxShadow = defaultBoxShadow;
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      <div>
        <div style={{
          fontWeight: 'bold',
          fontSize: compact ? FONT_SIZES.small : FONT_SIZES.medium,
          color: COLORS.textLight,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: '4px',
        }}>
          {card.name}
        </div>
        <div style={{ fontSize: compact ? '11px' : FONT_SIZES.small, color: COLORS.textMuted }}>
          Cost: {card.cost} | Type: {card.type}
        </div>
      </div>
      {!compact && card.text && (
        <p style={{
          fontSize: '11px',
          color: COLORS.textLight,
          marginTop: '6px',
          lineHeight: '1.3',
          maxHeight: '30px', // Adjust for 2 lines approx
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2, // Show max 2 lines of text
          display: '-webkit-box',
        }}>
          {card.text}
        </p>
      )}
    </div>
  );
}); 
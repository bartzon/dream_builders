import React from 'react';
import type { ClientCard } from '../../../types/game';
import { FONT_SIZES, CARD_STYLES, COLORS, CARD_TYPE_COLORS } from '../../../constants/ui';
import { CostDisplay } from '../CostDisplay'; // Import CostDisplay

interface ChoiceCardDisplayProps {
  card: ClientCard;
  onClick?: () => void;
  isClickable?: boolean;
  compact?: boolean;
  isSelected?: boolean; 
}

export const ChoiceCardDisplay: React.FC<ChoiceCardDisplayProps> = React.memo(({
  card,
  onClick,
  isClickable = false,
  compact = false,
  isSelected = false,
}) => {
  const cardTypeColor = CARD_TYPE_COLORS[card.type.toLowerCase()] || COLORS.default;
  const defaultBoxShadow = '0 2px 4px rgba(0,0,0,0.1)';

  const containerStyle: React.CSSProperties = {
    ...CARD_STYLES,
    width: compact ? '130px' : '160px',
    minHeight: compact ? '80px' : '110px',
    padding: compact ? '8px' : '10px',
    background: `linear-gradient(to bottom, ${cardTypeColor} 15%, ${COLORS.bgMedium} 100%)`,
    border: `2px solid ${isSelected ? COLORS.warning : cardTypeColor}`,
    color: COLORS.white,
    textAlign: 'left',
    cursor: isClickable && onClick ? 'pointer' : 'default',
    boxShadow: isSelected ? `0 0 12px 4px ${COLORS.warning}` : defaultBoxShadow,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: CARD_STYLES.transition + ', box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
  };

  return (
    <div 
      style={containerStyle} 
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={(e) => {
        if (isClickable && onClick && !isSelected) {
          e.currentTarget.style.borderColor = COLORS.warningLight;
          e.currentTarget.style.boxShadow = `0 0 8px 2px ${COLORS.warningLight}`;
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable && onClick && !isSelected) {
          e.currentTarget.style.borderColor = cardTypeColor;
          e.currentTarget.style.boxShadow = defaultBoxShadow;
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
          marginBottom: '5px',
        }}>
          {card.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? '2px' : '4px' }}>
          <CostDisplay originalCost={card.cost} discount={0} size='small' className='text-white' />
          <span style={{ fontSize: compact ? '10px' : FONT_SIZES.small, color: COLORS.textMuted }}>{card.type}</span>
        </div>
        {card.keywords && card.keywords.length > 0 && !compact && (
          <div style={{ marginBottom: '4px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {card.keywords.slice(0, 2).map(kw => (
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
      {!compact && card.text && (
        <p style={{
          fontSize: '11px',
          color: COLORS.textLight,
          lineHeight: '1.3',
          maxHeight: '2.6em', // Approx 2 lines
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          margin: '0',
          marginTop: 'auto', // Pushes text to bottom if keywords are few/none
        }}>
          {card.text}
        </p>
      )}
    </div>
  );
}); 
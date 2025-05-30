import React from 'react';
import type { ClientCard } from '../../../types/game';
import { CardTooltip } from './CardTooltip';

interface RightSidebarProps {
  hoveredCard?: ClientCard;
  isTooltipVisible: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ hoveredCard, isTooltipVisible }) => {
  return (
    <div style={{
      width: '320px', // Adjust width as needed, a bit wider for a large card display
      padding: '10px',
      background: 'rgba(0,0,0,0.1)', // Subtle background
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center the tooltip content
      height: '100%', // Make it take full height of its container
      boxSizing: 'border-box',
    }}>
      {isTooltipVisible && hoveredCard ? (
        <CardTooltip
          card={hoveredCard}
          visible={true}
          displayModeOverride="sidebarDetail"
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#6b7280', // Dim text color
          fontSize: '0.9rem',
          textAlign: 'center',
        }}>
          Hover over a card to see details here.
        </div>
      )}
    </div>
  );
};

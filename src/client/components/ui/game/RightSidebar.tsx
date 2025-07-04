import React from 'react';
import type { ClientCard, EffectContextUI } from '../../../types/game';
import { CardTooltip } from './CardTooltip';
import { calculateProductRevenue } from '../../../utils/revenue-helpers';

interface RightSidebarProps {
  hoveredCard?: ClientCard;
  isTooltipVisible: boolean;
  tools: ClientCard[];
  effectContext: EffectContextUI;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ 
  hoveredCard, 
  isTooltipVisible,
  tools,
  effectContext 
}) => {
  // Calculate revenue bonus for products
  let totalRevenueBonus = 0;
  
  if (hoveredCard?.type === 'Product') {
    // Get Optimize Checkout tools that match this product's tier (based on cost)
    const matchingOptimizeTools = tools.filter(tool => 
      tool.effect === 'optimize_checkout' && 
      tool.cost === hoveredCard.cost
    );
    
    // Calculate total revenue using the helper
    const totalRevenue = calculateProductRevenue(
      hoveredCard,
      matchingOptimizeTools,
      effectContext
    );
    
    // Calculate bonus amount (revenue minus base)
    totalRevenueBonus = totalRevenue - (hoveredCard.revenuePerSale || 0);
  }
  
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
          revenueBonus={totalRevenueBonus}
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

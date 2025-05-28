import React from 'react';
import type { Card as CardType } from '../../game/types';
import { motion } from 'framer-motion';
import { CARD_TYPE_COLORS, CARD_TYPE_BORDER_COLORS } from '../../game/constants';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'mini' | 'small' | 'normal';
}

export function Card({ card, onClick, disabled = false, size = 'small' }: CardProps) {
  const sizeClasses = {
    mini: 'w-24 h-32 text-xs',    // 96px x 128px - for board cards
    small: 'w-32 h-40 text-xs',   // 128px x 160px - for hand cards
    normal: 'w-36 h-44 text-sm',  // 144px x 176px - for focused view
  };

  const typeColor = CARD_TYPE_COLORS[card.type] || 'bg-gray-500';
  const borderColor = CARD_TYPE_BORDER_COLORS[card.type] || 'border-gray-400';
  
  // Check if card is disabled (for products with no inventory or inactive)
  const isProductDisabled = card.type === 'Product' && 
    (card.inventory === 0 || card.isActive === false);
  const isDisabled = disabled || isProductDisabled;
  
  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={`
        ${sizeClasses[size]}
        ${typeColor}
        ${borderColor}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        rounded-lg border-2 p-2 text-white shadow-md transition-all duration-200
        flex flex-col justify-between
        ${card.isActive === false ? 'border-red-400' : ''}
      `}
      onClick={isDisabled ? undefined : onClick}
    >
      {/* Card Header */}
      <div>
        <div className="flex justify-between items-start mb-1">
          <span className="font-bold text-sm">{card.cost}</span>
          <div className="flex items-center gap-1">
            {card.overheadCost && (
              <span className="text-xs opacity-75 bg-red-600 px-1 rounded">
                -{card.overheadCost}
              </span>
            )}
            <span className="text-xs opacity-75">{card.type[0]}</span>
          </div>
        </div>
        <h3 className="font-semibold text-center text-xs leading-tight mb-1 line-clamp-2 px-1">
          {card.name}
        </h3>
      </div>
      
      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-center px-1 py-1">
        {/* Product-specific info */}
        {card.type === 'Product' && (
          <div className="mb-1 text-center">
            {card.inventory !== undefined && (
              <div className="text-xs font-semibold">
                Inventory: {card.inventory}
              </div>
            )}
            {card.revenuePerSale && (
              <div className="text-xs text-green-200">
                ${(card.revenuePerSale / 1000).toFixed(0)}k/sale
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-center opacity-90 leading-relaxed break-words">
          {card.text}
        </p>
      </div>
      
      {/* Card Footer - Keywords */}
      {card.keywords && card.keywords.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-0.5 justify-center">
          {card.keywords.slice(0, 2).map((keyword, i) => (
            <span 
              key={i} 
              className="text-xs bg-black bg-opacity-20 px-1 rounded leading-tight"
            >
              {keyword}
            </span>
          ))}
          {card.keywords.length > 2 && (
            <span className="text-xs opacity-60">+{card.keywords.length - 2}</span>
          )}
        </div>
      )}
    </motion.div>
  );
} 
import React from 'react';
import type { Card } from '../../game/types';
import { motion } from 'framer-motion';

interface SellButtonProps {
  product: Card;
  onSell: (productId: string) => void;
  disabled?: boolean;
}

export function SellButton({ product, onSell, disabled = false }: SellButtonProps) {
  const canSell = product.inventory && product.inventory > 0 && product.isActive !== false;
  const isDisabled = disabled || !canSell;
  
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={() => !isDisabled && onSell(product.id)}
      disabled={isDisabled}
      className={`
        px-3 py-1 rounded text-xs font-semibold transition-colors
        ${isDisabled 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
          : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
        }
      `}
    >
      Sell 1 (${((product.revenuePerSale || 0) / 1000).toFixed(0)}k)
    </motion.button>
  );
} 
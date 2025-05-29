import type { Card } from '../../game/types';

interface SellButtonProps {
  product: Card;
  productIndex: number;
  onSell: (productIndex: number) => void;
  disabled?: boolean;
}

export function SellButton({ product, productIndex, onSell, disabled = false }: SellButtonProps) {
  const canSell = product.inventory && product.inventory > 0 && product.isActive !== false;
  const isDisabled = disabled || !canSell;
  
  return (
    <button
      onClick={() => !isDisabled && onSell(productIndex)}
      disabled={isDisabled}
      className={`
        px-3 py-1 rounded text-xs font-semibold
        ${isDisabled 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
          : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
        }
      `}
    >
      Sell 1 (${((product.revenuePerSale || 0) / 1000).toFixed(0)}k)
    </button>
  );
} 
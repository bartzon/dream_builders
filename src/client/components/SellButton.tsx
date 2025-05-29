import type { Card } from '../../game/types';

interface SellButtonProps {
  product: Card;
  productIndex: number;
  onSell: (productIndex: number) => void;
  disabled?: boolean;
}

// Function to play the cha-ching sound
const playChachingSound = () => {
  try {
    const audio = new Audio('/sounds/cha_ching_sound.mp3');
    audio.volume = 0.3; // Set volume to 30% to not be too loud
    audio.play().catch(error => {
      console.warn('Could not play cha-ching sound:', error);
    });
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

export function SellButton({ product, productIndex, onSell, disabled = false }: SellButtonProps) {
  const canSell = product.inventory && product.inventory > 0 && product.isActive !== false;
  const isDisabled = disabled || !canSell;
  
  const handleSell = () => {
    if (!isDisabled) {
      // Play the cha-ching sound
      playChachingSound();
      // Call the sell function
      onSell(productIndex);
    }
  };
  
  return (
    <button
      onClick={handleSell}
      disabled={isDisabled}
      className={`
        px-3 py-1 rounded text-xs font-semibold transition-all duration-200
        ${isDisabled 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
          : 'bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md transform hover:scale-105'
        }
      `}
    >
      Sell 1 (${((product.revenuePerSale || 0) / 1000).toFixed(0)}k)
    </button>
  );
} 
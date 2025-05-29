import type { Card } from '../../game/types';
import { Card as CardComponent } from './Card';
import { SellButton } from './SellButton';

interface BoardLaneProps {
  title: string;
  cards: Card[];
  color: 'purple' | 'green' | 'orange';
  onSellProduct?: (productIndex: number) => void;
  isMyTurn?: boolean;
}

const colorClasses = {
  purple: 'border-purple-400 bg-purple-900/20',
  green: 'border-green-400 bg-green-900/20',
  orange: 'border-orange-400 bg-orange-900/20',
};

const titleColors = {
  purple: 'text-purple-300',
  green: 'text-green-300',
  orange: 'text-orange-300',
};

export function BoardLane({ title, cards, color, onSellProduct, isMyTurn }: BoardLaneProps) {
  if (cards.length === 0) {
    return (
      <div className={`${colorClasses[color]} border-2 border-dashed rounded-lg p-4 min-h-[120px] flex items-center justify-center`}>
        <span className={`${titleColors[color]} text-lg font-semibold opacity-50`}>
          No {title}
        </span>
      </div>
    );
  }

  return (
    <div className={`${colorClasses[color]} border border-solid rounded-lg p-4`}>
      <h3 className={`${titleColors[color]} text-lg font-bold mb-3`}>
        {title} ({cards.length})
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {cards.map((card, index) => (
          <div key={`${card.id}-${index}`} className="flex-shrink-0 relative group">
            <CardComponent
              card={card}
              size="small"
            />
            
            {/* Sell button for products */}
            {title === 'Products' && onSellProduct && isMyTurn && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <SellButton
                  product={card}
                  productIndex={index}
                  onSell={onSellProduct}
                  disabled={!isMyTurn}
                />
              </div>
            )}
            
            {/* Hover tooltip overlay */}
            <div className="absolute inset-0 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 text-xs overflow-hidden">
              <div className="font-bold mb-1">{card.name}</div>
              <div className="mb-1">Cost: {card.cost} | Type: {card.type}</div>
              {card.keywords && card.keywords.length > 0 && (
                <div className="mb-1">Keywords: {card.keywords.join(', ')}</div>
              )}
              <div className="text-xs opacity-90">{card.text}</div>
              {card.flavor && (
                <div className="text-xs italic opacity-70 mt-1">"{card.flavor}"</div>
              )}
              {card.type === 'Product' && (
                <div className="mt-1">
                  {card.inventory !== undefined && (
                    <div>Inventory: {card.inventory}</div>
                  )}
                  {card.revenuePerSale && (
                    <div>Revenue: ${(card.revenuePerSale / 1000).toFixed(0)}k/sale</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
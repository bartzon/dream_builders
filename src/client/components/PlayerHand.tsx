import type { Card } from '../../game/types';
import { Card as CardComponent } from './Card';

interface PlayerHandProps {
  cards: Card[];
  onPlayCard?: (index: number) => void;
  playerCapital: number;
  isMyTurn: boolean;
}

export function PlayerHand({ cards, onPlayCard, playerCapital, isMyTurn }: PlayerHandProps) {
  const handSize = cards.length;
  const maxSpread = 60; // Reduced spread angle
  const cardSpacing = handSize > 1 ? Math.min(maxSpread / (handSize - 1), 12) : 0;
  const startAngle = -(cardSpacing * (handSize - 1)) / 2;

  return (
    <div className="relative flex items-end justify-center" style={{ width: '800px', height: '160px' }}>
      {cards.map((card, index) => {
        const angle = startAngle + (index * cardSpacing);
        const canAfford = card.cost <= playerCapital;
        const canPlay = isMyTurn && canAfford;
        
        // More subtle positioning
        const offsetX = (index - (handSize - 1) / 2) * 45; // Horizontal spread
        const offsetY = Math.abs(index - (handSize - 1) / 2) * 8; // Slight curve
        
        return (
          <div
            key={`${card.id}-${index}`}
            className={`absolute transition-all duration-300 cursor-pointer group`}
            style={{
              left: `calc(50% + ${offsetX}px)`,
              bottom: `${offsetY}px`,
              transform: `translateX(-50%) rotate(${angle}deg)`,
              zIndex: index + 1,
            }}
            onMouseEnter={(e) => {
              // Lift and straighten card on hover
              e.currentTarget.style.transform = `translateX(-50%) rotate(0deg) translateY(-30px) scale(1.15)`;
              e.currentTarget.style.zIndex = '100';
            }}
            onMouseLeave={(e) => {
              // Return to normal position
              e.currentTarget.style.transform = `translateX(-50%) rotate(${angle}deg)`;
              e.currentTarget.style.zIndex = `${index + 1}`;
            }}
            onClick={() => canPlay && onPlayCard?.(index)}
          >
            <div className={`
              transition-all duration-300
              ${canPlay ? 'shadow-lg shadow-blue-400/60 ring-2 ring-blue-400/40' : ''}
              ${!canAfford ? 'opacity-50 grayscale' : ''}
              rounded-lg
            `}>
              <CardComponent
                card={card}
                disabled={!canPlay}
                size="small"
              />
            </div>
            
            {/* Playable indicator */}
            {canPlay && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-lg animate-pulse" />
            )}

            {/* Hearthstone-style card tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              <div className="bg-black/95 text-white p-4 rounded-lg shadow-2xl border-2 border-yellow-400/50 max-w-64">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {card.cost}
                    </span>
                    <span className="text-yellow-400 font-bold">{card.name}</span>
                  </div>
                  <span className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded">
                    {card.type}
                  </span>
                </div>

                {/* Card Stats for Products */}
                {card.type === 'Product' && (
                  <div className="mb-2 text-sm">
                    {card.inventory !== undefined && (
                      <div className="text-orange-400">Inventory: {card.inventory}</div>
                    )}
                    {card.revenuePerSale && (
                      <div className="text-green-400">Revenue: ${(card.revenuePerSale / 1000).toFixed(0)}k per sale</div>
                    )}
                    {card.overheadCost && (
                      <div className="text-red-400">Overhead: -{card.overheadCost} per turn</div>
                    )}
                  </div>
                )}

                {/* Card Description */}
                <div className="text-sm text-slate-200 mb-2">
                  {card.text}
                </div>

                {/* Keywords */}
                {card.keywords && card.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.keywords.map((keyword, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-purple-600/50 text-purple-200 px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {/* Play Status */}
                <div className="text-xs text-center pt-2 border-t border-slate-600">
                  {!canAfford ? (
                    <span className="text-red-400">Not enough capital</span>
                  ) : !isMyTurn ? (
                    <span className="text-orange-400">Not your turn</span>
                  ) : (
                    <span className="text-green-400">Click to play</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Hand empty state */}
      {cards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-400 text-lg bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600">
            No cards in hand
          </div>
        </div>
      )}
    </div>
  );
} 
import type { PlayerState } from '../../game/state';
import { Card } from './Card';
import { SellButton } from './SellButton';
import { HERO_COLORS, GAME_CONFIG } from '../../game/constants';

interface PlayerBoardProps {
  player: PlayerState;
  isCurrentPlayer: boolean;
  isMyTurn: boolean;
  onPlayCard?: (index: number) => void;
  onUseHeroAbility?: () => void;
  onSellProduct?: (productIndex: number) => void;
}

export function PlayerBoard({ 
  player, 
  isCurrentPlayer, 
  isMyTurn, 
  onPlayCard, 
  onUseHeroAbility,
  onSellProduct
}: PlayerBoardProps) {
  const heroColor = HERO_COLORS[player.hero as keyof typeof HERO_COLORS] || 'bg-gray-600';
  const heroCost = GAME_CONFIG.HERO_ABILITY_COSTS[player.hero as keyof typeof GAME_CONFIG.HERO_ABILITY_COSTS] || 2;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-3 mb-3 ${isCurrentPlayer ? 'border-2 border-blue-500' : ''}`}>
      {/* Player Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className={`${heroColor} text-white px-2 py-1 rounded-lg font-semibold text-sm`}>
            {player.hero}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span>
              Capital: <span className="font-bold">{player.capital}</span> / {GAME_CONFIG.MAX_CAPITAL}
            </span>
            <span>
              Revenue: <span className="font-bold text-green-600">${player.revenue.toLocaleString()}</span>
            </span>
            <span className="text-gray-500">
              Deck: {player.deck.length}
            </span>
          </div>
        </div>
        
        {/* Hero Ability Button */}
        {isCurrentPlayer && isMyTurn && onUseHeroAbility && (
          <button
            onClick={onUseHeroAbility}
            disabled={player.heroAbilityUsed || player.capital < heroCost}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
              player.heroAbilityUsed || player.capital < heroCost
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : `${heroColor} text-white`
            }`}
          >
            Hero ({heroCost})
          </button>
        )}
      </div>
      
      {/* Hand */}
      {isCurrentPlayer && (
        <div className="mb-3">
          <h3 className="font-semibold mb-1.5 text-sm">Hand ({player.hand.length} cards)</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2.5 min-w-max">
              {player.hand.map((card, index) => (
                <Card
                  key={`${card.id}-${index}`}
                  card={card}
                  onClick={() => isMyTurn && onPlayCard?.(index)}
                  disabled={!isMyTurn || card.cost > player.capital}
                  size="small"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Board */}
      <div className="space-y-2">
        {/* Products - Now with sell buttons */}
        {player.board.Products.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-600 text-sm mb-1">Products ({player.board.Products.length})</h4>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2.5 min-w-max">
                {player.board.Products.map((card, index) => (
                  <div key={`product-${card.id}-${index}`} className="flex flex-col gap-1">
                    <Card
                      card={card}
                      size="mini"
                    />
                    {isCurrentPlayer && isMyTurn && onSellProduct && (
                      <SellButton
                        product={card}
                        productIndex={index}
                        onSell={onSellProduct}
                        disabled={!isMyTurn}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Tools */}
        {player.board.Tools.length > 0 && (
          <div>
            <h4 className="font-semibold text-purple-600 text-sm mb-1">Tools ({player.board.Tools.length})</h4>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2.5 min-w-max">
                {player.board.Tools.map((card, index) => (
                  <Card
                    key={`tool-${card.id}-${index}`}
                    card={card}
                    size="mini"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Employees */}
        {player.board.Employees.length > 0 && (
          <div>
            <h4 className="font-semibold text-orange-600 text-sm mb-1">Employees ({player.board.Employees.length})</h4>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2.5 min-w-max">
                {player.board.Employees.map((card, index) => (
                  <Card
                    key={`employee-${card.id}-${index}`}
                    card={card}
                    size="mini"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
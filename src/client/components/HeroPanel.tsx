import type { PlayerState } from '../../game/state';
import { allHeroes } from '../../game/data/heroes';
import { HERO_COLORS, GAME_CONFIG } from '../../game/constants';

interface HeroPanelProps {
  player: PlayerState;
  onUseHeroAbility?: () => void;
  isMyTurn: boolean;
}

export function HeroPanel({ player, onUseHeroAbility, isMyTurn }: HeroPanelProps) {
  const hero = allHeroes.find(h => h.id === player.hero);
  const heroColor = HERO_COLORS[player.hero as keyof typeof HERO_COLORS] || 'bg-gray-600';
  const heroCost = GAME_CONFIG.HERO_ABILITY_COSTS[player.hero as keyof typeof GAME_CONFIG.HERO_ABILITY_COSTS] || 2;
  
  if (!hero) return null;

  const canUseAbility = isMyTurn && !player.heroAbilityUsed && player.capital >= heroCost;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Hero Portrait - Hearthstone style */}
      <div className="relative group">
        <div className={`${heroColor} w-24 h-24 rounded-full p-1 shadow-lg ring-4 ring-yellow-400/30`}>
          <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-300 rounded-full flex items-center justify-center text-3xl shadow-inner">
            👤
          </div>
        </div>
        
        {/* Capital indicator (like Hearthstone's mana) */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-blue-300">
          {player.capital}
        </div>
        
        {/* Revenue indicator */}
        <div className="absolute -top-1 -right-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          ${Math.floor(player.revenue / 1000)}k
        </div>

        {/* Hover tooltip for hero info */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-black/95 text-white text-xs p-3 rounded-lg shadow-xl border border-yellow-400/30 whitespace-nowrap">
            <div className="font-bold text-yellow-400">{hero.name}</div>
            <div className="text-slate-300">{hero.playstyle}</div>
            <div className="mt-1 text-xs text-green-400">Revenue: ${player.revenue.toLocaleString()}</div>
            <div className="text-xs text-blue-400">Hand: {player.hand.length} cards</div>
          </div>
        </div>
      </div>
      
      {/* Hero Power Button - Hearthstone style */}
      {onUseHeroAbility && (
        <div className="relative group">
          <button
            onClick={onUseHeroAbility}
            disabled={!canUseAbility}
            className={`relative px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 border-2 ${
              canUseAbility
                ? `bg-gradient-to-b from-yellow-400 to-yellow-600 text-black border-yellow-300 hover:scale-105 shadow-lg hover:shadow-xl`
                : 'bg-gray-700 text-gray-400 border-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs">⚡</span>
              <span>{player.heroAbilityUsed ? 'Used' : `${heroCost}`}</span>
            </div>
          </button>
          
          {/* Hero power tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            <div className="bg-black/95 text-white text-xs p-3 rounded-lg shadow-xl border border-yellow-400/30 whitespace-nowrap max-w-48">
              <div className="font-bold text-yellow-400">{hero.heroPower.name}</div>
              <div className="text-slate-300">{hero.heroPower.description}</div>
              <div className="text-xs text-blue-400 mt-1">Cost: {heroCost} Capital</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
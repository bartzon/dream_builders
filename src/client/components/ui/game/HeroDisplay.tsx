import React from 'react';
import { FONT_SIZES } from '../../../constants/ui';
import type { Hero } from '../../../../game/data/heroes';

interface HeroDisplayProps {
  hero: Hero | undefined;
  heroCost: number;
  isHeroPowerUsed: boolean;
  canUseHeroPower: boolean;
  onUseHeroPower: () => void;
  onHeroPowerMouseEnter: (e: React.MouseEvent) => void;
  onHeroPowerMouseLeave: () => void;
  onHeroPowerMouseMove: (e: React.MouseEvent) => void;
}

export const HeroDisplay = React.memo(
  ({
    hero,
    heroCost,
    isHeroPowerUsed,
    canUseHeroPower,
    onUseHeroPower,
    onHeroPowerMouseEnter,
    onHeroPowerMouseLeave,
    onHeroPowerMouseMove,
  }: HeroDisplayProps) => {
    if (!hero) return null;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          padding: '10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          width: '250px',
          marginBottom: '40px',
        }}
        onClick={onUseHeroPower}
        onMouseEnter={onHeroPowerMouseEnter}
        onMouseLeave={onHeroPowerMouseLeave}
        onMouseMove={onHeroPowerMouseMove}
      >
        <img
          src={hero.image}
          alt={hero.name}
          style={{
            width: '180px', // Adjust size as needed
            height: 'auto',
            borderRadius: '4px',
            border: canUseHeroPower ? '2px solid #4f46e5' : '2px solid transparent',
            cursor: canUseHeroPower ? 'pointer' : 'default',
          }}
        />
        <h4 style={{ margin: 0, fontSize: FONT_SIZES.body, textAlign: 'center' }}>
          {hero.name}
        </h4>
        {isHeroPowerUsed && (
          <p style={{ margin: 0, fontSize: FONT_SIZES.small, color: '#aaa' }}>
            (Used)
          </p>
        )}
        <p style={{ margin: 0, fontSize: FONT_SIZES.small }}>
          Cost: {heroCost}
        </p>
      </div>
    );
  }
);

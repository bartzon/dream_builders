"use client"

import { motion } from "framer-motion"
import { Card } from "./card"
import { HeroBanner } from "./hero-banner"
import { PlayerInventory } from "./player-inventory"
import { TeammateArea } from "./teammate-area"
import { DeckArea } from "./deck-area"
import { PhaseIndicator } from "./phase-indicator"
import type { GameState } from "../../../../lib/types"

interface BoardProps {
  gameState: GameState
  onPlayCard: (cardId: string) => void
  onDrawCard: () => void
}

export function Board({ gameState, onPlayCard, onDrawCard }: BoardProps) {
  const { currentPlayer, teammates, currentPhase } = gameState

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Top area - Teammates */}
      <div className="w-full flex justify-between px-6 pt-4 z-30">
        {teammates.map((teammate, index) => (
          <TeammateArea key={teammate.id} teammate={teammate} position={index === 0 ? "left" : "right"} />
        ))}
      </div>

      {/* Center board area */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
        <PhaseIndicator currentPhase={currentPhase} />

        {/* Shared board space - for played cards and effects */}
        <motion.div
          className="w-full max-w-4xl h-1/2 rounded-xl bg-gradient-to-b from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600/30 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-slate-500/10" />
            ))}
          </div>

          {/* Center logo/emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white text-3xl font-bold">E</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom area - Player */}
      <div className="w-full pb-4 px-4 z-30">
        <div className="flex justify-between items-end">
          {/* Left side - Hero and deck */}
          <div className="flex items-end gap-4">
            <HeroBanner
              hero={currentPlayer.hero}
              capital={currentPlayer.capital}
              heroPower={currentPlayer.heroPower}
              heroPowerCooldown={currentPlayer.heroPowerCooldown}
            />
            <DeckArea
              deckCount={currentPlayer.deck.length}
              discardCount={currentPlayer.discard.length}
              onDrawCard={onDrawCard}
            />
          </div>

          {/* Right side - Inventory */}
          <PlayerInventory inventory={currentPlayer.inventory} />
        </div>

        {/* Hand area */}
        <div className="relative h-48 mt-4">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-end justify-center">
            {currentPlayer.hand.map((card, index) => {
              const totalCards = currentPlayer.hand.length
              const middleIndex = Math.floor(totalCards / 2)
              const offset = index - middleIndex

              // Calculate rotation and vertical offset based on position
              const rotation = offset * 5 // degrees
              const verticalOffset = Math.abs(offset) * 5 // pixels

              return (
                <div
                  key={card.id}
                  className="relative"
                  style={{
                    zIndex: index === middleIndex ? totalCards + 1 : totalCards - Math.abs(offset),
                    marginLeft: index > 0 ? "-1.5rem" : "0",
                  }}
                >
                  <Card
                    card={card}
                    onPlay={() => onPlayCard(card.id)}
                    style={{
                      transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
                      transformOrigin: "bottom center",
                    }}
                    canPlay={currentPlayer.capital >= card.cost}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 
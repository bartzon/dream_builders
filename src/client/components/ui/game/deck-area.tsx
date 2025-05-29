"use client"

import { motion } from "framer-motion"

interface DeckAreaProps {
  deckCount: number
  discardCount: number
  onDrawCard: () => void
}

export function DeckArea({ deckCount, discardCount, onDrawCard }: DeckAreaProps) {
  return (
    <div className="flex items-end gap-4">
      {/* Deck */}
      <motion.div className="relative cursor-pointer" whileHover={{ y: -5 }} onClick={onDrawCard}>
        {/* Stacked cards effect */}
        {Array.from({ length: Math.min(5, deckCount) }).map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-22 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600"
            style={{
              top: `${-i * 1}px`,
              left: `${-i * 1}px`,
              zIndex: 5 - i,
            }}
          />
        ))}

        {/* Main deck */}
        <div className="relative w-16 h-22 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{deckCount}</span>
          </div>
        </div>

        <div className="mt-1 text-center text-xs text-slate-400">Deck</div>
      </motion.div>

      {/* Discard pile */}
      <motion.div className="relative" whileHover={{ y: -5 }}>
        <div className="w-16 h-22 rounded-md bg-gradient-to-br from-slate-700/50 to-slate-900/50 border border-slate-600/50 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{discardCount}</span>
          </div>
        </div>
        <div className="mt-1 text-center text-xs text-slate-400">Discard</div>
      </motion.div>
    </div>
  )
} 
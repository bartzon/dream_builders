"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"
import type { Phase, HeroPower } from "../../../../lib/types"

interface TurnControlsProps {
  currentPhase: Phase
  onEndTurn: () => void
  onUseHeroPower: () => void
  heroPower: HeroPower
  heroPowerCooldown: number
}

export function TurnControls({
  currentPhase,
  onEndTurn,
  onUseHeroPower,
  heroPower,
  heroPowerCooldown,
}: TurnControlsProps) {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Hero power button */}
      <motion.button
        className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
          heroPowerCooldown > 0
            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-700 text-white hover:from-indigo-600 hover:to-purple-800"
        }`}
        whileHover={heroPowerCooldown === 0 ? { scale: 1.05 } : {}}
        whileTap={heroPowerCooldown === 0 ? { scale: 0.95 } : {}}
        onClick={heroPowerCooldown === 0 ? onUseHeroPower : undefined}
        disabled={heroPowerCooldown > 0}
      >
        <Zap className="w-4 h-4" />
        <span className="font-medium">{heroPower.name}</span>
        {heroPowerCooldown > 0 && <span className="ml-1 text-sm">({heroPowerCooldown})</span>}
      </motion.button>

      {/* End turn button */}
      <motion.button
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEndTurn}
      >
        <span className="font-medium">End {currentPhase}</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
} 
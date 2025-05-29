"use client"

import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"
import type { Teammate } from "../../../../lib/types"

interface TeammateAreaProps {
  teammate: Teammate
  position: "left" | "right"
}

export function TeammateArea({ teammate, position }: TeammateAreaProps) {
  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 flex items-center gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position === "left" ? 0.1 : 0.2 }}
    >
      {/* Hero portrait */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-400">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{teammate.hero.name.charAt(0)}</span>
          </div>
        </div>

        {/* Capital indicator */}
        <div className="absolute -right-2 -bottom-2 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full p-0.5 flex items-center gap-0.5 shadow-md">
          <DollarSign className="w-2 h-2 text-slate-900" />
          <span className="text-xs font-bold text-slate-900">{teammate.capital}</span>
        </div>
      </div>

      {/* Teammate info */}
      <div>
        <div className="text-sm font-medium text-white">{teammate.hero.name}</div>
        <div className="text-xs text-slate-400">{teammate.inventory.length} Products</div>
      </div>

      {/* Hand indicator */}
      <div className="flex">
        {Array.from({ length: teammate.handSize }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-7 bg-indigo-900/50 border border-indigo-700/50 rounded-sm -ml-3 first:ml-0"
            style={{ transform: `rotate(${(i - 1) * 5}deg)` }}
          />
        ))}
      </div>
    </motion.div>
  )
} 
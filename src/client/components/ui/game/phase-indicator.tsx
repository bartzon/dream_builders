"use client"

import { motion } from "framer-motion"
import type { Phase } from "../../../../lib/types"

interface PhaseIndicatorProps {
  currentPhase: Phase
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const phaseColors = {
    Action: "from-emerald-500 to-teal-700",
    Growth: "from-amber-500 to-orange-700",
  }

  return (
    <motion.div
      className={`absolute top-4 bg-gradient-to-r ${phaseColors[currentPhase]} px-4 py-1 rounded-full shadow-lg z-20`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="text-white font-medium">{currentPhase} Phase</span>
    </motion.div>
  )
} 
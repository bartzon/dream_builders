"use client"

import { motion } from "framer-motion"
import { Card } from "./card"
import type { Card as CardType } from "../../../../lib/types"

interface PlayerInventoryProps {
  inventory: CardType[]
}

export function PlayerInventory({ inventory }: PlayerInventoryProps) {
  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-1 mb-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <h3 className="text-xs font-medium text-white">Your Products</h3>
      </div>

      <div className="flex gap-2">
        {inventory.length === 0 ? (
          <div className="w-20 h-28 rounded-lg border-2 border-dashed border-slate-600/50 flex items-center justify-center">
            <span className="text-xs text-slate-500">Empty</span>
          </div>
        ) : (
          inventory.map((card) => <Card key={card.id} card={card} onPlay={() => {}} size="small" />)
        )}
      </div>
    </motion.div>
  )
} 
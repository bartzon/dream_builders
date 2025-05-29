"use client"

import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"
import type { Hero, HeroPower } from "../../../../lib/types"

interface HeroBannerProps {
  hero: Hero
  capital: number
  heroPower: HeroPower
  heroPowerCooldown: number
}

export function HeroBanner({ hero, capital, heroPower, heroPowerCooldown }: HeroBannerProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Hero portrait */}
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg shadow-amber-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{hero.name.charAt(0)}</span>
          </div>
        </motion.div>

        {/* Capital indicator */}
        <motion.div
          className="absolute -right-2 -bottom-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-1 flex items-center gap-1 shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          <DollarSign className="w-3 h-3 text-slate-900" />
          <span className="text-xs font-bold text-slate-900">{capital}</span>
        </motion.div>
      </div>

      {/* Hero name */}
      <div className="mt-1 text-sm font-medium text-white">{hero.name}</div>

      {/* Hero power */}
      <div className="mt-2 relative">
        <motion.div
          className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-md shadow-indigo-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-lg font-bold text-white">+{heroPower.value}</span>
        </motion.div>

        {/* Cooldown overlay */}
        {heroPowerCooldown > 0 && (
          <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">{heroPowerCooldown}</span>
          </div>
        )}
      </div>

      {/* Hero power name */}
      <div className="mt-1 text-xs text-indigo-300">{heroPower.name}</div>
    </div>
  )
} 
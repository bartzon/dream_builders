"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { Card as CardType } from "../../../../lib/types"

interface CardProps {
  card: CardType
  onPlay: () => void
  style?: React.CSSProperties
  canPlay?: boolean
  size?: "small" | "normal" | "large"
}

export function Card({ card, onPlay, style, canPlay = true, size = "normal" }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    small: "w-20 h-28",
    normal: "w-32 h-44",
    large: "w-40 h-56",
  }

  const typeColors = {
    product: "from-emerald-500 to-teal-700",
    service: "from-blue-500 to-indigo-700",
    marketing: "from-purple-500 to-fuchsia-700",
    talent: "from-amber-500 to-orange-700",
    investment: "from-rose-500 to-red-700",
  }

  const typeColor = typeColors[card.type as keyof typeof typeColors] || "from-gray-500 to-gray-700"

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden cursor-pointer`}
      style={style}
      whileHover={{
        y: -20,
        scale: 1.1,
        zIndex: 50,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={canPlay ? onPlay : undefined}
    >
      {/* Card base with gradient border */}
      <div
        className={`absolute inset-0 p-0.5 rounded-lg bg-gradient-to-br ${canPlay ? "from-amber-400 to-amber-600" : "from-gray-400 to-gray-600"}`}
      >
        <div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
          {/* Card header with cost */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-1 flex justify-between items-center">
            <div className="text-xs font-semibold">{card.name}</div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-slate-900">
                {card.cost}
              </div>
            </div>
          </div>

          {/* Card art */}
          <div className={`flex-1 bg-gradient-to-br ${typeColor} relative overflow-hidden`}>
            {/* Placeholder art based on card type */}
            <div className="absolute inset-0 flex items-center justify-center">
              {card.type === "product" && (
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Card type badge */}
            <div className="absolute top-1 right-1 bg-white/20 rounded-full px-2 py-0.5 text-[0.6rem] font-medium text-white">
              {card.type}
            </div>

            {/* Card value badge */}
            {card.value > 0 && (
              <div className="absolute bottom-1 right-1 bg-amber-400 rounded-full px-2 py-0.5 text-[0.6rem] font-bold text-slate-900 flex items-center gap-0.5">
                <span>+{card.value}</span>
                <span className="text-[0.5rem]">$</span>
              </div>
            )}
          </div>

          {/* Card description */}
          <div className="p-1 text-[0.6rem] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 flex-none h-12 overflow-hidden">
            <p className="line-clamp-3">{card.description}</p>
          </div>
        </div>
      </div>

      {/* Disabled overlay */}
      {!canPlay && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Not enough capital</div>
        </div>
      )}

      {/* Hover effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-amber-400/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
} 
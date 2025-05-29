"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Clock, Play, CreditCard } from "lucide-react"
import type { GameLog as GameLogType } from "../../../../lib/types"

interface GameLogProps {
  logs: GameLogType[]
}

export function GameLog({ logs }: GameLogProps) {
  const getLogIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <DollarSign className="w-3 h-3 text-emerald-400" />
      case "turn":
        return <Clock className="w-3 h-3 text-amber-400" />
      case "play":
        return <Play className="w-3 h-3 text-indigo-400" />
      case "power":
        return <CreditCard className="w-3 h-3 text-purple-400" />
      default:
        return null
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case "sale":
        return "text-emerald-400"
      case "turn":
        return "text-amber-400"
      case "play":
        return "text-indigo-400"
      case "power":
        return "text-purple-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <motion.div
      className="bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 w-64 h-48 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-2 bg-slate-800 text-xs font-medium text-white flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Game Log
      </div>

      <div className="h-[calc(100%-28px)] p-2 overflow-y-auto">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              className="mb-2 last:mb-0 text-xs flex items-start gap-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mt-0.5">{getLogIcon(log.type)}</div>
              <div>
                <span className={getLogColor(log.type)}>{log.message}</span>
                {log.type === "sale" && log.amount && <span className="ml-1 text-amber-400">+{log.amount}$</span>}
                <div className="text-[0.6rem] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 
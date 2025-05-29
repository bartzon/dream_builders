import { useState, useCallback } from 'react'
import type { TooltipState, HeroPowerTooltipState, ClientCard } from '../types/game'

export function useTooltip() {
  const [cardTooltip, setCardTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0
  })
  
  const [heroPowerTooltip, setHeroPowerTooltip] = useState<HeroPowerTooltipState>({
    visible: false,
    x: 0,
    y: 0
  })
  
  const showCardTooltip = useCallback((card: ClientCard, event: React.MouseEvent) => {
    setCardTooltip({
      visible: true,
      card,
      x: event.clientX,
      y: event.clientY
    })
  }, [])
  
  const hideCardTooltip = useCallback(() => {
    setCardTooltip({ visible: false, x: 0, y: 0 })
  }, [])
  
  const showHeroPowerTooltip = useCallback((event: React.MouseEvent) => {
    setHeroPowerTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY
    })
  }, [])
  
  const hideHeroPowerTooltip = useCallback(() => {
    setHeroPowerTooltip({ visible: false, x: 0, y: 0 })
  }, [])
  
  return {
    cardTooltip,
    heroPowerTooltip,
    showCardTooltip,
    hideCardTooltip,
    showHeroPowerTooltip,
    hideHeroPowerTooltip
  }
} 
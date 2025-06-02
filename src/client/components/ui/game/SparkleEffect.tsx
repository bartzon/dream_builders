import React, { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  emoji: string
  delay: number
  size: number
}

export const SparkleEffect: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  
  useEffect(() => {
    // Generate 16 sparkles (doubled from 8) at random positions
    const newSparkles: Sparkle[] = []
    const emojis = ['✨', '⭐', '💫', '🌟', '⚡', '💥']
    
    for (let i = 0; i < 16; i++) {
      newSparkles.push({
        id: i,
        x: 5 + Math.random() * 90, // 5-95% of container width
        y: 5 + Math.random() * 90, // 5-95% of container height
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 0.3, // Stagger animations up to 300ms
        size: 24 + Math.random() * 16 // 24-40px size variation
      })
    }
    
    setSparkles(newSparkles)
    
    // Clear sparkles after animation completes
    const timeout = setTimeout(() => {
      setSparkles([])
    }, 2000) // Extended from 1500ms
    
    return () => clearTimeout(timeout)
  }, [])
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10
    }}>
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          style={{
            position: 'absolute',
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
            animation: `sparkle 1.8s ease-out ${sparkle.delay}s forwards`,
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {sparkle.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg) translate(-50%, -50%);
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
          }
          30% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg) translate(-50%, -50%);
            filter: drop-shadow(0 0 16px rgba(255, 215, 0, 1));
          }
          70% {
            opacity: 1;
            transform: scale(1) rotate(360deg) translate(-50%, -50%);
            filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.9));
          }
          100% {
            opacity: 0;
            transform: scale(0.5) rotate(540deg) translate(-50%, -50%);
            filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.4));
          }
        }
      `}</style>
    </div>
  )
} 
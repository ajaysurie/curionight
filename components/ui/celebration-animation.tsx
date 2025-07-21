'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CelebrationAnimation() {
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string }>>([])

  useEffect(() => {
    const emojis = ['🌟', '✨', '🎉', '🎊', '⭐', '🌈', '🎈']
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-4xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
          }}
          animate={{
            y: -100,
            x: `${Math.random() * 200 - 100}%`,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            ease: 'easeOut',
            delay: Math.random() * 0.5,
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <h1 className="bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-6xl font-bold text-transparent">
          Amazing Job! 🌟
        </h1>
      </motion.div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface CurioCharacterProps {
  message?: string
  mood?: 'happy' | 'excited' | 'thinking' | 'sleeping'
  size?: 'small' | 'medium' | 'large'
  showBubble?: boolean
}

export function CurioCharacter({ 
  message, 
  mood = 'happy', 
  size = 'medium',
  showBubble = true 
}: CurioCharacterProps) {
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 150
  }
  
  const animationMap = {
    happy: {
      rotate: [-5, 5, -5],
      y: [0, -5, 0],
    },
    excited: {
      rotate: [-10, 10, -10],
      y: [0, -10, 0],
      scale: [1, 1.1, 1],
    },
    thinking: {
      rotate: [0, 0, 0],
      x: [-2, 2, -2],
    },
    sleeping: {
      rotate: [0, 0, 0],
      y: [0, 2, 0],
    }
  }
  
  return (
    <div className="relative">
      <motion.div
        animate={animationMap[mood]}
        transition={{
          duration: mood === 'sleeping' ? 4 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image 
          src="/curio-logo.png" 
          alt="Curio the Owl" 
          width={sizeMap[size]}
          height={sizeMap[size]}
          className="drop-shadow-lg"
        />
      </motion.div>
      
      {message && showBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="relative rounded-2xl bg-white px-4 py-2 shadow-lg">
            <p className="font-display text-sm text-purple-900">{message}</p>
            <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        </motion.div>
      )}
      
      {mood === 'sleeping' && (
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <span className="text-2xl">💤</span>
        </motion.div>
      )}
      
      {mood === 'thinking' && (
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            times: [0, 0.5, 1],
          }}
        >
          <span className="text-xl">💭</span>
        </motion.div>
      )}
    </div>
  )
}
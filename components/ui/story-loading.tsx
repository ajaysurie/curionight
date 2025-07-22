'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { getRandomFunFact } from '@/lib/services/fun-facts'

interface StoryLoadingProps {
  stage?: 'analyzing' | 'generating' | 'audio'
  progress?: number
}

export function StoryLoading({ stage = 'generating', progress = 0 }: StoryLoadingProps) {
  const [funFact, setFunFact] = useState(getRandomFunFact())
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFunFact(getRandomFunFact())
      setFactIndex(prev => prev + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const stageMessages = {
    analyzing: {
      title: "Finding Science Magic...",
      subtitle: "Looking at your photo for amazing discoveries",
      icon: '🔍',
    },
    generating: {
      title: "Creating Your Story...",
      subtitle: "Mixing science and imagination together",
      icon: '📖',
    },
    audio: {
      title: "Adding Narration...",
      subtitle: "Bringing your story to life with sound",
      icon: '🎙️',
    },
  }

  const currentStage = stageMessages[stage]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950 p-8">
      {/* Animated icon */}
      <motion.div
        animate={
          stage === 'analyzing' 
            ? { rotate: 360 }
            : { scale: [1, 1.2, 1] }
        }
        transition={
          stage === 'analyzing'
            ? { duration: 2, repeat: Infinity, ease: "linear" }
            : { duration: 1.5, repeat: Infinity }
        }
        className="mb-8 text-8xl"
      >
        {currentStage.icon}
      </motion.div>

      {/* Loading message */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-4xl font-bold text-white"
      >
        {currentStage.title}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-xl text-purple-200"
      >
        {currentStage.subtitle}
      </motion.p>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mb-8 h-4 w-64 overflow-hidden rounded-full bg-purple-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-purple-400"
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Fun fact carousel */}
      <div className="relative h-32 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-lg font-semibold text-yellow-300">Did you know?</span>
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <p className="text-xl text-purple-100">
              {funFact}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating particles animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            }}
            animate={{ 
              y: -20,
              x: `+=${(Math.random() - 0.5) * 200}`,
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            <div className="h-2 w-2 rounded-full bg-white/20" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Sparkles, Clock, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { TopicSuggestion } from '@/types/story'

interface TopicCardProps {
  topic: TopicSuggestion
  onSelect: (topic: TopicSuggestion) => void
  index: number
}

export function TopicCard({ topic, onSelect, index }: TopicCardProps) {
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
  }
  
  const difficultyLabels = {
    easy: 'Beginner Explorer',
    medium: 'Science Detective',
    hard: 'Master Scientist',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="group relative cursor-pointer overflow-hidden border-2 border-transparent bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 backdrop-blur transition-all hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/20"
        onClick={() => onSelect(topic)}
      >
        {/* Sparkle animation on hover */}
        <div className="absolute -right-4 -top-4 h-24 w-24 opacity-0 transition-opacity group-hover:opacity-100">
          <Sparkles className="h-full w-full text-yellow-300/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Question */}
          <h3 className="mb-3 text-xl font-bold text-white">
            {topic.question}
          </h3>
          
          {/* Title */}
          <p className="mb-4 text-lg text-purple-200">
            {topic.title}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm">
            {/* Duration estimate */}
            <div className="flex items-center gap-1 text-purple-300">
              <Clock className="h-4 w-4" />
              <span>5 min story</span>
            </div>
            
            {/* Difficulty badge */}
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-purple-300" />
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${difficultyColors[topic.difficulty]}`}>
                {difficultyLabels[topic.difficulty]}
              </span>
            </div>
          </div>
          
          {/* Relevance indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-purple-300">
              <span>Match Score</span>
              <span>{Math.round(topic.relevanceScore * 100)}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-purple-800">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300"
                initial={{ width: 0 }}
                animate={{ width: `${topic.relevanceScore * 100}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </motion.div>
  )
}
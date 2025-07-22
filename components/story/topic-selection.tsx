'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'
import { TopicCard } from './topic-card'
import { Button } from '@/components/ui/button'
import { TopicSuggestion } from '@/types/story'

interface TopicSelectionProps {
  topics: TopicSuggestion[]
  onTopicSelect: (topic: TopicSuggestion) => void
  onRegenerateTopics?: () => void
  isLoading?: boolean
  photoThumbnail?: string
}

export function TopicSelection({ 
  topics, 
  onTopicSelect, 
  onRegenerateTopics,
  isLoading = false,
  photoThumbnail
}: TopicSelectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null)
  
  const handleTopicSelect = (topic: TopicSuggestion) => {
    setSelectedTopic(topic)
    onTopicSelect(topic)
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-400" />
        <p className="text-lg text-purple-200">Finding magical science topics...</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header with photo thumbnail */}
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold text-white">
          What would you like to explore?
        </h2>
        <p className="text-lg text-purple-200">
          Choose a science adventure based on your photo
        </p>
        
        {photoThumbnail && (
          <div className="mx-auto mt-4 h-24 w-24 overflow-hidden rounded-lg border-2 border-purple-400">
            <img 
              src={photoThumbnail} 
              alt="Your photo" 
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Topic cards grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {topics.map((topic, index) => (
          <TopicCard
            key={topic.conceptId}
            topic={topic}
            onSelect={handleTopicSelect}
            index={index}
          />
        ))}
      </motion.div>
      
      {/* Regenerate button */}
      {onRegenerateTopics && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onRegenerateTopics}
            className="border-purple-400 bg-purple-900/50 text-purple-100 hover:bg-purple-800/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Show Different Topics
          </Button>
        </div>
      )}
    </div>
  )
}
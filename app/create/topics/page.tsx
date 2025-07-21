'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChildFriendlyButton } from '@/components/ui/child-friendly-button'
import { useStoryGeneration } from '@/hooks/use-story-generation'
import { getRandomFunFact } from '@/lib/services/fun-facts'
import { toast } from 'sonner'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { DetectedObject, TopicSuggestion } from '@/types/story'
import { cn } from '@/lib/utils'

export default function TopicSelectionPage() {
  const router = useRouter()
  const { generateStory, isGenerating, progress } = useStoryGeneration()
  const [topics, setTopics] = useState<TopicSuggestion[]>([])
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [funFact, setFunFact] = useState(getRandomFunFact())
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])

  useEffect(() => {
    analyzePhoto()
    // Rotate fun facts during loading
    const interval = setInterval(() => {
      setFunFact(getRandomFunFact())
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const analyzePhoto = async () => {
    try {
      const photoUrl = sessionStorage.getItem('photoUrl')
      const childAge = parseInt(sessionStorage.getItem('childAge') || '6')
      
      if (!photoUrl) {
        toast.error('No photo found')
        router.push('/create')
        return
      }

      // Convert to base64 if needed
      let imageData = photoUrl
      if (photoUrl.startsWith('data:')) {
        imageData = photoUrl.split(',')[1]
      }

      const response = await fetch('/api/photos/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: imageData,
          age: childAge 
        }),
      })

      if (!response.ok) throw new Error('Failed to analyze photo')

      const data = await response.json()
      setTopics(data.suggestions)
      setDetectedObjects(data.objects)
    } catch (error) {
      toast.error('Could not analyze the photo')
      router.push('/create')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTopicSelect = async (topic: TopicSuggestion) => {
    setSelectedTopic(topic)
    
    const childName = sessionStorage.getItem('childName') || undefined
    const childAge = parseInt(sessionStorage.getItem('childAge') || '6')
    
    const result = await generateStory({
      objects: detectedObjects,
      conceptId: topic.conceptId,
      age: childAge,
      childName,
      options: {
        tone: 'playful',
        includeExperiment: true,
      },
    })

    if (result) {
      router.push(`/story/${result.shareToken || result.storyId}`)
    }
  }

  if (isAnalyzing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 to-indigo-900 p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8 h-24 w-24"
        >
          <Sparkles className="h-full w-full text-yellow-300" />
        </motion.div>
        <h2 className="mb-4 text-3xl font-bold text-white">Finding Science Magic...</h2>
        <motion.p
          key={funFact}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-md text-center text-lg text-purple-200"
        >
          Did you know? {funFact}
        </motion.p>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 to-indigo-900 p-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mb-8 text-8xl"
        >
          📖
        </motion.div>
        <h2 className="mb-4 text-3xl font-bold text-white">Creating Your Story...</h2>
        <div className="mb-4 h-4 w-64 overflow-hidden rounded-full bg-purple-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-purple-400"
          />
        </div>
        <p className="text-lg text-purple-200">This will just take a moment!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <ChildFriendlyButton
          variant="secondary"
          size="small"
          onClick={() => router.push('/create')}
          className="mb-8"
        >
          <ArrowLeft className="h-6 w-6" />
          Back
        </ChildFriendlyButton>

        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            What Should We Learn About?
          </h1>
          <p className="mb-12 text-xl text-purple-200">
            Choose a topic that looks interesting!
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.conceptId}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleTopicSelect(topic)}
                className="group relative h-full w-full overflow-hidden rounded-3xl bg-white/90 p-6 text-left shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                {/* Difficulty badge */}
                <div className="absolute right-4 top-4">
                  <span className={cn(
                    'rounded-full px-3 py-1 text-sm font-bold',
                    {
                      'bg-green-200 text-green-800': topic.difficulty === 'easy',
                      'bg-yellow-200 text-yellow-800': topic.difficulty === 'medium',
                      'bg-orange-200 text-orange-800': topic.difficulty === 'hard',
                    }
                  )}>
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-purple-900">
                  {topic.title}
                </h3>
                
                <p className="mb-4 text-lg text-gray-700">
                  {topic.question}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600">
                    Tap to explore!
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                  </motion.div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </motion.div>
          ))}
        </div>

        {topics.length === 0 && !isAnalyzing && (
          <div className="text-center">
            <p className="text-xl text-white">No topics found. Let's try another photo!</p>
            <ChildFriendlyButton
              variant="primary"
              size="large"
              onClick={() => router.push('/create')}
              className="mt-6"
            >
              Try Another Photo
            </ChildFriendlyButton>
          </div>
        )}
      </div>
    </div>
  )
}
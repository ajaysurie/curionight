import { useState, useCallback } from 'react'
import { DetectedObject, StoryOptions } from '@/types/story'

interface GenerateStoryParams {
  objects: DetectedObject[]
  conceptId: string
  age: number
  childName?: string
  options?: StoryOptions
}

interface StoryGenerationResult {
  storyId: string
  shareToken: string
  story: any
  generationTime: number
}

export function useStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const generateStory = useCallback(async (params: GenerateStoryParams): Promise<StoryGenerationResult | null> => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 3000)

      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate story')
      }

      const result = await response.json()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story')
      return null
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }, [])

  return {
    generateStory,
    isGenerating,
    error,
    progress,
  }
}
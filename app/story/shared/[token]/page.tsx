'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Import the story viewer component (we'll reuse the existing one)
import StoryPage from '@/app/story/[id]/page'

interface SharedStoryPageProps {
  params: Promise<{
    token: string
  }>
}

export default function SharedStoryPage({ params }: SharedStoryPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const [storyId, setStoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSharedStory()
  }, [token])

  const loadSharedStory = async () => {
    try {
      const response = await fetch(`/api/stories/share/${token}`)
      if (!response.ok) {
        throw new Error('Story not found')
      }
      
      const story = await response.json()
      setStoryId(story.id)
    } catch (error) {
      console.error('Error loading shared story:', error)
      toast.error('Could not load the shared story')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-950 to-indigo-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-24 w-24"
          >
            <Loader2 className="h-full w-full text-purple-300" />
          </motion.div>
          <p className="text-xl text-purple-200">Loading shared story...</p>
        </div>
      </div>
    )
  }

  if (!storyId) {
    return null
  }

  // Reuse the existing story page component with the story ID
  return <StoryPage params={Promise.resolve({ id: storyId })} />
}
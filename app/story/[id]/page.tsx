'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ChildFriendlyButton } from '@/components/ui/child-friendly-button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Home, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface StoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default function StoryPage({ params }: StoryPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [story, setStory] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    loadStory()
  }, [id])

  const loadStory = async () => {
    try {
      const response = await fetch(`/api/stories/${id}`)
      if (!response.ok) throw new Error('Story not found')
      
      const data = await response.json()
      setStory(data)
    } catch (error) {
      toast.error('Could not load the story')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1)
      // Celebrate reaching the last page
      if (currentPage === story.pages.length - 2) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') nextPage()
    else prevPage()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-950 to-indigo-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-24 w-24"
        >
          <div className="h-full w-full rounded-full border-8 border-purple-300 border-t-yellow-300" />
        </motion.div>
      </div>
    )
  }

  if (!story) return null

  const page = story.pages[currentPage]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-indigo-900">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-8xl"
            >
              🎉
            </motion.div>
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute mt-32 text-4xl font-bold text-yellow-300"
            >
              Great job!
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with parent controls */}
      <div className="flex items-center justify-between p-4">
        <ChildFriendlyButton
          variant="secondary"
          size="small"
          onClick={() => router.push('/')}
          className="opacity-70"
        >
          <Home className="h-6 w-6" />
        </ChildFriendlyButton>
        
        <div className="flex items-center gap-2 text-white">
          <span className="text-lg font-medium">
            Page {currentPage + 1} of {story.pages.length}
          </span>
        </div>

        <ChildFriendlyButton
          variant="secondary"
          size="small"
          onClick={() => setIsMuted(!isMuted)}
          className="opacity-70"
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </ChildFriendlyButton>
      </div>

      {/* Story Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-4xl px-8 py-4"
          onTouchStart={(e) => {
            const startX = e.touches[0].clientX
            const handleTouchEnd = (endEvent: TouchEvent) => {
              const endX = endEvent.changedTouches[0].clientX
              const diff = startX - endX
              if (Math.abs(diff) > 50) {
                handleSwipe(diff > 0 ? 'left' : 'right')
              }
              document.removeEventListener('touchend', handleTouchEnd)
            }
            document.addEventListener('touchend', handleTouchEnd)
          }}
        >
          {/* Story Text */}
          <div className="mb-8 rounded-3xl bg-white/90 p-8 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold text-purple-900">
              {story.childName ? `${story.childName}'s Adventure` : 'Your Adventure'}
            </h2>
            <p className="text-2xl leading-relaxed text-gray-800">
              {page.content}
            </p>
          </div>

          {/* Experiment Card (if on experiment page) */}
          {page.experiment && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-teal-500/90 p-6 text-white shadow-2xl"
            >
              <h3 className="mb-4 text-2xl font-bold">🧪 Let's Try It!</h3>
              <h4 className="mb-2 text-xl font-semibold">{page.experiment.title}</h4>
              
              <div className="mb-4">
                <p className="mb-2 font-semibold">You'll need:</p>
                <ul className="list-inside list-disc text-lg">
                  {page.experiment.materials.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-semibold">Steps:</p>
                <ol className="list-inside list-decimal space-y-1 text-lg">
                  {page.experiment.steps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <p className="rounded-xl bg-orange-500/80 p-3 text-sm">
                ⚠️ {page.experiment.safety}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <ChildFriendlyButton
            variant="primary"
            size="large"
            onClick={prevPage}
            disabled={currentPage === 0}
            className={currentPage === 0 ? 'opacity-50' : ''}
          >
            <ChevronLeft className="h-8 w-8" />
            Back
          </ChildFriendlyButton>

          {/* Progress dots */}
          <div className="flex gap-2">
            {story.pages.map((_: any, i: number) => (
              <motion.div
                key={i}
                className={cn(
                  'h-3 w-3 rounded-full transition-colors',
                  i === currentPage ? 'bg-yellow-300' : 'bg-purple-700'
                )}
                animate={i === currentPage ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>

          {currentPage < story.pages.length - 1 ? (
            <ChildFriendlyButton
              variant="primary"
              size="large"
              onClick={nextPage}
            >
              Next
              <ChevronRight className="h-8 w-8" />
            </ChildFriendlyButton>
          ) : (
            <ChildFriendlyButton
              variant="success"
              size="large"
              onClick={() => setCurrentPage(0)}
            >
              <RotateCcw className="h-8 w-8" />
              Read Again
            </ChildFriendlyButton>
          )}
        </div>
      </div>
    </div>
  )
}
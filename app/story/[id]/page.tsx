'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ChildFriendlyButton } from '@/components/ui/child-friendly-button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Home, RotateCcw, Sparkles, Moon, Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Helper function to get gradient background based on page stage
const getPageBackground = (pageNumber: number, totalPages: number): string => {
  const progress = pageNumber / (totalPages - 1)
  
  if (pageNumber === 0) {
    // Calm cover - twilight palette
    return 'bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-950'
  } else if (progress <= 0.5) {
    // Rising action - slightly brighter
    return 'bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-900'
  } else if (progress <= 0.75) {
    // Soothing reset - transitioning darker
    return 'bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950'
  } else {
    // Gentle finish - darkest, most calming
    return 'bg-gradient-to-b from-indigo-950 via-purple-950 to-black'
  }
}

// Helper function to create ambient animations
const AmbientAnimation = ({ pageNumber }: { pageNumber: number }) => {
  // Generate deterministic positions based on index
  const getPosition = (index: number, max: number) => {
    const golden = 1.618033988749895
    return ((index * golden) % 1) * max
  }
  
  if (pageNumber === 0) {
    // Slow breathing stars for cover
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              left: `${getPosition(i, 100)}%`, 
              top: `${getPosition(i + 20, 100)}%` 
            }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.4
            }}
          >
            <Star className="h-4 w-4 text-yellow-300/50" fill="currentColor" />
          </motion.div>
        ))}
      </div>
    )
  }
  
  // Floating particles for other pages
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/20"
          style={{ 
            left: `${getPosition(i, 100)}%`, 
            bottom: `-10px`
          }}
          animate={{ 
            y: [-10, typeof window !== 'undefined' ? -window.innerHeight - 10 : -1000],
            x: [0, ((i % 3) - 1) * 50]
          }}
          transition={{ 
            duration: 10 + (i % 4) * 2.5,
            repeat: Infinity,
            delay: (i % 5) * 2,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Professional storybook page renderer with varied layouts
const renderStorybookPage = (page: any, story: any, pageNumber: number, totalPages: number, nextPage: () => void) => {
  const isFirstPage = pageNumber === 0
  const isLastPage = pageNumber === totalPages - 1
  
  // Different layout patterns for visual variety
  const layoutPattern = pageNumber % 4
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full-bleed background with gradient */}
      <div className={cn(
        "absolute inset-0",
        getPageBackground(pageNumber, totalPages)
      )}>
        {/* Ambient animations */}
        <AmbientAnimation pageNumber={pageNumber} />
        
        {/* Placeholder for future AI-generated illustration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: pageNumber % 2 === 0 ? [0, 5, 0] : [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-[20rem]"
          >
            {getStoryIcon(page.imagePrompt || '', pageNumber)}
          </motion.div>
        </div>
      </div>
      
      {/* Content overlay with varied layouts */}
      {isFirstPage ? (
        // Cover page layout
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="mb-4 text-6xl font-black text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
              {story.childName || 'Explorer'}'s
            </h1>
            <h2 className="text-4xl font-bold text-yellow-300 drop-shadow-lg md:text-5xl">
              Bedtime Adventure
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12"
          >
            <p className="text-2xl font-medium text-purple-100 md:text-3xl">
              A magical journey into
            </p>
            <p className="mt-2 text-3xl font-bold text-white md:text-4xl">
              {story.concept?.name || 'Science & Wonder'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nextPage()}
              className="mt-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-12 py-4 text-2xl font-bold text-white shadow-2xl transition-all hover:shadow-purple-500/25"
            >
              Start Story →
            </motion.button>
          </motion.div>
        </div>
      ) : page.experiment ? (
        // Experiment page - dedicated full page layout
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <div className="rounded-3xl bg-gradient-to-br from-teal-700/90 via-emerald-700/90 to-green-700/90 p-10 backdrop-blur-md shadow-2xl md:p-12">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-center"
              >
                <h2 className="text-5xl font-black text-white md:text-6xl">
                  🧪 Experiment Time! 🧪
                </h2>
                <h3 className="mt-4 text-3xl font-bold text-yellow-200 md:text-4xl">
                  {page.experiment.title}
                </h3>
              </motion.div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm"
                >
                  <h4 className="mb-4 flex items-center text-2xl font-bold text-white">
                    <span className="mr-3 text-3xl">📦</span> What You'll Need
                  </h4>
                  <ul className="space-y-3">
                    {page.experiment.materials.map((item: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center text-xl text-white"
                      >
                        <span className="mr-3 text-yellow-300">✨</span> {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm"
                >
                  <h4 className="mb-4 flex items-center text-2xl font-bold text-white">
                    <span className="mr-3 text-3xl">🔬</span> Let's Do It!
                  </h4>
                  <ol className="space-y-3">
                    {page.experiment.steps.map((step: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex text-xl text-white"
                      >
                        <span className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-base font-bold text-teal-900">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </motion.div>
              </div>
              
              {page.experiment.safety && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 rounded-2xl bg-orange-500/90 p-6 text-white"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">⚠️</span>
                    <div>
                      <h5 className="mb-2 text-xl font-bold">Safety First!</h5>
                      <p className="text-lg">{page.experiment.safety}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      ) : isLastPage ? (
        // Final page layout - centered and peaceful
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mx-auto max-w-3xl rounded-3xl bg-indigo-950/50 p-12 backdrop-blur-md">
              {page.content.split('\n').filter((s: string) => s.trim()).map((paragraph: string, i: number) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 * i }}
                  className="mb-6 text-2xl text-purple-100 md:text-3xl"
                  style={{ 
                    fontFamily: 'Nunito, Poppins, sans-serif',
                    lineHeight: '1.5'
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12"
            >
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <Star className="h-8 w-8 text-yellow-300" fill="currentColor" />
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 text-xl font-medium text-purple-200">
                Sweet dreams, {story.childName || 'little one'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        // Story pages with varied layouts
        <div className="relative z-10 h-full p-8 md:p-12">
          {layoutPattern === 0 ? (
            // Layout 1: Text overlay on bottom left, image space on right
            <div className="flex h-full flex-col justify-end">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl"
              >
                <div className="rounded-2xl bg-black/40 p-8 backdrop-blur-md md:p-10">
                  {renderTextContent(page, pageNumber)}
                </div>
              </motion.div>
            </div>
          ) : layoutPattern === 1 ? (
            // Layout 2: Split screen - text on right, image space on left
            <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
              <div className="order-2 flex items-center md:order-1">
                {/* Space for future image */}
                <div className="flex h-full w-full items-center justify-center">
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-8xl opacity-30"
                  >
                    {getStoryIcon(page.imagePrompt || '', pageNumber)}
                  </motion.div>
                </div>
              </div>
              <div className="order-1 flex items-center md:order-2">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full"
                >
                  <div className="rounded-2xl bg-black/40 p-8 backdrop-blur-md md:p-10">
                    {renderTextContent(page, pageNumber)}
                  </div>
                </motion.div>
              </div>
            </div>
          ) : layoutPattern === 2 ? (
            // Layout 3: Text overlay on top, large image space below
            <div className="flex h-full flex-col">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 max-w-4xl"
              >
                <div className="rounded-2xl bg-black/40 p-8 backdrop-blur-md md:p-10">
                  {renderTextContent(page, pageNumber)}
                </div>
              </motion.div>
              <div className="flex-grow">
                {/* Space for future image */}
              </div>
            </div>
          ) : (
            // Layout 4: Centered card with image background
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-3xl"
              >
                <div className="rounded-3xl bg-black/50 p-10 backdrop-blur-md md:p-12">
                  {renderTextContent(page, pageNumber)}
                </div>
              </motion.div>
            </div>
          )}
          
        </div>
      )}
    </motion.div>
  )
}

// Helper function to render text content
const renderTextContent = (page: any, pageNumber: number) => {
  return (
    <div className="space-y-6">
      {page.content.split('\n').filter((s: string) => s.trim()).map((paragraph: string, i: number) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 * i }}
          className="text-2xl text-white md:text-3xl lg:text-4xl"
          style={{ 
            fontFamily: 'Nunito, Poppins, sans-serif',
            lineHeight: '1.4',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          {paragraph}
        </motion.p>
      ))}
      
      {/* Page indicator */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i === pageNumber 
                  ? "w-6 bg-white" 
                  : i < pageNumber
                  ? "bg-white/60"
                  : "bg-white/30"
              )}
            />
          ))}
        </div>
        
        {/* Audio toggle */}
        <button className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
          <Volume2 className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
}

// Helper function to get appropriate icon based on story content
const getStoryIcon = (imagePrompt: string, pageNumber: number): string => {
  const prompt = imagePrompt.toLowerCase()
  
  // Science category icons
  if (prompt.includes('physics') || prompt.includes('gravity') || prompt.includes('motion')) return '⚛️'
  if (prompt.includes('chemistry') || prompt.includes('molecule') || prompt.includes('reaction')) return '🧪'
  if (prompt.includes('biology') || prompt.includes('plant') || prompt.includes('animal')) return '🌱'
  if (prompt.includes('space') || prompt.includes('planet') || prompt.includes('star')) return '🌟'
  if (prompt.includes('ocean') || prompt.includes('water') || prompt.includes('sea')) return '🌊'
  if (prompt.includes('earth') || prompt.includes('rock') || prompt.includes('mountain')) return '🌍'
  if (prompt.includes('weather') || prompt.includes('cloud') || prompt.includes('rain')) return '☁️'
  if (prompt.includes('light') || prompt.includes('rainbow') || prompt.includes('prism')) return '🌈'
  if (prompt.includes('microscope') || prompt.includes('tiny') || prompt.includes('small')) return '🔬'
  if (prompt.includes('telescope') || prompt.includes('far') || prompt.includes('distant')) return '🔭'
  
  // Story progression icons
  const storyIcons = ['📚', '🌟', '🧭', '🎯', '🎉', '🏆']
  return storyIcons[pageNumber % storyIcons.length] || '✨'
}

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
    <div className="relative h-screen w-full overflow-hidden">
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

      {/* Main story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="h-full w-full"
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
          {renderStorybookPage(page, story, currentPage, story.pages.length, nextPage)}
        </motion.div>
      </AnimatePresence>

      {/* Home button - top left corner */}
      <div className="absolute left-4 top-4 z-20">
        <ChildFriendlyButton
          variant="ghost"
          size="small"
          onClick={() => router.push('/')}
          className="rounded-full bg-white/10 backdrop-blur-sm"
        >
          <Home className="h-6 w-6 text-white" />
        </ChildFriendlyButton>
      </div>

      {/* Navigation controls - minimal UI */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Navigation arrows */}
          {currentPage > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPage}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </motion.button>
          )}
          
          <div className="flex-grow" />
          
          {currentPage < story.pages.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPage}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentPage(0)
                setShowCelebration(true)
                setTimeout(() => setShowCelebration(false), 2000)
              }}
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg"
            >
              <RotateCcw className="mr-2 inline h-5 w-5" />
              Read Again
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
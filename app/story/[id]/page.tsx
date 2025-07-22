'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ChildFriendlyButton } from '@/components/ui/child-friendly-button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Home, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

// Helper function to create visual descriptions
const getVisualDescription = (imagePrompt: string): string => {
  const prompt = imagePrompt.toLowerCase()
  
  if (prompt.includes('experiment')) return 'Time for a fun experiment!'
  if (prompt.includes('discover')) return 'Let\'s make a discovery!'
  if (prompt.includes('explore')) return 'Ready to explore?'
  if (prompt.includes('learn')) return 'Learning something amazing!'
  if (prompt.includes('wonder')) return 'Isn\'t science wonderful?'
  
  return 'Science adventure continues!'
}

// Dynamic page layout renderer
const renderPageLayout = (page: any, story: any, pageNumber: number) => {
  // Different layouts for different pages
  switch (pageNumber) {
    case 0: // Opening page - Big splash
      return (
        <div className="w-full">
          {/* Hero Image Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 p-16 shadow-2xl"
          >
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            <div className="relative text-center">
              <motion.div 
                className="mb-6 text-9xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {getStoryIcon(page.imagePrompt || '', pageNumber)}
              </motion.div>
              <h1 className="mb-4 text-4xl font-bold text-purple-900">
                {story.childName || 'Explorer'}'s Science Adventure!
              </h1>
              <p className="text-xl text-purple-700">
                {getVisualDescription(page.imagePrompt || '')}
              </p>
            </div>
          </motion.div>
          {/* Story content below */}
          <div className="space-y-6">
            {renderStoryContent(page.content, story.childName, pageNumber)}
          </div>
        </div>
      )

    case 1: // Discovery page - Split layout
    case 2:
      return (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-1"
          >
            <div className="sticky top-8 rounded-3xl bg-gradient-to-br from-indigo-200 to-purple-200 p-8 shadow-xl">
              <motion.div 
                className="mb-4 text-center text-7xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {getStoryIcon(page.imagePrompt || '', pageNumber)}
              </motion.div>
              <h3 className="text-center text-lg font-bold text-purple-800">
                {getVisualDescription(page.imagePrompt || '')}
              </h3>
            </div>
          </motion.div>
          {/* Right side - Story */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-1 lg:order-2"
          >
            {renderStoryContent(page.content, story.childName, pageNumber)}
          </motion.div>
        </div>
      )

    case 3: // Middle page - Magazine style
      return (
        <div className="w-full">
          {/* Magazine header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <span className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white">
              Chapter {pageNumber + 1}
            </span>
          </motion.div>
          
          {/* Two column magazine layout */}
          <div className="rounded-3xl bg-white/95 p-8 shadow-2xl">
            <div className="columns-1 gap-8 md:columns-2">
              {/* Floating illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="float-right mb-4 ml-4 w-40"
              >
                <div className="rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-200 p-6 text-center shadow-lg">
                  <div className="text-6xl">{getStoryIcon(page.imagePrompt || '', pageNumber)}</div>
                </div>
              </motion.div>
              
              {/* Story text wrapping around */}
              <div className="prose prose-lg max-w-none">
                {page.content.split('\n').filter(s => s.trim()).map((paragraph: string, i: number) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="mb-4 text-gray-800"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case 4: // Experiment page - Special layout handled separately
      return (
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {renderStoryContent(page.content, story.childName, pageNumber)}
          </motion.div>
        </div>
      )

    case 5: // Ending page - Cozy layout
      return (
        <div className="w-full">
          {/* Dreamy header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 text-center"
          >
            <div className="inline-block rounded-full bg-gradient-to-r from-indigo-900 to-purple-900 p-1">
              <div className="rounded-full bg-gradient-to-b from-indigo-950 to-purple-950 px-12 py-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-4 text-7xl"
                >
                  🌙
                </motion.div>
                <h2 className="text-3xl font-bold text-white">Sweet Dreams!</h2>
              </div>
            </div>
          </motion.div>
          
          {/* Cozy story ending */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl bg-gradient-to-b from-purple-900/50 to-indigo-900/50 p-8 shadow-2xl backdrop-blur">
              {renderStoryContent(page.content, story.childName, pageNumber)}
              
              {/* Stars decoration */}
              <div className="mt-8 text-center">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="mx-1 inline-block text-3xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="w-full">
          {renderStoryContent(page.content, story.childName, pageNumber)}
        </div>
      )
  }
}

// Dynamic story content renderer
const renderStoryContent = (content: string, childName: string | null, pageNumber: number) => {
  const sections = content.split('\n').filter(s => s.trim())
  
  // Detect dialogue by looking for quotation marks
  const processSection = (text: string, index: number) => {
    const isDialogue = text.includes('"') || text.includes('"') || text.includes('"')
    const hasSound = /[A-Z]{2,}!|Whoosh!|Bang!|Pop!|Zoom!|Splash!/i.test(text)
    
    if (isDialogue) {
      // Extract speaker and dialogue
      const dialogueMatch = text.match(/^(.+?):\s*"(.+)"$/) || text.match(/^"(.+)"\s*(.+)$/)
      
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xl">
                  {text.toLowerCase().includes(childName?.toLowerCase() || 'explorer') ? '🧒' : '✨'}
                </div>
              </div>
            </div>
            <div className="flex-1 rounded-2xl bg-purple-50 p-4 shadow-sm">
              <p className="text-lg leading-relaxed text-gray-800">{text}</p>
            </div>
          </div>
        </motion.div>
      )
    }
    
    if (hasSound) {
      const soundEffect = text.match(/[A-Z]{2,}!|Whoosh!|Bang!|Pop!|Zoom!|Splash!/i)?.[0]
      const remainingText = text.replace(/[A-Z]{2,}!|Whoosh!|Bang!|Pop!|Zoom!|Splash!/i, '').trim()
      
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          className="my-6"
        >
          {soundEffect && (
            <motion.div 
              className="mb-4 text-center"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [-5, 5, -5, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 text-3xl font-black text-white shadow-2xl">
                {soundEffect}
              </span>
            </motion.div>
          )}
          {remainingText && (
            <div className="rounded-2xl bg-white/90 p-6 shadow-xl">
              <p className="text-xl leading-relaxed text-gray-800">{remainingText}</p>
            </div>
          )}
        </motion.div>
      )
    }
    
    // Regular narrative text
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className="mb-6"
      >
        <div className="rounded-2xl bg-white/90 p-6 shadow-xl">
          <p className="text-xl leading-relaxed text-gray-800">{text}</p>
        </div>
      </motion.div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-center text-3xl font-bold text-white">
          {pageNumber === 0 ? `${childName || 'Explorer'}'s Adventure Begins!` :
           pageNumber === 5 ? 'Sweet Dreams!' :
           `Chapter ${pageNumber + 1}`}
        </h2>
      </motion.div>
      
      {/* Story Sections */}
      {sections.map((section, i) => processSection(section, i))}
      
      {/* Page Number Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-purple-800/50 px-4 py-2 text-sm font-medium text-purple-100">
          <span>Page {pageNumber + 1} of {6}</span>
          {pageNumber < 5 && <span>• Swipe for more →</span>}
        </span>
      </motion.div>
    </div>
  )
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
    <div className="relative min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
      {/* Animated background stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-30"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
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
          {/* Dynamic Page Layouts */}
          {renderPageLayout(page, story, currentPage)}

          {/* Enhanced Experiment Card (if on experiment page) */}
          {page.experiment && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-white shadow-2xl"
            >
              {/* Decorative background elements */}
              <div className="absolute right-4 top-4 text-6xl opacity-20">🧪</div>
              <div className="absolute bottom-4 left-4 text-4xl opacity-20">⚗️</div>
              
              <div className="relative">
                <motion.h3 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="mb-4 text-3xl font-bold"
                >
                  🧪 Let's Try It!
                </motion.h3>
                <h4 className="mb-6 text-2xl font-semibold text-yellow-100">
                  {page.experiment.title}
                </h4>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Materials section */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm"
                  >
                    <h5 className="mb-3 flex items-center text-xl font-bold">
                      📦 You'll need:
                    </h5>
                    <ul className="space-y-2">
                      {page.experiment.materials.map((item: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center text-lg"
                        >
                          <span className="mr-2 text-yellow-300">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Steps section */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm"
                  >
                    <h5 className="mb-3 flex items-center text-xl font-bold">
                      📋 Steps:
                    </h5>
                    <ol className="space-y-2">
                      {page.experiment.steps.map((step: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="flex text-lg"
                        >
                          <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-teal-800">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                </div>

                {/* Safety notice */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 rounded-2xl bg-orange-500/90 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h6 className="font-bold text-white">Safety First!</h6>
                      <p className="text-orange-100">{page.experiment.safety}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-8">
        <div className="mx-auto max-w-4xl">
          {/* Navigation background */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-3xl bg-white/10 p-6 backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <ChildFriendlyButton
                variant="primary"
                size="large"
                onClick={prevPage}
                disabled={currentPage === 0}
                className={cn(
                  'transition-all duration-200',
                  currentPage === 0 ? 'opacity-50 scale-95' : 'hover:scale-105'
                )}
              >
                <ChevronLeft className="h-8 w-8" />
                Back
              </ChildFriendlyButton>

              {/* Enhanced Progress visualization */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  {story.pages.map((_: any, i: number) => (
                    <motion.div
                      key={i}
                      className={cn(
                        'h-4 w-4 rounded-full transition-all duration-300 cursor-pointer',
                        i === currentPage 
                          ? 'bg-yellow-300 shadow-lg shadow-yellow-300/50' 
                          : i < currentPage
                          ? 'bg-green-400'
                          : 'bg-purple-700/50'
                      )}
                      animate={i === currentPage ? { 
                        scale: [1, 1.3, 1],
                        boxShadow: ['0 0 0 0 rgba(252, 211, 77, 0.7)', '0 0 0 10px rgba(252, 211, 77, 0)', '0 0 0 0 rgba(252, 211, 77, 0)']
                      } : {}}
                      transition={{ duration: 0.6 }}
                      onClick={() => setCurrentPage(i)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white/80">
                  Page {currentPage + 1} of {story.pages.length}
                </span>
              </div>

              {currentPage < story.pages.length - 1 ? (
                <ChildFriendlyButton
                  variant="primary"
                  size="large"
                  onClick={nextPage}
                  className="hover:scale-105 transition-all duration-200"
                >
                  Next
                  <ChevronRight className="h-8 w-8" />
                </ChildFriendlyButton>
              ) : (
                <ChildFriendlyButton
                  variant="success"
                  size="large"
                  onClick={() => {
                    setCurrentPage(0)
                    // Add a little celebration for completing the story
                    setShowCelebration(true)
                    setTimeout(() => setShowCelebration(false), 2000)
                  }}
                  className="hover:scale-105 transition-all duration-200"
                >
                  <RotateCcw className="h-8 w-8" />
                  Read Again
                </ChildFriendlyButton>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
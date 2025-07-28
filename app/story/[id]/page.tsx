'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { StoryPageViewer } from '@/components/story/story-page-viewer'
import { ShareStory } from '@/components/ui/share-story'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { CurioCharacter } from '@/components/story/curio-character'
import { toast } from 'sonner'
import { useSimpleTTS } from '@/hooks/use-simple-tts'

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
  const [isMuted, setIsMuted] = useState(true) // Start muted to respect autoplay policies
  const [showCelebration, setShowCelebration] = useState(false)
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([])
  const { isSupported: isTTSSupported, isSpeaking, speak, stop } = useSimpleTTS()
  const [isBrowserTTS, setIsBrowserTTS] = useState(false)

  useEffect(() => {
    loadStory()
  }, [id])

  useEffect(() => {
    // Check if using browser TTS
    if (story?.audioUrls && story.audioUrls.length > 0) {
      const firstUrl = story.audioUrls[0]
      if (firstUrl.startsWith('browser-tts:')) {
        setIsBrowserTTS(true)
      } else if (firstUrl && firstUrl !== '') {
        // Load audio for all pages
        const audios = story.audioUrls.map((url: string) => {
          if (url && !url.startsWith('browser-tts:')) {
            const audio = new Audio(url)
            audio.preload = 'auto'
            return audio
          }
          return null
        }).filter(Boolean) as HTMLAudioElement[]
        setAudioElements(audios)
      } else {
        // No valid audio URLs, use browser TTS as fallback
        setIsBrowserTTS(true)
      }
    } else {
      // No audio URLs found in story, use browser TTS
      setIsBrowserTTS(true)
    }
  }, [story])

  // Auto-play audio on page change if already unmuted
  useEffect(() => {
    if (!isMuted && story?.pages?.[currentPage] && isBrowserTTS && isTTSSupported) {
      // Small delay to ensure content is ready
      const timer = setTimeout(() => {
        speak(story.pages[currentPage].content)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentPage, isMuted, story, isBrowserTTS, isTTSSupported, speak])

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
      // Stop current audio before changing page
      if (isBrowserTTS && isTTSSupported) {
        stop()
      }
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
      // Stop current audio before changing page
      if (isBrowserTTS && isTTSSupported) {
        stop()
      }
      setCurrentPage(currentPage - 1)
    }
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    
    // Use the new state value directly
    if (!newMutedState) {
      // Unmuted - start playing
      if (isBrowserTTS && isTTSSupported && story?.pages?.[currentPage]) {
        // Small delay to ensure state has updated
        setTimeout(() => {
          speak(story.pages[currentPage].content)
        }, 10)
      } else if (audioElements[currentPage]) {
        audioElements[currentPage].play().catch((err) => console.error('Audio play error:', err))
      }
    } else {
      // Muted - stop playing
      if (isBrowserTTS && isTTSSupported) {
        stop()
      } else {
        audioElements.forEach(audio => audio.pause())
      }
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
      
      {/* Curio Guide for first page */}
      {currentPage === 0 && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-20 left-8 z-30"
        >
          <CurioCharacter 
            message="Let's explore together!" 
            mood="excited" 
            size="medium"
          />
        </motion.div>
      )}

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
          <StoryPageViewer
            page={page}
            story={story}
            pageNumber={currentPage}
            totalPages={story.pages.length}
            onNext={nextPage}
          />
        </motion.div>
      </AnimatePresence>

      {/* Top controls */}
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <Home className="h-6 w-6 text-white" />
        </button>
        
        <div className="flex gap-2">
          <motion.button
            onClick={toggleMute}
            className="relative rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-6 w-6 text-white" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-2 py-1 text-xs text-white"
                >
                  Tap for narration
                </motion.div>
              </>
            ) : (
              <>
                <Volume2 className="h-6 w-6 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ 
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' 
                  }}
                />
              </>
            )}
          </motion.button>
          
          <ShareStory
            storyId={story.id}
            shareToken={story.shareToken}
            childName={story.childName}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Previous button */}
          {currentPage > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPage}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </motion.button>
          )}
          
          {/* Page indicator */}
          <div className="flex-grow px-8">
            <div className="mx-auto flex max-w-xs justify-center gap-1">
              {story.pages.map((_: any, i: number) => (
                <div
                  key={i}
                  className={`h-2 transition-all ${
                    i === currentPage 
                      ? 'w-8 bg-white' 
                      : i < currentPage
                      ? 'w-2 bg-white/60'
                      : 'w-2 bg-white/30'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
          
          {/* Next button or restart */}
          {currentPage < story.pages.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPage}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
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
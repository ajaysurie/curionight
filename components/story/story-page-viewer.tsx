'use client'

import { motion } from 'framer-motion'
import { StoryPage } from '@/types/story'
import { cn } from '@/lib/utils'
import { getChildName } from '@/lib/utils/names'

// Remove voice markers from text for display
function cleanVoiceMarkers(text: string): string {
  return text.replace(/\{\{\w+:"(.*?)"\}\}/g, '$1')
}

interface StoryPageViewerProps {
  page: StoryPage
  story: any
  pageNumber: number
  totalPages: number
  onNext?: () => void
}

export function StoryPageViewer({ 
  page, 
  story, 
  pageNumber, 
  totalPages,
  onNext 
}: StoryPageViewerProps) {
  const isFirstPage = pageNumber === 0
  const isLastPage = pageNumber === totalPages - 1
  
  if (isFirstPage) {
    return <CoverPage story={story} page={page} onStart={onNext} />
  }
  
  if (isLastPage) {
    return <EndingPage page={page} story={story} />
  }
  
  // Regular story pages with different layouts
  const layoutType = pageNumber % 3
  
  switch (layoutType) {
    case 0:
      return <FullBleedLayout page={page} />
    case 1:
      return <SplitLayout page={page} />
    case 2:
      return <FloatingTextLayout page={page} />
    default:
      return <FullBleedLayout page={page} />
  }
}

// Cover page with full imagery
function CoverPage({ story, page, onStart }: { story: any; page: StoryPage; onStart?: () => void }) {
  const childName = getChildName(story.childName)
  
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background image if available */}
      {page.imageUrl ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={page.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </motion.div>
      ) : (
        <>
          {/* Background gradient */}
          <div className="absolute inset-0 galaxy-gradient" />
          
          {/* Animated stars */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Title content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 font-display text-6xl font-black text-white drop-shadow-2xl md:text-8xl"
        >
          {story.topicPreview?.title || `${childName}'s Science Adventure`}
        </motion.h1>
        
        {/* Show page content if available */}
        {page.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 max-w-3xl"
          >
            {page.content.split('\n').filter(s => s.trim()).map((paragraph, i) => (
              <p key={i} className="mb-4 font-body text-xl text-white md:text-2xl">
                {cleanVoiceMarkers(paragraph)}
              </p>
            ))}
          </motion.div>
        )}
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 font-body text-xl text-purple-200 md:text-2xl"
        >
          Discovering {story.concept?.name || 'Amazing Science'}
        </motion.p>
        
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="btn-primary px-12 py-4 text-2xl font-bold shadow-2xl transition-all hover:shadow-purple-500/25"
        >
          Begin Story →
        </motion.button>
      </div>
    </div>
  )
}

// Full bleed image with text overlay
function FullBleedLayout({ page }: { page: StoryPage }) {
  return (
    <div className="relative h-full w-full">
      {/* Background image */}
      {page.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={page.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      )}
      
      {/* Text content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
      >
        <div className="mx-auto max-w-4xl">
          {page.content.split('\n').filter(s => s.trim()).map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="mb-4 font-body text-2xl leading-relaxed text-white drop-shadow-lg md:text-3xl"
            >
              {cleanVoiceMarkers(paragraph)}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Split screen layout
function SplitLayout({ page }: { page: StoryPage }) {
  return (
    <div className="flex h-full">
      {/* Image side */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-1/2"
      >
        {page.imageUrl ? (
          <img
            src={page.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-800 to-indigo-900" />
        )}
      </motion.div>
      
      {/* Text side */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-1/2 items-center bg-gradient-to-br from-indigo-950 to-purple-950 p-8 md:p-12"
      >
        <div>
          {page.content.split('\n').filter(s => s.trim()).map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="mb-6 font-body text-xl leading-relaxed text-white md:text-2xl"
            >
              {cleanVoiceMarkers(paragraph)}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Floating text over image
function FloatingTextLayout({ page }: { page: StoryPage }) {
  return (
    <div className="relative h-full w-full">
      {/* Full background image */}
      {page.imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={page.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      )}
      
      {/* Floating text cards */}
      <div className="relative z-10 flex h-full items-center justify-center p-8">
        <div className="max-w-3xl space-y-4">
          {page.content.split('\n').filter(s => s.trim()).map((paragraph, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="rounded-2xl bg-white/90 p-6 backdrop-blur-sm"
            >
              <p className="font-body text-xl leading-relaxed text-gray-800 md:text-2xl">
                {cleanVoiceMarkers(paragraph)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Ending page
function EndingPage({ page, story }: { page: StoryPage; story: any }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Dreamy background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
        {/* Twinkling stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-indigo-950/50 p-12 backdrop-blur-md"
        >
          {page.content.split('\n').filter(s => s.trim()).map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 * i }}
              className="mb-6 text-2xl text-purple-100 md:text-3xl"
            >
              {cleanVoiceMarkers(paragraph)}
            </motion.p>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="text-4xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <p className="mt-4 text-xl font-medium text-purple-200">
            Sweet dreams, {getChildName(story.childName)}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// Magazine-style layout
function MagazineLayout({ page }: { page: StoryPage }) {
  const isEven = page.pageNumber % 2 === 0
  
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-12">
      <div className="mx-auto grid h-full max-w-7xl gap-8 md:grid-cols-2">
        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col justify-center ${isEven ? 'md:order-1' : 'md:order-2'}`}
        >
          <div className="space-y-6">
            {page.content.split('\n').filter(s => s.trim()).map((paragraph, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {i === 0 ? (
                  <p className="text-3xl font-bold leading-tight text-gray-800 md:text-4xl">
                    {cleanVoiceMarkers(paragraph)}
                  </p>
                ) : (
                  <p className="text-xl leading-relaxed text-gray-700 md:text-2xl">
                    {cleanVoiceMarkers(paragraph)}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative ${isEven ? 'md:order-2' : 'md:order-1'}`}
        >
          {page.imageUrl && (
            <div className="relative h-full overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={page.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-yellow-300/30 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-purple-300/30 blur-2xl" />
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Page number decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-purple-300" />
          <span className="text-sm font-medium text-purple-600">
            Page {page.pageNumber + 1}
          </span>
          <div className="h-1 w-8 rounded-full bg-purple-300" />
        </div>
      </motion.div>
    </div>
  )
}
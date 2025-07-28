'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChildFriendlyButton } from '@/components/ui/child-friendly-button'
import { useStoryGeneration } from '@/hooks/use-story-generation'
import { getRandomFunFact } from '@/lib/services/fun-facts'
import { scienceConcepts } from '@/lib/ai/concepts'
import { toast } from 'sonner'
import { Sparkles, ArrowLeft, Atom, Leaf, Beaker, Globe, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryIcons = {
  Physics: Atom,
  Chemistry: Beaker,
  Biology: Leaf,
  'Earth Science': Globe,
  Engineering: Sparkles,
}

const categoryColors = {
  Physics: 'from-blue-500 to-purple-600',
  Chemistry: 'from-green-500 to-teal-600',
  Biology: 'from-emerald-500 to-green-600',
  'Earth Science': 'from-orange-500 to-red-600',
  Engineering: 'from-purple-500 to-indigo-600',
}

export default function PresetTopicsPage() {
  console.log('PresetTopicsPage rendering')
  const router = useRouter()
  const { generateStory, isGenerating, progress } = useStoryGeneration()
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [funFact, setFunFact] = useState(getRandomFunFact())

  // Group concepts by category
  const conceptsByCategory = scienceConcepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = []
    }
    acc[concept.category].push(concept)
    return acc
  }, {} as Record<string, typeof scienceConcepts>)

  const handleTopicSelect = async (conceptId: string) => {
    try {
      setSelectedConcept(conceptId)
      
      const childName = sessionStorage.getItem('childName') || undefined
      const childAge = parseInt(sessionStorage.getItem('childAge') || '6')
      
      // Check if we have emojis from the magic pot
      const storyEmojis = sessionStorage.getItem('storyEmojis')
      const objects = storyEmojis ? JSON.parse(storyEmojis) : []
      
      const result = await generateStory({
        objects, // Use emojis as story hints
        conceptId,
        age: childAge,
        childName,
        options: {
          tone: 'playful',
          includeExperiment: true,
        },
      })

      // Clear the emojis after use
      if (storyEmojis) {
        sessionStorage.removeItem('storyEmojis')
      }

      if (result) {
        router.push(`/story/${result.shareToken || result.storyId}`)
      } else {
        // Show error toast if generation failed
        toast.error('Failed to generate story. Please try again.')
        setSelectedConcept(null)
      }
    } catch (error) {
      console.error('Story generation error:', error)
      toast.error('Something went wrong. Please try again.')
      setSelectedConcept(null)
    }
  }

  if (isGenerating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 to-indigo-900 p-8">
        <div className="mb-8 text-8xl animate-pulse">
          📖
        </div>
        <h2 className="mb-4 text-3xl font-bold text-white">Creating Your Story...</h2>
        <div className="mb-4 h-4 w-64 overflow-hidden rounded-full bg-purple-800">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-purple-400 transition-all duration-300"
          />
        </div>
        <p className="max-w-md text-center text-lg text-purple-200">
          Did you know? {funFact}
        </p>
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
            🌟 Choose Your Science Adventure!
          </h1>
          <p className="mb-12 text-xl text-purple-200">
            Pick a topic that sparks your curiosity!
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(conceptsByCategory).map(([category, concepts]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Sparkles
            const gradientClass = categoryColors[category as keyof typeof categoryColors] || 'from-purple-500 to-indigo-600'
            
            return (
              <div key={category}>
                <div className="mb-6 flex items-center justify-center gap-3">
                  <IconComponent className="h-8 w-8 text-yellow-300" />
                  <h2 className="text-3xl font-bold text-white">{category}</h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {concepts.map((concept, index) => (
                    <div key={concept.id}>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleTopicSelect(concept.id)
                        }}
                        disabled={isGenerating || selectedConcept === concept.id}
                        type="button"
                        className="group relative h-full w-full overflow-hidden rounded-3xl bg-white/90 p-6 text-left shadow-xl transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50"
                      >
                        {/* Background gradient */}
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-br transition-opacity",
                          selectedConcept === concept.id ? "opacity-30" : "opacity-10 group-hover:opacity-20",
                          gradientClass
                        )} />
                        
                        {/* Loading indicator */}
                        {selectedConcept === concept.id && isGenerating && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                            <div className="animate-spin">
                              <Sparkles className="h-12 w-12 text-purple-600" />
                            </div>
                          </div>
                        )}
                        
                        {/* Age badge */}
                        <div className="absolute right-4 top-4">
                          <span className="rounded-full bg-purple-200 px-3 py-1 text-sm font-bold text-purple-800">
                            Ages {concept.ageRange.min}-{concept.ageRange.max}
                          </span>
                        </div>

                        <h3 className="relative mb-3 text-2xl font-bold text-purple-900">
                          {concept.name}
                        </h3>
                        
                        <p className="relative mb-4 text-lg text-gray-700">
                          {concept.description}
                        </p>

                        <div className="relative flex items-center justify-between">
                          <span className="text-sm text-purple-600">
                            Tap to explore! 🚀
                          </span>
                          <div className="animate-pulse">
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-lg text-purple-200">
            Want to use a photo instead?
          </p>
          <ChildFriendlyButton
            variant="secondary"
            size="medium"
            onClick={() => router.push('/create')}
          >
            <Camera className="h-6 w-6" />
            Upload Photo
          </ChildFriendlyButton>
        </div>
      </div>
    </div>
  )
}
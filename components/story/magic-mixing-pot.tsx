'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, Sparkles, X, Wand2, Plus } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MagicMixingPotProps {
  onClose?: () => void
}

// Popular science-related emojis grouped by category
const EMOJI_CATEGORIES = {
  'Animals': ['🦁', '🐘', '🦒', '🦋', '🐙', '🦅', '🐢', '🦈', '🐝', '🦎'],
  'Nature': ['🌳', '🌺', '🌊', '🏔️', '⛰️', '🌋', '🌈', '☀️', '🌙', '⭐'],
  'Science': ['🔬', '🧪', '🧬', '🔭', '🌡️', '⚡', '🧲', '💎', '🪐', '🚀'],
  'Objects': ['🎈', '🪁', '⚽', '🎨', '🎪', '🏰', '🚂', '✈️', '🚢', '🎸'],
  'Weather': ['☁️', '⛈️', '🌪️', '❄️', '🌤️', '🌦️', '🌧️', '⛅', '🌩️', '🌨️'],
  'Food': ['🍎', '🍕', '🍦', '🧁', '🍿', '🥤', '🍪', '🍭', '🍫', '🍬']
}

export function MagicMixingPot({ onClose }: MagicMixingPotProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [ingredients, setIngredients] = useState<Array<{ type: 'photo' | 'emoji', content: string, id: string }>>([])
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('Animals')
  const [showMagicAnimation, setShowMagicAnimation] = useState(false)

  // Check if we already have the child's info
  useEffect(() => {
    const storedName = sessionStorage.getItem('childName')
    const storedAge = sessionStorage.getItem('childAge')
    
    if (storedName && storedAge) {
      setChildName(storedName)
      setChildAge(storedAge)
    } else {
      setShowNameInput(true)
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    // Check if it's an emoji being dropped
    const emoji = e.dataTransfer.getData('emoji')
    if (emoji) {
      addIngredient('emoji', emoji)
      return
    }

    // Otherwise handle file drops
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    for (const file of files) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          addIngredient('photo', event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    for (const file of files) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          addIngredient('photo', event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addIngredient = (type: 'photo' | 'emoji', content: string) => {
    if (ingredients.length >= 5) {
      toast.error('The mixing pot is full! Remove some ingredients first.')
      return
    }
    
    const id = `${type}-${Date.now()}-${Math.random()}`
    setIngredients(prev => [...prev, { type, content, id }])
    
    // Add a little animation feedback
    setShowMagicAnimation(true)
    setTimeout(() => setShowMagicAnimation(false), 500)
  }

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(item => item.id !== id))
  }

  const handleCreateStory = async () => {
    if (ingredients.length === 0) {
      toast.error('Add some ingredients to the mixing pot first!')
      return
    }

    if (showNameInput && (!childName || !childAge)) {
      toast.error('Please enter your name and age')
      return
    }

    // Store child info
    sessionStorage.setItem('childName', childName)
    sessionStorage.setItem('childAge', childAge)
    window.dispatchEvent(new Event('childNameUpdated'))

    setIsCreating(true)

    try {
      // For photos, we'll analyze the first one
      // For emojis, we'll use them as concept hints
      if (ingredients.some(i => i.type === 'photo')) {
        const firstPhoto = ingredients.find(i => i.type === 'photo')
        if (firstPhoto) {
          sessionStorage.setItem('photoUrl', firstPhoto.content)
          router.push('/create/topics')
        }
      } else {
        // For emoji-only stories, generate directly
        const emojis = ingredients.filter(i => i.type === 'emoji').map(i => i.content)
        
        // Convert emojis to objects format expected by the API
        const objects = emojis.map(emoji => ({
          name: emoji,
          confidence: 1.0
        }))
        
        // Create a story generation request
        const response = await fetch('/api/stories/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            objects,
            conceptId: 'emoji-adventure', // Special concept for emoji stories
            age: parseInt(childAge),
            childName,
            options: {
              tone: 'playful', // Use allowed tone value
              includeExperiment: true,
            },
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Story generation failed:', errorText)
          throw new Error('Failed to generate story')
        }

        const story = await response.json()
        router.push(`/story/${story.shareToken || story.id}`)
      }
    } catch (error) {
      console.error('Error creating story:', error)
      toast.error('Something went wrong. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl border-purple-600 bg-gradient-to-b from-purple-950 to-indigo-950 relative overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Wand2 className="h-8 w-8 text-yellow-300" />
              Curio's Magic Story Pot
              <Wand2 className="h-8 w-8 text-yellow-300 scale-x-[-1]" />
            </h2>
            <p className="text-purple-200">
              Drop photos or pick emojis to create your magical science story!
            </p>
          </div>

          {/* Name input if needed */}
          {showNameInput && (
            <div className="mb-6 bg-purple-900/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">First, tell Curio about you!</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-purple-100 text-xs">Your Name</Label>
                  <Input
                    id="name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your name"
                    className="border-purple-600 bg-purple-800/50 text-white placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-purple-100 text-xs">Your Age</Label>
                  <select
                    id="age"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-purple-600 bg-purple-800/50 px-3 py-2 text-sm text-white"
                  >
                    <option value="">Select age</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                    <option value="6">6 years</option>
                    <option value="7">7 years</option>
                    <option value="8">8 years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Mixing Pot */}
          <div className="mb-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative h-64 rounded-2xl border-4 border-dashed transition-all",
                isDragging ? "border-yellow-400 bg-yellow-400/10" : "border-purple-600 bg-purple-900/30",
                showMagicAnimation && "animate-pulse"
              )}
            >
              {/* Pot visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pot shape */}
                  <div className="w-48 h-40 bg-gradient-to-b from-purple-700 to-purple-900 rounded-b-full relative">
                    {/* Bubbles animation */}
                    {ingredients.length > 0 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="animate-bounce absolute bottom-4 left-8 w-4 h-4 bg-purple-400 rounded-full opacity-60" />
                        <div className="animate-bounce absolute bottom-6 right-10 w-3 h-3 bg-purple-300 rounded-full opacity-50" style={{ animationDelay: '0.2s' }} />
                        <div className="animate-bounce absolute bottom-8 left-1/2 w-5 h-5 bg-purple-400 rounded-full opacity-40" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                  
                  {/* Ingredients display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2">
                      {ingredients.slice(0, 5).map((ingredient, idx) => (
                        <div
                          key={ingredient.id}
                          className="relative group animate-bounce"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          {ingredient.type === 'photo' ? (
                            <img
                              src={ingredient.content}
                              alt="Ingredient"
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white/50"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">
                              {ingredient.content}
                            </div>
                          )}
                          <button
                            onClick={() => removeIngredient(ingredient.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty state */}
              {ingredients.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-300">
                  <Upload className="h-12 w-12 mb-2" />
                  <p className="text-sm">Drag photos here or pick emojis below</p>
                </div>
              )}

              {/* Sparkle effects */}
              <Sparkles className="absolute top-4 left-4 h-6 w-6 text-yellow-300 opacity-60" />
              <Sparkles className="absolute bottom-4 right-4 h-5 w-5 text-yellow-300 opacity-40" />
              <Sparkles className="absolute top-8 right-8 h-4 w-4 text-purple-300 opacity-50" />
            </div>

            {/* File input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Action buttons */}
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-purple-600 text-purple-200 hover:bg-purple-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Photo
              </Button>
              <span className="text-purple-400 text-sm py-2">or choose emojis below</span>
            </div>
          </div>

          {/* Emoji Selection */}
          <div className="mb-6">
            <div className="flex gap-2 mb-3 flex-wrap">
              {Object.keys(EMOJI_CATEGORIES).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-10 gap-2 p-4 bg-purple-900/30 rounded-lg">
              {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map(emoji => (
                <div
                  key={emoji}
                  draggable={ingredients.length < 5}
                  onDragStart={(e) => {
                    if (ingredients.length >= 5) {
                      e.preventDefault()
                      return
                    }
                    e.dataTransfer.setData('emoji', emoji)
                    e.dataTransfer.effectAllowed = 'copy'
                    // Add visual feedback
                    e.currentTarget.classList.add('opacity-50')
                  }}
                  onDragEnd={(e) => {
                    // Remove visual feedback
                    e.currentTarget.classList.remove('opacity-50')
                  }}
                  onClick={() => addIngredient('emoji', emoji)}
                  className="text-2xl hover:scale-110 transition-transform p-2 hover:bg-white/10 rounded cursor-move select-none"
                  style={{ 
                    opacity: ingredients.length >= 5 ? 0.5 : 1,
                    cursor: ingredients.length >= 5 ? 'not-allowed' : 'move'
                  }}
                  title={ingredients.length >= 5 ? 'Pot is full!' : `Drag ${emoji} to the pot`}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Create Story Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleCreateStory}
              disabled={ingredients.length === 0 || isCreating || (showNameInput && (!childName || !childAge))}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 hover:from-yellow-400 hover:to-orange-400 px-8 py-6 text-lg font-bold disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Create My Story!
                </>
              )}
            </Button>
          </div>

          {/* Ingredient count */}
          <p className="text-center text-sm text-purple-400 mt-2">
            {ingredients.length}/5 ingredients in the pot
          </p>
        </div>
      </Card>
    </div>
  )
}
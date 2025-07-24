'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Book, Clock, ArrowLeft, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Failed to load stories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get category from URL params
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const categoryFilter = searchParams.get('category')

  // Group stories by category
  const storiesByCategory = stories.reduce((acc, story) => {
    const category = story.concept?.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(story)
    return acc
  }, {} as Record<string, any[]>)

  // Filter by category if specified
  const displayCategories = categoryFilter 
    ? { [categoryFilter]: storiesByCategory[categoryFilter] || [] }
    : storiesByCategory

  // Function to get a color gradient based on story concept
  const getStoryGradient = (concept: any) => {
    const category = concept?.category || 'default'
    const gradients = {
      'Physics': 'from-blue-500 to-purple-600',
      'Chemistry': 'from-green-500 to-teal-600',
      'Biology': 'from-emerald-500 to-green-600',
      'Earth Science': 'from-orange-500 to-red-600',
      'Engineering': 'from-purple-500 to-indigo-600',
      'default': 'from-purple-700 to-indigo-700'
    }
    return gradients[category as keyof typeof gradients] || gradients.default
  }

  // Function to get an icon based on story concept
  const getStoryIcon = (concept: any) => {
    const category = concept?.category || 'default'
    const icons: { [key: string]: JSX.Element } = {
      'Physics': <span className="text-3xl">⚛️</span>,
      'Chemistry': <span className="text-3xl">🧪</span>,
      'Biology': <span className="text-3xl">🌿</span>,
      'Earth Science': <span className="text-3xl">🌍</span>,
      'Engineering': <span className="text-3xl">⚙️</span>,
      'default': <Book className="h-10 w-10 text-white/50" />
    }
    return icons[category] || icons.default
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-white hover:text-purple-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">All Stories</h1>
          <p className="text-purple-200">Explore all the magical science adventures</p>
        </div>

        {/* Stories by Category */}
        {loading ? (
          <div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-10">
                <div className="h-8 w-48 bg-purple-800/50 rounded animate-pulse mb-4" />
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-64 flex-shrink-0">
                      <div className="h-36 bg-purple-800/50 rounded-lg animate-pulse mb-2" />
                      <div className="h-4 bg-purple-800/50 rounded animate-pulse mb-1" />
                      <div className="h-3 bg-purple-800/50 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <Card className="border-purple-700 bg-purple-900/50">
            <CardContent className="py-16 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-300" />
              <h2 className="text-2xl font-bold text-white mb-2">No Stories Yet</h2>
              <p className="text-purple-200 mb-6">Start creating magical science adventures!</p>
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Your First Story
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div>
            {categoryFilter && (
              <div className="mb-6">
                <Link href="/stories">
                  <Button variant="ghost" className="text-purple-200 hover:text-white">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    All Categories
                  </Button>
                </Link>
              </div>
            )}
            
            {Object.entries(displayCategories).map(([category, categoryStories]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {category} Adventures
                  <span className="text-base font-normal text-purple-300 ml-3">
                    ({categoryStories.length} {categoryStories.length === 1 ? 'story' : 'stories'})
                  </span>
                </h2>
                
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {categoryStories.map((story) => {
                    const gradient = getStoryGradient(story.concept)
                    
                    return (
                      <Link 
                        key={story.id} 
                        href={`/story/${story.shareToken || story.id}`}
                        className="group"
                      >
                        <div className="transform transition-transform hover:scale-105">
                          {/* Enhanced Story Thumbnail */}
                          <div className={`h-44 rounded-lg bg-gradient-to-br ${gradient} relative overflow-hidden mb-2`}>
                            {/* Curio Owl Illustration */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                {/* Curio silhouette */}
                                <div className="w-24 h-24 opacity-20">
                                  <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                                    <circle cx="50" cy="35" r="25"/>
                                    <ellipse cx="50" cy="65" rx="20" ry="25"/>
                                    <circle cx="40" cy="30" r="8"/>
                                    <circle cx="60" cy="30" r="8"/>
                                    <polygon points="50,40 45,45 55,45"/>
                                  </svg>
                                </div>
                                {/* Science elements */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-5xl opacity-70">{getStoryIcon(story.concept)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Age badge */}
                            {story.childAge && (
                              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                                <span className="text-sm font-semibold text-white">Age {story.childAge}</span>
                              </div>
                            )}
                            
                            {/* Sparkle effects */}
                            <div className="absolute top-3 left-3">
                              <Sparkles className="h-5 w-5 text-yellow-300 opacity-60" />
                            </div>
                            <div className="absolute bottom-3 right-10">
                              <Sparkles className="h-4 w-4 text-white opacity-40" />
                            </div>
                          </div>
                          
                          {/* Story Info */}
                          <h4 className="font-semibold text-white mb-1 group-hover:text-yellow-300 transition-colors line-clamp-2">
                            {story.topicPreview?.title || 'Curio\'s Mystery Adventure'}
                          </h4>
                          <p className="text-sm text-purple-300 line-clamp-2">
                            {story.topicPreview?.teaser || 'Join Curio on a magical science journey'}
                          </p>
                          <div className="mt-2">
                            <span className="text-xs text-purple-400">
                              {new Date(story.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
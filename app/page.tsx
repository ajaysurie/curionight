'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/layout/navbar'
import { usePhotoImport } from '@/hooks/use-photo-import'
import { toast } from 'sonner'
import { Camera, Sparkles, Book, Clock, Upload, X, ImageIcon, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { photos, isLoading, error, importFromFile, importFromUrl, clearPhotos } = usePhotoImport()
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('6')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [stories, setStories] = useState<any[]>([])
  const [loadingStories, setLoadingStories] = useState(true)
  const [showAllStories, setShowAllStories] = useState(false)

  // Load recent stories
  useEffect(() => {
    loadRecentStories()
  }, [])

  // Check if there's a photo URL in the query params
  useEffect(() => {
    const photoUrl = searchParams.get('photo')
    if (photoUrl) {
      importFromUrl(decodeURIComponent(photoUrl))
      setShowPhotoUpload(true)
    }
  }, [searchParams, importFromUrl])

  // Store child info whenever it changes
  useEffect(() => {
    if (childName) {
      sessionStorage.setItem('childName', childName)
      window.dispatchEvent(new Event('childNameUpdated'))
    }
    if (childAge) sessionStorage.setItem('childAge', childAge)
  }, [childName, childAge])

  const loadRecentStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Failed to load stories:', error)
    } finally {
      setLoadingStories(false)
    }
  }

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await importFromFile(file)
      setActiveMode('photo')
    }
  }

  const handlePhotoAnalyze = async () => {
    if (photos.length === 0) {
      toast.error('Please add a photo first')
      return
    }

    setIsAnalyzing(true)
    
    try {
      sessionStorage.setItem('photoUrl', photos[0].url)
      router.push('/create/topics')
    } catch (err) {
      toast.error('Failed to process photo')
      setIsAnalyzing(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <Image 
            src="/curio-logo.png" 
            alt="Curio the Owl" 
            width={80} 
            height={80}
            className="mx-auto mb-3"
          />
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent">
            {session ? `Welcome back, ${session.user.name?.split(' ')[0]}!` : 'CurioNight'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-purple-100">
            Create magical bedtime science stories with Curio
          </p>
        </div>

        {/* How it Works - Moved to top */}
        <div className="mb-8 pb-8 border-b border-purple-800/50">
          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-yellow-300" />
                </div>
              </div>
              <h3 className="font-display text-sm font-semibold text-white">Share a Photo</h3>
              <p className="font-body text-xs text-purple-300">
                Upload any photo from your day
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-teal-300" />
                </div>
              </div>
              <h3 className="font-display text-sm font-semibold text-white">Pick a Topic</h3>
              <p className="font-body text-xs text-purple-300">
                Choose from science topics
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Book className="h-6 w-6 text-purple-300" />
                </div>
              </div>
              <h3 className="font-display text-sm font-semibold text-white">Enjoy Your Story</h3>
              <p className="font-body text-xs text-purple-300">
                Get a personalized 6-page story
              </p>
            </div>
          </div>
        </div>


        {/* Create Story Section */}
        <div className="mb-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">Create a New Story with Curio</h2>
          
          {/* Child Info Card */}
          <Card className="mb-6 border-purple-700 bg-purple-900/50 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                <span className="mr-2 text-xl">👋</span>
                Who's the explorer?
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-purple-100">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your name"
                    className="border-purple-600 bg-purple-800/50 text-white placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-purple-100">
                    Age
                  </Label>
                  <select
                    id="age"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-purple-600 bg-purple-800/50 px-3 py-2 text-sm text-white"
                  >
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                    <option value="6">6 years</option>
                    <option value="7">7 years</option>
                    <option value="8">8 years</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Browse Stories Section */}
        {stories.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Browse Curio's Story Collection</h2>
              {stories.length > 6 && !showAllStories && (
                <Button 
                  variant="ghost" 
                  className="text-purple-200 hover:text-white"
                  onClick={() => setShowAllStories(true)}
                >
                  See more stories
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(showAllStories ? stories : stories.slice(0, 6)).map((story) => {
                const gradient = getStoryGradient(story.concept)
                const icon = getStoryIcon(story.concept)
                const category = story.concept?.category || 'Science'
                
                return (
                  <Link 
                    key={story.id} 
                    href={`/story/${story.shareToken || story.id}`}
                    className="group"
                  >
                    <Card className="border-purple-700 bg-purple-900/50 hover:bg-purple-900/70 transition-all hover:scale-105 h-full">
                      <CardContent className="p-4">
                        {/* Story Thumbnail */}
                        <div className={`mb-3 h-40 rounded-lg bg-gradient-to-br ${gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
                          {/* Category Label */}
                          <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-semibold text-white">{category}</span>
                          </div>
                          {/* Age badge */}
                          {story.childAge && (
                            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                              <span className="text-xs font-semibold text-white">Age {story.childAge}</span>
                            </div>
                          )}
                          {/* Icon */}
                          <div className="relative z-10">
                            {icon}
                          </div>
                        </div>
                        
                        {/* Story Info */}
                        <h3 className="font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                          {story.topicPreview?.title || 'Curio\'s Mystery Adventure'}
                        </h3>
                        <p className="text-sm text-purple-200 mb-3 line-clamp-2">
                          {story.topicPreview?.teaser || 'Join Curio on a magical science journey'}
                        </p>
                        
                        {/* Story Meta */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-purple-300">
                            <Clock className="h-3 w-3" />
                            {new Date(story.createdAt).toLocaleDateString()}
                          </span>
                          {story.childName && (
                            <span className="text-xs text-purple-300">
                              For {story.childName}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
            {showAllStories && stories.length > 6 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="ghost" 
                  className="text-purple-200 hover:text-white"
                  onClick={() => setShowAllStories(false)}
                >
                  Show less
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Empty State */}
        {stories.length === 0 && !loadingStories && (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-300" />
            <h3 className="text-xl font-bold text-white mb-2">No Stories Yet</h3>
            <p className="text-purple-200 mb-6">Be the first to create a magical science adventure!</p>
          </div>
        )}
      </div>
    </div>
  )
}
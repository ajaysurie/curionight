'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Plus, Sparkles, Clock, Camera } from 'lucide-react'
import { PhotoSource } from '@/lib/services/photo-import'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentPhotos, setRecentPhotos] = useState<PhotoSource[]>([])
  const [pastStories, setPastStories] = useState<any[]>([])
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.accessToken) {
      loadRecentPhotos()
    }
    loadPastStories()
  }, [session])

  const loadRecentPhotos = async () => {
    try {
      setIsLoadingPhotos(true)
      const response = await fetch('/api/photos/google-photos', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
      if (response.ok) {
        const photos = await response.json()
        setRecentPhotos(photos)
      }
    } catch (error) {
      console.error('Failed to load photos:', error)
    } finally {
      setIsLoadingPhotos(false)
    }
  }

  const loadPastStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const stories = await response.json()
        setPastStories(stories)
      }
    } catch (error) {
      console.error('Failed to load stories:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-300 border-t-transparent"></div>
            <p className="text-white">Loading your magical stories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Welcome back, {session.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-purple-200">Ready to create tonight's bedtime adventure?</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          <Card className="border-purple-700 bg-purple-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                Create New Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-purple-200">
                Choose from your recent photos or upload a new one
              </p>
              <Link href="/create">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Creating
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-700 bg-purple-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Camera className="h-5 w-5 text-teal-300" />
                Today's Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-purple-200">
                AI-curated story ideas from your recent photos
              </p>
              <Button 
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={recentPhotos.length === 0}
              >
                View Suggestions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Photos from Google Photos */}
        {session.accessToken && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-white">Your Recent Photos</h2>
            {isLoadingPhotos ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-lg bg-purple-800/50" />
                ))}
              </div>
            ) : recentPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {recentPhotos.slice(0, 8).map((photo) => (
                  <Link
                    key={photo.id}
                    href={`/create?photo=${encodeURIComponent(photo.url)}`}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={photo.thumbnailUrl}
                      alt="Recent photo"
                      className="h-40 w-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-sm text-white">Create story</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-purple-700 bg-purple-900/50">
                <CardContent className="py-8 text-center">
                  <p className="text-purple-200">
                    Connect your Google Photos to see recent photos here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Past Stories */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">Recent Stories</h2>
          {pastStories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {pastStories.map((story) => (
                <Card key={story.id} className="border-purple-700 bg-purple-900/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {story.topicPreview?.title || 'Untitled Story'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-purple-200">
                      {story.topicPreview?.teaser || 'A magical science adventure'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-purple-300">
                        <Clock className="h-3 w-3" />
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      <Link href={`/story/${story.shareToken || story.id}`}>
                        <Button size="sm" variant="ghost" className="text-purple-200 hover:text-white">
                          Read Again
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-purple-700 bg-purple-900/50">
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-purple-200">No stories yet!</p>
                <Link href="/create">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Create Your First Story
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GooglePhotosInstructions } from '@/components/ui/google-photos-instructions'
import { Navbar } from '@/components/layout/navbar'
import { usePhotoImport } from '@/hooks/use-photo-import'
import { toast } from 'sonner'
import { Upload, Link2, Camera, ArrowLeft, X, Sparkles } from 'lucide-react'

export default function CreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { photos, isLoading, error, importFromFile, importFromUrl, clearPhotos, removePhoto } = usePhotoImport()
  const [urlInput, setUrlInput] = useState('')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('6')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Check if there's a photo URL in the query params (from dashboard)
  useEffect(() => {
    const photoUrl = searchParams.get('photo')
    if (photoUrl) {
      importFromUrl(decodeURIComponent(photoUrl))
    }
  }, [searchParams])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await importFromFile(file)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (urlInput.trim()) {
      await importFromUrl(urlInput.trim())
      if (!error) {
        setUrlInput('')
      }
    }
  }

  const handleAnalyze = async () => {
    if (photos.length === 0) {
      toast.error('Please add a photo first')
      return
    }

    setIsAnalyzing(true)
    
    try {
      // For now, we'll analyze the first photo
      const photo = photos[0]
      
      // Store the photo info in session storage for the next page
      sessionStorage.setItem('photoUrl', photo.url)
      sessionStorage.setItem('childName', childName)
      sessionStorage.setItem('childAge', childAge)
      
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
        <Link href={session ? "/dashboard" : "/"}>
          <Button variant="ghost" className="mb-8 text-white hover:text-purple-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-center text-4xl font-bold text-white">
            Create Your Story
          </h1>
          <p className="mb-8 text-center text-lg text-purple-200">
            Choose how you'd like to start your science adventure!
          </p>

          {/* Choice Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card className="border-purple-700 bg-purple-900/50 transition-all hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <Camera className="h-16 w-16 text-yellow-300" />
                </div>
                <h2 className="mb-3 text-center text-xl font-bold text-white">Start with a Photo</h2>
                <p className="mb-6 text-center text-purple-200">
                  Upload a photo and we'll find science topics connected to what we see!
                </p>
                <Button
                  onClick={() => {
                    // Scroll to photo section
                    document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Choose Photo
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-700 bg-purple-900/50 transition-all hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <Sparkles className="h-16 w-16 text-teal-300" />
                </div>
                <h2 className="mb-3 text-center text-xl font-bold text-white">Explore Topics</h2>
                <p className="mb-6 text-center text-purple-200">
                  Browse exciting science topics and pick what interests you most!
                </p>
                <Link href="/create/topics-preset">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Browse Topics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Child Info */}
          <Card className="mb-8 border-purple-700 bg-purple-900/50">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Tell us about yourself!</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-purple-100">
                    Your Name (optional)
                  </Label>
                  <Input
                    id="name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Explorer"
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

          {/* Photo Upload */}
          <Card id="photo-section" className="mb-8 border-purple-700 bg-purple-900/50">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">📸 Add a Photo (Optional)</h2>
              <p className="mb-4 text-sm text-purple-200">
                Upload a photo to get personalized topics, or skip this to browse all topics!
              </p>
              
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">From URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-4">
                  <div className="space-y-4">
                    <label
                      htmlFor="file-upload"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-600 p-8 hover:border-purple-400"
                    >
                      <Upload className="mb-2 h-8 w-8 text-purple-300" />
                      <span className="text-purple-100">Click to upload or drag and drop</span>
                      <span className="text-sm text-purple-300">PNG, JPG up to 10MB</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="mt-4">
                  <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="url" className="text-purple-100">
                        Image URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="url"
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="border-purple-600 bg-purple-800/50 text-white placeholder:text-purple-300"
                        />
                        <Button type="submit" disabled={!urlInput.trim() || isLoading}>
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <GooglePhotosInstructions />
                  </form>
                </TabsContent>
              </Tabs>

              {error && (
                <div className="mt-4 rounded-md bg-red-500/20 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Photos */}
          {photos.length > 0 && (
            <Card className="mb-8 border-purple-700 bg-purple-900/50">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Selected Photo</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearPhotos}
                    className="text-purple-200 hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative overflow-hidden rounded-lg">
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt={photo.name || 'Uploaded photo'}
                        className="h-32 w-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={photos.length === 0 || isAnalyzing}
              className="bg-yellow-500 text-purple-900 hover:bg-yellow-400"
            >
              {isAnalyzing ? 'Analyzing...' : 'Continue to Topics'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Camera, Sparkles, Book, Moon } from 'lucide-react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-5xl font-bold text-transparent">
            {session ? `Welcome back, ${session.user.name?.split(' ')[0]}!` : 'CurioNight'}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
            {session 
              ? "Ready to create tonight's magical science adventure?"
              : "Transform your child's photos into magical bedtime science stories with fun experiments"
            }
          </p>
          <Link href={session ? "/dashboard" : "/create"}>
            <Button size="lg" className="bg-purple-600 text-lg hover:bg-purple-700">
              <Camera className="mr-2 h-5 w-5" />
              {session ? "Go to Dashboard" : "Try It Free"}
            </Button>
          </Link>
          {!session && (
            <p className="mt-4 text-sm text-purple-200">
              No signup required • 3 free stories
            </p>
          )}
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="mb-4 flex justify-center">
                <Camera className="h-12 w-12 text-yellow-300" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">1. Share a Photo</h3>
              <p className="text-purple-100">
                Upload any photo from your day - a toy, pet, or nature scene
              </p>
            </div>
            
            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="mb-4 flex justify-center">
                <Sparkles className="h-12 w-12 text-teal-300" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">2. Pick a Topic</h3>
              <p className="text-purple-100">
                Choose from science topics connected to what's in your photo
              </p>
            </div>
            
            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="mb-4 flex justify-center">
                <Book className="h-12 w-12 text-purple-300" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">3. Enjoy Your Story</h3>
              <p className="text-purple-100">
                Get a personalized 6-page story with a safe experiment to try
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16 text-center">
          <h2 className="mb-8 text-3xl font-bold text-white">Perfect for Bedtime</h2>
          <div className="mx-auto max-w-3xl space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold text-white">Personalized Stories</h3>
                <p className="text-purple-100">Each story features your child's name and connects to their daily discoveries</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧪</span>
              <div>
                <h3 className="font-semibold text-white">Safe Experiments</h3>
                <p className="text-purple-100">Simple activities using household items to explore science together</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <h3 className="font-semibold text-white">Calming Narration</h3>
                <p className="text-purple-100">Soothing voice narration perfect for winding down at bedtime</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/create">
            <Button size="lg" className="bg-yellow-500 text-lg text-purple-900 hover:bg-yellow-400">
              Start Your First Story - It's Free!
            </Button>
          </Link>
          <p className="mt-4 text-sm text-purple-200">
            No signup required • 3 free stories daily
          </p>
        </div>
      </div>
    </div>
  )
}
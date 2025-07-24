'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, LogOut, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { getChildName } from '@/lib/utils/names'

export function Navbar() {
  const { data: session, status } = useSession()
  const [childName, setChildName] = useState<string | null>(null)

  useEffect(() => {
    // Check for child name in sessionStorage
    const storedName = sessionStorage.getItem('childName')
    if (storedName) {
      setChildName(storedName)
    }

    // Listen for storage events to update name when it changes
    const handleStorageChange = () => {
      const newName = sessionStorage.getItem('childName')
      setChildName(newName)
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event for same-window updates
    window.addEventListener('childNameUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('childNameUpdated', handleStorageChange)
    }
  }, [])

  return (
    <nav className="border-b border-white/10 bg-gradient-to-r from-purple-950/90 to-indigo-950/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <Image 
            src="/curio-logo.png" 
            alt="Curio the Owl" 
            width={40} 
            height={40}
            className="animate-pulse"
          />
          <span className="text-2xl font-bold text-white">CurioNight</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Child name display - only show if name exists and is not empty */}
          {childName && childName.trim() && (
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">
                {getChildName(childName)}'s Adventures
              </span>
            </div>
          )}

          {status === 'loading' ? (
            <div className="h-8 w-24 animate-pulse rounded-full bg-white/20" />
          ) : session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-sky-300 transition-colors">
                  My Stories
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <User className="h-4 w-4 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() => signIn('google')}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
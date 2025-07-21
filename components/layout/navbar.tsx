'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Moon, User, LogOut } from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b border-purple-800 bg-purple-950/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Moon className="h-6 w-6 text-yellow-300" />
          <span className="text-xl font-bold text-white">CurioNight</span>
        </Link>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-8 w-24 animate-pulse rounded bg-purple-800" />
          ) : session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-purple-200">
                  My Stories
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700">
                  <User className="h-4 w-4 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-white hover:text-purple-200"
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
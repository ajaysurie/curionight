'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Moon } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-950 via-indigo-900 to-purple-950">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Moon className="h-8 w-8 text-yellow-300" />
            <span className="text-3xl font-bold text-white">CurioNight</span>
          </Link>
        </div>
        
        <Card className="border-purple-700 bg-purple-900/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Welcome Back!</CardTitle>
            <CardDescription className="text-purple-200">
              Sign in to access your stories and connected photos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full bg-white text-gray-800 hover:bg-gray-100"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-purple-200">
                By signing in, you'll be able to:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-purple-300">
                <li>• Connect your Google Photos library</li>
                <li>• Save and revisit all your stories</li>
                <li>• Get AI-curated story suggestions</li>
                <li>• Track your child's learning journey</li>
              </ul>
            </div>
            
            <div className="pt-4 text-center">
              <Link href="/create" className="text-sm text-purple-200 hover:text-white">
                Or continue without signing in →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
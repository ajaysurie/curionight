'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-950 to-indigo-900 p-8">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Oops! Something went wrong
        </h2>
        <p className="mb-8 text-lg text-purple-200">
          Don't worry, even the best scientists have experiments that don't go as planned!
        </p>
        <Button
          onClick={reset}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}
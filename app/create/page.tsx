'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to home page where story creation now lives
    router.push('/')
  }, [router])
  
  return null
}
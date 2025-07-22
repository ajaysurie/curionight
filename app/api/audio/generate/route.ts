import { NextRequest, NextResponse } from 'next/server'
import { getAudioProviderWithFallback } from '@/lib/services/audio/factory'
import { z } from 'zod'

const generateAudioSchema = z.object({
  pages: z.array(z.object({
    pageNumber: z.number(),
    content: z.string(),
  })),
  childName: z.string().optional(),
  provider: z.enum(['gemini', 'elevenlabs']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = generateAudioSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error },
        { status: 400 }
      )
    }
    
    const { pages, childName, provider } = validationResult.data
    
    // Get audio provider (uses configurable provider with fallback)
    const audioService = await getAudioProviderWithFallback()
    const result = await audioService.generateAudioForStory(pages, childName)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate audio' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      audioUrls: result.audioUrls,
      provider: process.env.AUDIO_PROVIDER || 'gemini', // Return which provider was used
    })
  } catch (error) {
    console.error('Audio generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
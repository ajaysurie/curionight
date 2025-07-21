import { NextRequest, NextResponse } from 'next/server'
import { analyzePhotoSchema } from '@/lib/validations'
import { getAIProvider } from '@/lib/ai/factory'
import { PhotoImportService } from '@/lib/services/photo-import'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different input types
    let imageBase64: string
    
    if (body.imageUrl) {
      // Import from URL (including Google Photos public URLs)
      try {
        imageBase64 = await PhotoImportService.urlToBase64(body.imageUrl)
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to fetch image from URL' },
          { status: 400 }
        )
      }
    } else if (body.image) {
      // Direct base64 upload
      imageBase64 = body.image
    } else {
      return NextResponse.json(
        { error: 'Either image or imageUrl is required' },
        { status: 400 }
      )
    }
    
    // Validate input with the base64 image
    const validated = analyzePhotoSchema.parse({
      image: imageBase64,
      age: body.age || 6,
    })
    
    // Get AI provider
    const aiProvider = getAIProvider('free')
    
    // Analyze image
    const analysisResult = await aiProvider.analyzeImage(validated.image)
    
    if (!analysisResult.success || !analysisResult.objects) {
      return NextResponse.json(
        { error: analysisResult.error || 'Failed to analyze image' },
        { status: 400 }
      )
    }
    
    // Generate topic suggestions based on detected objects
    const suggestionsResult = await aiProvider.generateTopicSuggestions(
      analysisResult.objects,
      validated.age
    )
    
    if (!suggestionsResult.success || !suggestionsResult.suggestions) {
      return NextResponse.json(
        { error: suggestionsResult.error || 'Failed to generate suggestions' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      objects: analysisResult.objects,
      suggestions: suggestionsResult.suggestions,
    })
  } catch (error) {
    console.error('Photo analysis error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
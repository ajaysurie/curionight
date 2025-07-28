import { NextRequest, NextResponse } from 'next/server'
import { generateStorySchema } from '@/lib/validations'
import { getAIProvider } from '@/lib/ai/factory'
import { prisma } from '@/lib/db/prisma'
import { getImageGenerationService } from '@/lib/services/image-generation'
import { getAudioProvider } from '@/lib/services/audio/factory'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Story generation request:', body)
    
    // Validate input
    const validated = generateStorySchema.parse(body)
    console.log('Validated input:', validated)
    
    // Track generation start time
    const startTime = Date.now()
    
    // Get AI provider - use premium model for better story quality
    const aiProvider = getAIProvider('premium')
    
    // Generate the story
    const storyResult = await aiProvider.generateStory(
      validated.objects,
      validated.conceptId,
      validated.age,
      validated.childName,
      validated.options
    )
    
    if (!storyResult.success || !storyResult.story) {
      return NextResponse.json(
        { error: storyResult.error || 'Failed to generate story' },
        { status: 400 }
      )
    }
    
    const generationTime = Date.now() - startTime
    
    // Generate images for each page
    const imageService = getImageGenerationService()
    const pagesWithImages = await Promise.all(
      storyResult.story.pages.map(async (page) => {
        if (page.imagePrompt) {
          try {
            // For now, use SVG placeholders
            const imageUrl = await imageService.generatePlaceholderSVG(
              page.imagePrompt,
              page.pageNumber
            )
            return { ...page, imageUrl }
          } catch (error) {
            console.error('Error generating image for page', page.pageNumber, error)
            return page
          }
        }
        return page
      })
    )
    
    // Skip audio generation during story creation for faster loading
    // Audio will be generated on-demand when the story is viewed
    console.log('Skipping audio generation for faster story creation')
    const audioUrls = new Array(pagesWithImages.length).fill('')
    
    // Generate a share token for the story
    const shareToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    
    // Save story to database
    const story = await prisma.story.create({
      data: {
        childAge: validated.age,
        childName: validated.childName,
        detectedObjects: validated.objects as any,
        concept: storyResult.story.concept as any,
        topicPreview: storyResult.story.topicPreview as any,
        pages: pagesWithImages as any,
        audioUrls: audioUrls as any,
        modelUsed: aiProvider.model,
        generationTime,
        shareToken,
      },
    })
    
    return NextResponse.json({
      storyId: story.id,
      shareToken: story.shareToken,
      story: {
        ...storyResult.story,
        pages: pagesWithImages,
      },
      generationTime,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid request data: ' + error.message },
          { status: 400 }
        )
      }
      
      // Return more detailed error for debugging
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { generateStorySchema } from '@/lib/validations'
import { getAIProvider } from '@/lib/ai/factory'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validated = generateStorySchema.parse(body)
    
    // Track generation start time
    const startTime = Date.now()
    
    // Get AI provider (use free tier for MVP)
    const aiProvider = getAIProvider('free')
    
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
        pages: storyResult.story.pages as any,
        modelUsed: aiProvider.model,
        generationTime,
        shareToken,
      },
    })
    
    return NextResponse.json({
      storyId: story.id,
      shareToken: story.shareToken,
      story: storyResult.story,
      generationTime,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    
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
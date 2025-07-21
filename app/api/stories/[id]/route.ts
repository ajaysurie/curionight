import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // Try to find by ID first
    let story = await prisma.story.findUnique({
      where: { id },
    })
    
    // If not found by ID, try by shareToken
    if (!story) {
      story = await prisma.story.findUnique({
        where: { shareToken: id },
      })
    }
    
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      id: story.id,
      childAge: story.childAge,
      childName: story.childName,
      concept: story.concept,
      topicPreview: story.topicPreview,
      pages: story.pages,
      audioUrls: story.audioUrls,
      shareToken: story.shareToken,
      createdAt: story.createdAt,
    })
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
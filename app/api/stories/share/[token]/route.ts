import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    // Find story by share token
    const story = await prisma.story.findUnique({
      where: { shareToken: token },
      select: {
        id: true,
        childName: true,
        concept: true,
        pages: true,
        audioUrls: true,
        createdAt: true,
      },
    })
    
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(story)
  } catch (error) {
    console.error('Error fetching shared story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}
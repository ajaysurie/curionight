import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    // For signed-in users, get their stories
    // For now, we'll get all stories since we don't have user association yet
    const stories = await prisma.story.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Increased limit
      select: {
        id: true,
        childName: true,
        childAge: true,
        concept: true,
        topicPreview: true,
        shareToken: true,
        createdAt: true,
        pages: true, // Include pages to potentially extract thumbnails
      },
    })
    
    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
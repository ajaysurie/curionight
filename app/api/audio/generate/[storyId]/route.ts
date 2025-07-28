import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAudioProvider } from '@/lib/services/audio/factory'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params
    const { pageIndex } = await request.json()
    
    // Get the story from database
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    })
    
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    const pages = story.pages as any[]
    
    // Check if audio already exists for this page
    const audioUrls = story.audioUrls as string[]
    if (audioUrls[pageIndex] && audioUrls[pageIndex] !== '') {
      return NextResponse.json({
        audioUrl: audioUrls[pageIndex],
        cached: true
      })
    }
    
    // Generate audio for the requested page
    const audioProvider = getAudioProvider()
    const page = pages[pageIndex]
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }
    
    console.log(`Generating audio for story ${storyId}, page ${pageIndex}`)
    
    try {
      const audioUrl = await audioProvider.generateAudioForPage(
        page.content,
        story.childName || undefined
      )
      
      // Update the story with the generated audio URL
      const updatedAudioUrls = [...audioUrls]
      updatedAudioUrls[pageIndex] = audioUrl
      
      await prisma.story.update({
        where: { id: storyId },
        data: {
          audioUrls: updatedAudioUrls as any
        }
      })
      
      return NextResponse.json({
        audioUrl,
        cached: false
      })
    } catch (audioError) {
      console.error('Audio generation error:', audioError)
      return NextResponse.json(
        { error: 'Failed to generate audio' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Audio endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Pre-fetch audio for the next page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params
    const { searchParams } = new URL(request.url)
    const nextPageIndex = parseInt(searchParams.get('nextPage') || '0')
    
    // Get the story from database
    const story = await prisma.story.findUnique({
      where: { id: storyId }
    })
    
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    const pages = story.pages as any[]
    const audioUrls = story.audioUrls as string[]
    
    // Check if audio already exists for the next page
    if (audioUrls[nextPageIndex] && audioUrls[nextPageIndex] !== '') {
      return NextResponse.json({
        prefetched: true,
        audioUrl: audioUrls[nextPageIndex]
      })
    }
    
    // Generate audio for the next page in the background
    const audioProvider = getAudioProvider()
    const nextPage = pages[nextPageIndex]
    
    if (!nextPage) {
      return NextResponse.json({
        prefetched: false,
        reason: 'Page not found'
      })
    }
    
    console.log(`Pre-fetching audio for story ${storyId}, page ${nextPageIndex}`)
    
    // Generate audio asynchronously
    audioProvider.generateAudioForPage(
      nextPage.content,
      story.childName || undefined
    ).then(async (audioUrl) => {
      // Update the story with the generated audio URL
      const updatedAudioUrls = [...audioUrls]
      updatedAudioUrls[nextPageIndex] = audioUrl
      
      await prisma.story.update({
        where: { id: storyId },
        data: {
          audioUrls: updatedAudioUrls as any
        }
      })
    }).catch(error => {
      console.error('Pre-fetch audio generation error:', error)
    })
    
    return NextResponse.json({
      prefetched: true,
      generating: true
    })
  } catch (error) {
    console.error('Audio pre-fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
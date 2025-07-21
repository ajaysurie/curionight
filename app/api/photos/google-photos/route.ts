import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PhotoImportService } from '@/lib/services/photo-import'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get access token from request header
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    const photos = await PhotoImportService.importFromGooglePhotos(accessToken, 20)
    
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching Google Photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
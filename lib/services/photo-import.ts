export interface PhotoSource {
  id: string
  url: string
  thumbnailUrl?: string
  name?: string
  takenAt?: Date
  source: 'upload' | 'google' | 'url'
}

export class PhotoImportService {
  // Import from Google Photos
  static async importFromGooglePhotos(accessToken: string, limit = 20): Promise<PhotoSource[]> {
    try {
      // Get recent photos from Google Photos
      const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSize: limit,
          filters: {
            mediaTypeFilter: {
              mediaTypes: ['PHOTO'],
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch photos from Google Photos')
      }

      const data = await response.json()
      
      return data.mediaItems.map((item: any) => ({
        id: item.id,
        url: `${item.baseUrl}=w1920-h1080`, // Request specific size
        thumbnailUrl: `${item.baseUrl}=w400-h400`,
        name: item.filename,
        takenAt: new Date(item.mediaMetadata.creationTime),
        source: 'google' as const,
      }))
    } catch (error) {
      console.error('Error importing from Google Photos:', error)
      throw error
    }
  }

  // Import from URL
  static async importFromUrl(url: string): Promise<PhotoSource> {
    // Handle Google Photos share links
    const processedUrl = this.processGooglePhotosUrl(url)
    
    // Validate URL is an image
    const isValidImage = await this.validateImageUrl(processedUrl)
    if (!isValidImage) {
      throw new Error('Invalid image URL')
    }

    return {
      id: this.generateId(),
      url: processedUrl,
      thumbnailUrl: processedUrl,
      source: 'url',
      name: 'Imported photo',
    }
  }

  // Process Google Photos share URLs to get direct image link
  private static processGooglePhotosUrl(url: string): string {
    // If it's a Google Photos share link, extract the image URL
    if (url.includes('photos.google.com/share') || url.includes('photos.app.goo.gl')) {
      // For MVP, we'll guide users to get the direct image link
      // In production, we'd use the Google Photos API
      console.log('Google Photos share link detected. Users should right-click and copy image URL.')
      return url
    }
    
    // If it's already a direct Google user content URL, ensure it has size params
    if (url.includes('googleusercontent.com')) {
      // Add size parameters if not present
      if (!url.includes('=w') && !url.includes('=s')) {
        return `${url}=w1920-h1080`
      }
    }
    
    return url
  }

  // Convert uploaded file to base64
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1]) // Remove data:image/jpeg;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Fetch image and convert to base64
  static async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const file = new File([blob], 'image.jpg', { type: blob.type })
      return this.fileToBase64(file)
    } catch (error) {
      console.error('Error converting URL to base64:', error)
      throw new Error('Failed to fetch image from URL')
    }
  }

  // Validate image URL
  private static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('content-type')
      return contentType?.startsWith('image/') || false
    } catch {
      return false
    }
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}
import { useState, useCallback } from 'react'
import { PhotoSource, PhotoImportService } from '@/lib/services/photo-import'

export interface UsePhotoImportReturn {
  photos: PhotoSource[]
  isLoading: boolean
  error: string | null
  importFromFile: (file: File) => Promise<void>
  importFromUrl: (url: string) => Promise<void>
  importFromGooglePhotos: () => Promise<void>
  clearPhotos: () => void
  removePhoto: (id: string) => void
}

export function usePhotoImport(): UsePhotoImportReturn {
  const [photos, setPhotos] = useState<PhotoSource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const importFromFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const base64 = await PhotoImportService.fileToBase64(file)
      const photoSource: PhotoSource = {
        id: Math.random().toString(36),
        url: `data:${file.type};base64,${base64}`,
        thumbnailUrl: `data:${file.type};base64,${base64}`,
        name: file.name,
        source: 'upload',
      }
      
      setPhotos(prev => [...prev, photoSource])
    } catch (err) {
      setError('Failed to import photo from file')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const importFromUrl = useCallback(async (url: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const photoSource = await PhotoImportService.importFromUrl(url)
      setPhotos(prev => [...prev, photoSource])
    } catch (err) {
      setError('Failed to import photo from URL. Make sure it\'s a valid image URL.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const importFromGooglePhotos = useCallback(async () => {
    setError('Google Photos import will be available soon! For now, you can paste a Google Photos share link.')
    // In the future, this will handle OAuth flow
    // For MVP, users can share photos and paste the URL
  }, [])

  const clearPhotos = useCallback(() => {
    setPhotos([])
    setError(null)
  }, [])

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }, [])

  return {
    photos,
    isLoading,
    error,
    importFromFile,
    importFromUrl,
    importFromGooglePhotos,
    clearPhotos,
    removePhoto,
  }
}
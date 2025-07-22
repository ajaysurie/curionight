import { BaseAudioProvider, AudioGenerationResult } from './base'
import { StoryPage } from '@/types/story'

// Mock TTS provider for development
// Returns empty audio URLs so the app works without real TTS
export class MockTTSProvider extends BaseAudioProvider {
  async generateAudioForStory(
    pages: StoryPage[],
    childName?: string
  ): Promise<AudioGenerationResult> {
    try {
      // Return empty audio URLs for now
      const audioUrls = pages.map(() => '')
      
      return {
        success: true,
        audioUrls,
      }
    } catch (error) {
      console.error('Error in mock TTS:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate audio',
      }
    }
  }
  
  async generateAudioForPage(
    text: string,
    childName?: string
  ): Promise<string> {
    // Return empty data URL
    return ''
  }
}
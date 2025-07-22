import { StoryPage } from '@/types/story'

export interface AudioGenerationResult {
  success: boolean
  audioUrls?: string[]
  error?: string
}

export abstract class BaseAudioProvider {
  abstract generateAudioForStory(
    pages: StoryPage[],
    childName?: string,
    options?: any
  ): Promise<AudioGenerationResult>
  
  abstract generateAudioForPage(
    text: string,
    childName?: string,
    options?: any
  ): Promise<string>
}
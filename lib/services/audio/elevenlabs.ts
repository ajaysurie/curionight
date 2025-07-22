import { BaseAudioProvider, AudioGenerationResult } from './base'
import { StoryPage } from '@/types/story'

export class ElevenLabsProvider extends BaseAudioProvider {
  private apiKey: string
  private voiceId: string
  
  constructor() {
    super()
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set')
    }
    
    this.apiKey = apiKey
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Default to "Bella" voice
  }
  
  async generateAudioForStory(
    pages: StoryPage[],
    childName?: string
  ): Promise<AudioGenerationResult> {
    try {
      const audioUrls: string[] = []
      
      for (const page of pages) {
        const audioUrl = await this.generateAudioForPage(page.content, childName)
        audioUrls.push(audioUrl)
      }
      
      return {
        success: true,
        audioUrls,
      }
    } catch (error) {
      console.error('Error generating audio with ElevenLabs:', error)
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
    // Replace placeholder with actual child name if provided
    const processedText = childName 
      ? text.replace(/\[name\]/gi, childName)
      : text
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: processedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ElevenLabs API error: ${error}`)
    }
    
    // In production, you would upload this to blob storage
    // For now, we'll convert to base64 data URL
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const dataUrl = `data:audio/mpeg;base64,${base64Audio}`
    
    return dataUrl
  }
}
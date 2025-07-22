import { BaseAudioProvider, AudioGenerationResult } from './base'
import { StoryPage } from '@/types/story'

export class GeminiTTSProvider extends BaseAudioProvider {
  private apiKey: string
  
  constructor() {
    super()
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set')
    }
    this.apiKey = apiKey
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
      console.error('Error generating audio with Gemini TTS:', error)
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
    
    // Gemini TTS API endpoint - using Gemini 2.0 Flash for speech synthesis
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationConfig: {
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Kore" // Child-friendly voice
                }
              }
            }
          },
          contents: [{
            parts: [{
              text: processedText
            }]
          }]
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini TTS API error: ${error}`)
    }
    
    const data = await response.json()
    
    // Extract audio from the response
    if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const audioData = data.candidates[0].content.parts[0].inlineData.data
      const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/mp3'
      return `data:${mimeType};base64,${audioData}`
    }
    
    throw new Error('No audio content returned from Gemini TTS')
  }
}
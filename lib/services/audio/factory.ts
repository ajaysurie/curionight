import { BaseAudioProvider } from './base'
import { GeminiTTSProvider } from './gemini-tts'
import { ElevenLabsProvider } from './elevenlabs'
import { MockTTSProvider } from './mock-tts'
import { BrowserTTSProvider } from './browser-tts'

export type AudioProviderType = 'gemini' | 'elevenlabs' | 'mock' | 'browser'

export function getAudioProvider(provider?: AudioProviderType): BaseAudioProvider {
  // Use environment variable if provider not specified
  const audioProvider = provider || (process.env.AUDIO_PROVIDER as AudioProviderType) || 'browser'
  
  switch (audioProvider) {
    case 'gemini':
      // For now, use browser TTS since Gemini speech synthesis is not available
      return new BrowserTTSProvider()
    case 'elevenlabs':
      return new ElevenLabsProvider()
    case 'browser':
      return new BrowserTTSProvider()
    case 'mock':
      return new MockTTSProvider()
    default:
      // Default to browser TTS for better user experience
      return new BrowserTTSProvider()
  }
}

// Helper to get audio provider with fallback
export async function getAudioProviderWithFallback(): Promise<BaseAudioProvider> {
  try {
    // Try primary provider first
    const primaryProvider = process.env.AUDIO_PROVIDER || 'gemini'
    return getAudioProvider(primaryProvider as AudioProviderType)
  } catch (error) {
    console.warn('Primary audio provider failed, trying fallback:', error)
    
    // If Gemini fails, try ElevenLabs
    if (process.env.AUDIO_PROVIDER === 'gemini') {
      try {
        return getAudioProvider('elevenlabs')
      } catch (fallbackError) {
        console.error('Both audio providers failed:', fallbackError)
        throw new Error('No audio providers available')
      }
    }
    
    // If ElevenLabs fails, try Gemini
    return getAudioProvider('gemini')
  }
}
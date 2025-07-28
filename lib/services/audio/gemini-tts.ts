import { BaseAudioProvider, AudioGenerationResult } from './base'
import { StoryPage } from '@/types/story'

// Voice profiles for different characters/moods
const VOICE_PROFILES = {
  narrator: 'Aoede', // Breezy - good for main narration
  childCharacter: 'Leda', // Youthful voice
  wise: 'Sadaltager', // Knowledgeable voice
  friendly: 'Achird', // Friendly voice
  excited: 'Fenrir', // Excitable voice
  gentle: 'Vindemiatrix', // Gentle voice
  mysterious: 'Achernar', // Soft voice
  brave: 'Kore', // Firm voice
}

export class GeminiTTSProvider extends BaseAudioProvider {
  private apiKey: string
  private lastRequestTime: number = 0
  private requestDelay: number = 7000 // 7 seconds between requests to stay well under 10 RPM limit
  
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
  
  // Parse text for voice markers and split into segments
  private parseTextForVoices(text: string): Array<{ text: string; voice: string }> {
    const segments: Array<{ text: string; voice: string }> = []
    
    // Pattern to match voice markers like {{character:text}} or {{voice:text}}
    const voicePattern = /\{\{(\w+):(.*?)\}\}/g
    let lastIndex = 0
    let match
    
    while ((match = voicePattern.exec(text)) !== null) {
      // Add any text before the voice marker as narrator
      if (match.index > lastIndex) {
        const narratorText = text.substring(lastIndex, match.index).trim()
        if (narratorText) {
          segments.push({ text: narratorText, voice: VOICE_PROFILES.narrator })
        }
      }
      
      // Add the voiced segment
      const voiceType = match[1].toLowerCase()
      const voiceText = match[2].trim()
      
      // Map voice types to available voices
      let selectedVoice = VOICE_PROFILES.narrator
      if (voiceType === 'child' || voiceType === 'kid') {
        selectedVoice = VOICE_PROFILES.childCharacter
      } else if (voiceType === 'wise' || voiceType === 'professor' || voiceType === 'teacher') {
        selectedVoice = VOICE_PROFILES.wise
      } else if (voiceType === 'excited' || voiceType === 'enthusiastic') {
        selectedVoice = VOICE_PROFILES.excited
      } else if (voiceType === 'gentle' || voiceType === 'soft') {
        selectedVoice = VOICE_PROFILES.gentle
      } else if (voiceType === 'mysterious' || voiceType === 'whisper') {
        selectedVoice = VOICE_PROFILES.mysterious
      } else if (voiceType === 'brave' || voiceType === 'strong') {
        selectedVoice = VOICE_PROFILES.brave
      } else if (voiceType === 'friendly' || voiceType === 'happy') {
        selectedVoice = VOICE_PROFILES.friendly
      }
      
      segments.push({ text: voiceText, voice: selectedVoice })
      lastIndex = match.index + match[0].length
    }
    
    // Add any remaining text as narrator
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex).trim()
      if (remainingText) {
        segments.push({ text: remainingText, voice: VOICE_PROFILES.narrator })
      }
    }
    
    // If no voice markers found, return entire text as narrator
    if (segments.length === 0) {
      segments.push({ text: text, voice: VOICE_PROFILES.narrator })
    }
    
    // Merge consecutive segments with the same voice to reduce API calls
    const mergedSegments: Array<{ text: string; voice: string }> = []
    for (const segment of segments) {
      if (mergedSegments.length > 0 && 
          mergedSegments[mergedSegments.length - 1].voice === segment.voice) {
        // Merge with previous segment
        mergedSegments[mergedSegments.length - 1].text += ' ' + segment.text
      } else {
        mergedSegments.push(segment)
      }
    }
    
    console.log(`Voice segments: ${segments.length} original, ${mergedSegments.length} after merging`)
    
    return mergedSegments
  }
  
  async generateAudioForPage(
    text: string,
    childName?: string
  ): Promise<string> {
    console.log('Gemini TTS generateAudioForPage called, text length:', text.length)
    
    // Replace placeholder with actual child name if provided
    const processedText = childName 
      ? text.replace(/\[name\]/gi, childName)
      : text
    
    // Parse text for voice segments
    const segments = this.parseTextForVoices(processedText)
    
    // If only one segment, generate single audio
    if (segments.length === 1) {
      const segment = segments[0]
      const requestBody = {
        model: "gemini-2.5-flash-preview-tts",
        contents: [{
          parts: [{
            text: segment.text
          }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: segment.voice
              }
            }
          }
        }
      }
      
      return await this.generateSingleAudio(requestBody)
    }
    
    // Enable multi-voice with a segment limit to avoid rate limits
    const MAX_SEGMENTS_PER_PAGE = 3 // Up to 3 voices per page with 100/day quota
    
    if (segments.length > MAX_SEGMENTS_PER_PAGE) {
      console.log(`Too many voice segments (${segments.length}). Falling back to single voice.`)
      // Fall back to single narrator voice
      const requestBody = {
        model: "gemini-2.5-flash-preview-tts",
        contents: [{
          parts: [{
            // Remove voice markers from text for single-voice narration
            text: processedText.replace(/\{\{\w+:"(.*?)"\}\}/g, '$1')
          }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: VOICE_PROFILES.narrator
              }
            }
          }
        }
      }
      
      return await this.generateSingleAudio(requestBody)
    }
    
    // Generate multi-voice audio
    const audioBuffers: Uint8Array[] = []
    
    for (const segment of segments) {
      console.log(`Generating audio for segment with voice: ${segment.voice}`)
      
      const requestBody = {
        model: "gemini-2.5-flash-preview-tts",
        contents: [{
          parts: [{
            text: segment.text
          }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: segment.voice
              }
            }
          }
        }
      }
      
      try {
        const audioData = await this.generateSingleAudio(requestBody, true)
        audioBuffers.push(audioData)
      } catch (error) {
        console.error(`Failed to generate audio for segment:`, error)
        // Continue with other segments
      }
    }
    
    // Combine all audio buffers
    if (audioBuffers.length > 0) {
      const combinedAudio = await this.combineAudioBuffers(audioBuffers)
      // Convert to base64 more efficiently for large buffers
      let binary = ''
      const chunkSize = 8192 // Process in chunks to avoid stack overflow
      for (let i = 0; i < combinedAudio.length; i += chunkSize) {
        const chunk = combinedAudio.slice(i, i + chunkSize)
        binary += String.fromCharCode.apply(null, Array.from(chunk))
      }
      const wavData = await this.pcmToWav(btoa(binary))
      return `data:audio/wav;base64,${wavData}`
    }
    
    throw new Error('Failed to generate any audio segments')
  }
  
  private async generateSingleAudio(requestBody: any, returnBuffer: boolean = false): Promise<any> {
    // Rate limiting to avoid 429 errors
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.requestDelay) {
      const waitTime = this.requestDelay - timeSinceLastRequest
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    this.lastRequestTime = Date.now()
    
    // Retry logic for 429 errors
    let retries = 0
    const maxRetries = 3
    
    while (retries < maxRetries) {
      try {
        return await this.makeRequest(requestBody, returnBuffer)
      } catch (error: any) {
        if (error.message.includes('429') && retries < maxRetries - 1) {
          retries++
          const backoffTime = Math.min(60000, this.requestDelay * Math.pow(2, retries)) // Exponential backoff, max 60s
          console.log(`Rate limit hit, retry ${retries}/${maxRetries} after ${backoffTime}ms`)
          await new Promise(resolve => setTimeout(resolve, backoffTime))
          this.lastRequestTime = Date.now()
        } else {
          throw error
        }
      }
    }
    
    throw new Error('Max retries exceeded')
  }
  
  private async makeRequest(requestBody: any, returnBuffer: boolean = false): Promise<any> {
    console.log('Making request to Gemini TTS API with voice:', requestBody.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName)
    
    // Gemini TTS API endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini TTS API error:', error)
      console.error('Response status:', response.status)
      
      // Check if it's a daily quota error
      try {
        const errorData = JSON.parse(error)
        if (errorData.error?.details?.[0]?.violations?.[0]?.quotaMetric?.includes('per_day')) {
          throw new Error('Daily TTS quota exceeded. Please try again after midnight PT or use browser TTS.')
        }
      } catch (e) {
        // Ignore parse errors
      }
      
      throw new Error(`Gemini TTS API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Gemini TTS response received, checking for audio data...')
    
    // Extract audio from the response
    if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const audioData = data.candidates[0].content.parts[0].inlineData.data
      
      if (returnBuffer) {
        // Return raw PCM data for combining
        const pcmData = atob(audioData)
        const pcmArray = new Uint8Array(pcmData.length)
        for (let i = 0; i < pcmData.length; i++) {
          pcmArray[i] = pcmData.charCodeAt(i)
        }
        return pcmArray
      }
      
      // The response is PCM audio data at 24kHz, mono, 16-bit
      // We need to convert it to WAV format for browser playback
      const mimeType = 'audio/wav'
      console.log('Audio data found, converting PCM to WAV...')
      
      // Convert base64 PCM to WAV
      const wavData = await this.pcmToWav(audioData)
      return `data:${mimeType};base64,${wavData}`
    }
    
    console.error('Unexpected response structure:', JSON.stringify(data, null, 2))
    throw new Error('No audio content returned from Gemini TTS')
  }
  
  // Convert PCM audio data to WAV format
  private async pcmToWav(pcmBase64: string): Promise<string> {
    // Decode base64 to binary
    const pcmData = atob(pcmBase64)
    const pcmArray = new Uint8Array(pcmData.length)
    for (let i = 0; i < pcmData.length; i++) {
      pcmArray[i] = pcmData.charCodeAt(i)
    }
    
    // WAV header parameters
    const sampleRate = 24000
    const numChannels = 1
    const bitsPerSample = 16
    const byteRate = sampleRate * numChannels * bitsPerSample / 8
    const blockAlign = numChannels * bitsPerSample / 8
    const dataSize = pcmArray.length
    const fileSize = 44 + dataSize
    
    // Create WAV header
    const wavBuffer = new ArrayBuffer(fileSize)
    const view = new DataView(wavBuffer)
    
    // RIFF header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, fileSize - 8, true)
    writeString(8, 'WAVE')
    
    // fmt chunk
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true) // fmt chunk size
    view.setUint16(20, 1, true) // audio format (1 = PCM)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitsPerSample, true)
    
    // data chunk
    writeString(36, 'data')
    view.setUint32(40, dataSize, true)
    
    // Copy PCM data
    const wavData = new Uint8Array(wavBuffer)
    wavData.set(pcmArray, 44)
    
    // Convert to base64
    let binary = ''
    for (let i = 0; i < wavData.length; i++) {
      binary += String.fromCharCode(wavData[i])
    }
    return btoa(binary)
  }
  
  // Combine multiple PCM audio buffers into one
  private async combineAudioBuffers(buffers: Uint8Array[]): Promise<Uint8Array> {
    // Calculate total length
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0)
    
    // Create combined buffer
    const combined = new Uint8Array(totalLength)
    let offset = 0
    
    for (const buffer of buffers) {
      combined.set(buffer, offset)
      offset += buffer.length
    }
    
    return combined
  }
}
import { useState, useEffect, useRef } from 'react'

export function useBrowserTTS() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const speakingRef = useRef(false)

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true)
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        // Prefer child-friendly voices
        const preferredVoices = availableVoices.filter(voice => 
          voice.name.toLowerCase().includes('child') ||
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('alex')
        )
        setVoices(preferredVoices.length > 0 ? preferredVoices : availableVoices)
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = (text: string, childName?: string) => {
    if (!isSupported || !text) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Replace placeholder with child name
    const processedText = childName 
      ? text.replace(/\[name\]/gi, childName)
      : text

    // Create a single utterance for the entire text
    const utterance = new SpeechSynthesisUtterance(processedText)
    
    // Set voice (prefer child-friendly voices)
    if (voices.length > 0) {
      utterance.voice = voices[0]
    }

    // Set speech parameters for child-friendly narration
    utterance.rate = 0.9 // Slightly slower for children
    utterance.pitch = 1.1 // Slightly higher pitch
    utterance.volume = 1.0

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true)
      speakingRef.current = true
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
      speakingRef.current = false
    }
    
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      // Silently handle errors - don't log canceled/interrupted errors
      setIsSpeaking(false)
      speakingRef.current = false
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      speakingRef.current = false
    }
  }

  const pause = () => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause()
    }
  }

  const resume = () => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  }

  return {
    isSupported,
    isSpeaking,
    speak,
    stop,
    pause,
    resume,
  }
}
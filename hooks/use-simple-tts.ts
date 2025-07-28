import { useState, useCallback, useEffect } from 'react'

export function useSimpleTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check support only on client side
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    
    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Simple settings
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  }
}
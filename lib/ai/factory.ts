import { AIProvider } from './providers/base'
import { GeminiProvider } from './providers/gemini'

export function getAIProvider(tier: 'free' | 'premium' = 'free'): AIProvider {
  const provider = process.env.AI_PROVIDER || 'gemini'
  
  // Determine which model to use based on tier
  let model: string
  if (tier === 'premium') {
    model = process.env.AI_MODEL_PREMIUM || 'gemini-2.5-pro'
  } else {
    model = process.env.AI_MODEL || 'gemini-2.0-flash-exp'
  }
  
  switch (provider) {
    case 'gemini':
      return new GeminiProvider(model)
    // Future providers can be added here
    // case 'anthropic':
    //   return new AnthropicProvider(model)
    // case 'openai':
    //   return new OpenAIProvider(model)
    default:
      // Default fallback
      return new GeminiProvider(process.env.AI_FALLBACK_MODEL || 'gemini-1.5-flash')
  }
}

// Helper to get provider with automatic fallback on quota errors
export async function getAIProviderWithFallback(
  tier: 'free' | 'premium' = 'free'
): Promise<AIProvider> {
  try {
    return getAIProvider(tier)
  } catch (error) {
    console.warn('Primary AI provider failed, using fallback:', error)
    return new GeminiProvider(process.env.AI_FALLBACK_MODEL || 'gemini-1.5-flash')
  }
}
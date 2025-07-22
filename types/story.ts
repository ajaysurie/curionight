export interface StoryPage {
  pageNumber: number
  content: string
  imagePrompt?: string
  imageUrl?: string
  experiment?: {
    title: string
    materials: string[]
    steps: string[]
    safety: string
  }
}

export interface DetectedObject {
  name: string
  confidence: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ScienceConcept {
  id: string
  name: string
  category: string
  description: string
  keywords: string[]
  ageRange: {
    min: number
    max: number
  }
}

export interface TopicSuggestion {
  conceptId: string
  title: string
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  previewImage?: string
  relevanceScore: number
}

export interface TopicPreview {
  title: string
  teaser: string
  thumbnailUrl?: string
  estimatedDuration: number
}

export interface StoryOptions {
  tone?: 'playful' | 'educational' | 'adventurous'
  includeExperiment?: boolean
  maxLength?: number
}

export interface StoryResult {
  success: boolean
  story?: {
    concept: ScienceConcept
    pages: StoryPage[]
    topicPreview: TopicPreview
  }
  error?: string
}
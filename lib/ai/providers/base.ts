import { DetectedObject, StoryOptions, StoryResult, TopicSuggestion } from '@/types/story'

export interface AIProvider {
  name: string
  model: string

  analyzeImage(imageBase64: string): Promise<{
    success: boolean
    objects?: DetectedObject[]
    error?: string
  }>

  generateTopicSuggestions(
    objects: DetectedObject[],
    age: number,
  ): Promise<{
    success: boolean
    suggestions?: TopicSuggestion[]
    error?: string
  }>

  generateStory(
    objects: DetectedObject[],
    conceptId: string,
    age: number,
    childName?: string,
    options?: StoryOptions,
  ): Promise<StoryResult>
}

export abstract class BaseAIProvider implements AIProvider {
  constructor(
    public name: string,
    public model: string,
  ) {}

  abstract analyzeImage(imageBase64: string): Promise<{
    success: boolean
    objects?: DetectedObject[]
    error?: string
  }>

  abstract generateTopicSuggestions(
    objects: DetectedObject[],
    age: number,
  ): Promise<{
    success: boolean
    suggestions?: TopicSuggestion[]
    error?: string
  }>

  abstract generateStory(
    objects: DetectedObject[],
    conceptId: string,
    age: number,
    childName?: string,
    options?: StoryOptions,
  ): Promise<StoryResult>
}
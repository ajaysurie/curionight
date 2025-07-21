import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseAIProvider } from './base'
import { DetectedObject, StoryOptions, StoryResult, TopicSuggestion } from '@/types/story'
import { scienceConcepts } from '@/lib/ai/concepts'

export class GeminiProvider extends BaseAIProvider {
  private genAI: GoogleGenerativeAI
  private visionModel: any
  private textModel: any

  constructor(modelName: string = 'gemini-2.0-flash-exp') {
    super('gemini', modelName)
    
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
    this.visionModel = this.genAI.getGenerativeModel({ model: modelName })
    this.textModel = this.genAI.getGenerativeModel({ model: modelName })
  }

  async analyzeImage(imageBase64: string): Promise<{
    success: boolean
    objects?: DetectedObject[]
    error?: string
  }> {
    try {
      const prompt = `Analyze this image and identify the main objects, animals, or scenes visible. 
      For each object, provide:
      - name: clear, simple name a child would understand
      - confidence: how certain you are (0-1)
      
      Focus on objects that could lead to interesting science explanations.
      Return the response as a JSON array of objects.`

      const result = await this.visionModel.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ])

      const response = await result.response
      const text = response.text()
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const objects: DetectedObject[] = JSON.parse(jsonMatch[0])
      
      return {
        success: true,
        objects: objects.slice(0, 5), // Limit to top 5 objects
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze image',
      }
    }
  }

  async generateTopicSuggestions(
    objects: DetectedObject[],
    age: number,
  ): Promise<{
    success: boolean
    suggestions?: TopicSuggestion[]
    error?: string
  }> {
    try {
      const objectNames = objects.map(obj => obj.name).join(', ')
      
      const prompt = `Given these objects from a child's photo: ${objectNames}
      And the child's age: ${age} years old
      
      Suggest 3-5 science topics that would be interesting and age-appropriate.
      Each topic should:
      - Connect directly to something visible in the photo
      - Be explained at a ${age}-year-old's level
      - Lead to a fun, safe experiment
      
      Available science concepts:
      ${scienceConcepts.map(c => `- ${c.id}: ${c.name} (${c.category})`).join('\n')}
      
      Return as JSON array with: conceptId, title, question, difficulty (easy/medium/hard), relevanceScore (0-1)`

      const result = await this.textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const suggestions: TopicSuggestion[] = JSON.parse(jsonMatch[0])
      
      return {
        success: true,
        suggestions: suggestions.slice(0, 5),
      }
    } catch (error) {
      console.error('Error generating topic suggestions:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate suggestions',
      }
    }
  }

  async generateStory(
    objects: DetectedObject[],
    conceptId: string,
    age: number,
    childName?: string,
    options?: StoryOptions,
  ): Promise<StoryResult> {
    try {
      const concept = scienceConcepts.find(c => c.id === conceptId)
      if (!concept) {
        throw new Error('Invalid concept ID')
      }

      const objectNames = objects.map(obj => obj.name).join(', ')
      const name = childName || 'Explorer'
      
      const prompt = `Create a 6-page bedtime science story for ${name}, age ${age}.
      
      Photo objects: ${objectNames}
      Science concept: ${concept.name} - ${concept.description}
      Tone: ${options?.tone || 'playful'}
      
      Requirements:
      - Page 1: Introduce ${name} noticing something from their photo
      - Pages 2-4: Explore the science concept through a fun narrative
      - Page 5: Simple, safe experiment using household items
      - Page 6: Wrap up with ${name} feeling proud and sleepy
      
      Each page should be 3-4 sentences, using simple language for a ${age}-year-old.
      ${options?.includeExperiment !== false ? 'Include a detailed experiment on page 5.' : ''}
      
      Format as JSON with:
      {
        "topicPreview": {
          "title": "Story title",
          "teaser": "One sentence hook",
          "estimatedDuration": 5
        },
        "pages": [
          {
            "pageNumber": 1,
            "content": "Page text",
            "experiment": null or {
              "title": "Experiment name",
              "materials": ["item1", "item2"],
              "steps": ["Step 1", "Step 2"],
              "safety": "Safety note"
            }
          }
        ]
      }`

      const result = await this.textModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const storyData = JSON.parse(jsonMatch[0])
      
      return {
        success: true,
        story: {
          concept,
          pages: storyData.pages,
          topicPreview: storyData.topicPreview,
        },
      }
    } catch (error) {
      console.error('Error generating story:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate story',
      }
    }
  }
}
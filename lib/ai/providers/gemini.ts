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
      
      // Check if we're dealing with emojis (special concept)
      const isEmojiStory = conceptId === 'emoji-adventure'
      const contextDescription = isEmojiStory 
        ? `The child has chosen these magical ingredients for their story: ${objectNames}. Use these emojis as inspiration for the adventure!`
        : `Objects from photo: ${objectNames}`
      
      const prompt = `Create an enchanting 6-page bedtime science story for ${name}, age ${age}.

      STORY CONTEXT:
      - Main character: ${name} - a curious ${age}-year-old who loves discovering how things work
      - Setting: ${contextDescription}
      - Science concept: ${concept.name} - ${concept.description}
      - Tone: ${options?.tone || 'playful'} and wonder-filled
      - IMPORTANT: Include "Curio" (the wise owl mascot) in the story title and as a guide character
      
      CHARACTER REQUIREMENTS:
      - Give ${name} a distinct personality trait (e.g., always asks "why?", loves to draw, collects interesting rocks)
      - Include Curio the Owl as a friendly guide who helps ${name} discover science
      - Add supporting characters who help explain concepts (e.g., Grandpa the engineer, Dr. Molecule, Captain Photon)
      
      STORY STRUCTURE:
      - Page 1: Set the scene with vivid sensory details. ${name} discovers something intriguing related to their photo that sparks curiosity
      - Page 2: The adventure begins! ${name} and their companion start exploring. Use dialogue and action
      - Page 3: Meet a helpful character who explains the science in a fun, metaphorical way (no lectures!)
      - Page 4: ${name} makes a personal connection to the concept through hands-on discovery
      - Page 5: A wonderful "aha!" moment where everything clicks - ${name} truly understands the science concept through a memorable discovery
      - Page 6: Cozy ending where ${name} reflects on their discovery, feeling accomplished and ready for sweet dreams
      
      WRITING STYLE:
      - Use rich, sensory language appropriate for ${age}-year-olds
      - Include dialogue to bring characters to life
      - Add sound effects (Whoosh! Bubble-bubble! Zing!)
      - Create memorable moments with specific details
      - Each page should be 4-6 engaging sentences
      - Include gentle humor and wonder
      - Make science feel like magic that we can understand
      
      VOICE MARKERS FOR AUDIO (IMPORTANT):
      - Use {{child:"text"}} for when ${name} speaks (youthful voice)
      - Use {{wise:"text"}} for Curio the Owl's dialogue (knowledgeable voice)
      - Use {{excited:"text"}} for exciting discoveries or experiments
      - Use {{gentle:"text"}} for calming, bedtime moments
      - Use {{friendly:"text"}} for other helpful characters
      - Regular narration text needs no markers
      - Example: Curio flapped his wings. {{wise:"Did you know that stars are like giant lanterns in space?"}} {{child:"Wow! Can we visit them?"}} asked ${name} excitedly.
      
      IMPORTANT: Make this a story children will request again and again, with characters they'll remember and science that feels like an adventure!
      
      Format as JSON with:
      {
        "topicPreview": {
          "title": "Story title (must include 'Curio' in the title)",
          "teaser": "One sentence hook mentioning Curio the owl",
          "estimatedDuration": 5
        },
        "pages": [
          {
            "pageNumber": 1,
            "content": "Page text with dialogue and vivid descriptions",
            "imagePrompt": "Description for AI image generation (include Curio the purple owl with the child)"
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
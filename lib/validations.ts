import { z } from 'zod'

export const analyzePhotoSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  age: z.number().min(4).max(8).default(6),
})

export const generateStorySchema = z.object({
  objects: z.array(
    z.object({
      name: z.string(),
      confidence: z.number(),
    })
  ),
  conceptId: z.string().min(1, 'Concept ID is required'),
  age: z.number().min(4).max(8).default(6),
  childName: z.string().optional(),
  options: z
    .object({
      tone: z.enum(['playful', 'educational', 'adventurous']).optional(),
      includeExperiment: z.boolean().optional(),
    })
    .optional(),
})

export const generateAudioSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  voice: z.string().default('nova'),
})
#!/usr/bin/env tsx

import { prisma } from '../lib/db/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

async function addVoiceMarkersToStory(story: any) {
  console.log(`Processing story: ${story.id}`)
  
  const updatedPages = []
  
  for (const page of story.pages) {
    const prompt = `Add voice markers to this children's story page for multi-voice narration.
    
    Original text: ${page.content}
    
    Instructions:
    - Use {{child:"text"}} for when the child character speaks
    - Use {{wise:"text"}} for wise characters like Curio the Owl
    - Use {{excited:"text"}} for exciting discoveries
    - Use {{gentle:"text"}} for calming moments
    - Use {{friendly:"text"}} for other characters
    - Keep regular narration without markers
    - Only add markers to dialogue and character expressions
    - Preserve the original story exactly, just add voice markers
    
    Return ONLY the updated text with voice markers, nothing else.`
    
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const updatedContent = response.text().trim()
      
      updatedPages.push({
        ...page,
        content: updatedContent
      })
      
      console.log(`Updated page ${page.pageNumber}`)
    } catch (error) {
      console.error(`Failed to update page ${page.pageNumber}:`, error)
      updatedPages.push(page) // Keep original if update fails
    }
  }
  
  // Update the story in the database
  await prisma.story.update({
    where: { id: story.id },
    data: {
      pages: updatedPages as any,
      // Clear audio URLs so they'll be regenerated with new voices
      audioUrls: new Array(updatedPages.length).fill('') as any
    }
  })
  
  console.log(`Story ${story.id} updated successfully`)
}

async function main() {
  try {
    // Get all stories
    const stories = await prisma.story.findMany({
      take: 5, // Process first 5 stories as a test
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`Found ${stories.length} stories to process`)
    
    for (const story of stories) {
      await addVoiceMarkersToStory(story)
      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    console.log('All stories processed!')
  } catch (error) {
    console.error('Error processing stories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
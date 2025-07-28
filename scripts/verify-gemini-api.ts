#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai'

async function verifyGeminiAPI() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  
  if (!apiKey) {
    console.error('❌ GOOGLE_GEMINI_API_KEY environment variable not found')
    return
  }
  
  console.log('🔍 Verifying Gemini API Key...\n')
  console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
  
  try {
    // Test 1: Basic API connectivity
    console.log('\n📡 Test 1: Checking API connectivity...')
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Test with a simple model first
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent('Say "API is working"')
    const response = await result.response
    console.log('✅ Basic API connectivity: SUCCESS')
    console.log('   Response:', response.text().substring(0, 50) + '...')
    
    // Test 2: Check TTS model availability
    console.log('\n🎤 Test 2: Checking TTS model availability...')
    try {
      const ttsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{
              parts: [{
                text: "Test"
              }]
            }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede"
                  }
                }
              }
            }
          }),
        }
      )
      
      if (ttsResponse.ok) {
        console.log('✅ TTS model access: SUCCESS')
      } else {
        const error = await ttsResponse.text()
        const errorData = JSON.parse(error)
        console.log('❌ TTS model access: FAILED')
        console.log('   Error:', errorData.error.message)
        
        // Check if it's a quota error
        if (errorData.error.code === 429) {
          console.log('\n⚠️  QUOTA INFORMATION:')
          const violations = errorData.error.details?.[0]?.violations
          if (violations) {
            violations.forEach((v: any) => {
              console.log(`   - Metric: ${v.quotaMetric}`)
              console.log(`   - Limit: ${v.quotaValue} requests per minute`)
              console.log(`   - Model: ${v.quotaDimensions?.model || 'N/A'}`)
            })
          }
        }
      }
    } catch (error) {
      console.log('❌ TTS model test failed:', error)
    }
    
    // Test 3: Check available models
    console.log('\n📋 Test 3: Listing available models...')
    try {
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (modelsResponse.ok) {
        const data = await modelsResponse.json()
        const models = data.models || []
        console.log(`✅ Found ${models.length} available models`)
        
        // Filter for TTS models
        const ttsModels = models.filter((m: any) => 
          m.name.includes('tts') || m.supportedGenerationMethods?.includes('generateAudio')
        )
        
        if (ttsModels.length > 0) {
          console.log('\n   TTS Models:')
          ttsModels.forEach((m: any) => {
            console.log(`   - ${m.name} (${m.displayName})`)
          })
        } else {
          console.log('   ⚠️  No TTS models found in available models list')
        }
      }
    } catch (error) {
      console.log('❌ Failed to list models:', error)
    }
    
    // Test 4: Check billing/quota status
    console.log('\n💰 Test 4: Checking quota and billing indicators...')
    
    // Make multiple rapid requests to test rate limits
    console.log('   Testing rate limits with 3 rapid requests...')
    let successCount = 0
    let rateLimitHit = false
    
    for (let i = 0; i < 3; i++) {
      try {
        const testResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{
                parts: [{
                  text: `Test ${i}`
                }]
              }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: "Aoede"
                    }
                  }
                }
              }
            }),
          }
        )
        
        if (testResponse.ok) {
          successCount++
          console.log(`   ✅ Request ${i + 1}: SUCCESS`)
        } else if (testResponse.status === 429) {
          rateLimitHit = true
          const error = await testResponse.text()
          const errorData = JSON.parse(error)
          const quotaValue = errorData.error.details?.[0]?.violations?.[0]?.quotaValue
          console.log(`   ⚠️  Request ${i + 1}: Rate limit hit (${quotaValue} RPM limit)`)
          break
        }
        
        // Small delay between requests
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.log(`   ❌ Request ${i + 1}: ERROR -`, error)
      }
    }
    
    console.log('\n📊 SUMMARY:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`API Key Status: ${apiKey ? '✅ Present' : '❌ Missing'}`)
    console.log(`Basic API Access: ✅ Working`)
    console.log(`TTS Model Access: ${successCount > 0 ? '✅ Available' : '❌ Not Available'}`)
    
    if (rateLimitHit) {
      console.log(`Billing Status: 🆓 FREE TIER (10 RPM limit)`)
      console.log('\n💡 To enable multi-voice narration, you need to:')
      console.log('   1. Enable billing in Google Cloud Console')
      console.log('   2. Link your project to a billing account')
      console.log('   3. Upgrade to a paid plan for higher rate limits')
      console.log('\n   Visit: https://console.cloud.google.com/billing')
    } else if (successCount === 3) {
      console.log(`Billing Status: 💳 LIKELY PAID TIER (no immediate rate limit)`)
    }
    
    console.log('\n🔗 Useful links:')
    console.log('   - Google Cloud Console: https://console.cloud.google.com')
    console.log('   - API Keys: https://console.cloud.google.com/apis/credentials')
    console.log('   - Billing: https://console.cloud.google.com/billing')
    console.log('   - Gemini API Pricing: https://ai.google.dev/pricing')
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error)
  }
}

// Run the verification
verifyGeminiAPI().catch(console.error)
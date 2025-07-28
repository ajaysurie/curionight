#!/usr/bin/env tsx

async function checkQuotaStatus() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.argv[2]
  
  if (!apiKey) {
    console.error('Usage: npx tsx check-quota-status.ts <API_KEY>')
    return
  }
  
  console.log('🔍 Checking Gemini API Quota Status...\n')
  
  // Try different operations to understand quota state
  const operations = [
    {
      name: 'Text Generation (gemini-1.5-flash)',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      body: {
        contents: [{
          parts: [{ text: "Say hello" }]
        }]
      }
    },
    {
      name: 'TTS Generation (gemini-2.5-flash-preview-tts)',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',
      body: {
        model: "gemini-2.5-flash-preview-tts",
        contents: [{
          parts: [{ text: "Hello" }]
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
      }
    }
  ]
  
  for (const op of operations) {
    console.log(`\n📋 Testing: ${op.name}`)
    console.log('─'.repeat(40))
    
    try {
      const response = await fetch(`${op.endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(op.body)
      })
      
      if (response.ok) {
        console.log('✅ SUCCESS - Request completed')
        const data = await response.json()
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log(`   Response: ${data.candidates[0].content.parts[0].text.substring(0, 50)}...`)
        } else if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          console.log('   Response: Audio data received')
        }
      } else {
        console.log(`❌ FAILED - Status: ${response.status}`)
        const errorText = await response.text()
        try {
          const error = JSON.parse(errorText)
          console.log(`   Error: ${error.error.message}`)
          
          // Extract quota details
          if (error.error.details) {
            error.error.details.forEach((detail: any) => {
              if (detail.violations) {
                console.log('\n   📊 Quota Details:')
                detail.violations.forEach((v: any) => {
                  console.log(`   • Metric: ${v.quotaMetric.split('/').pop()}`)
                  console.log(`   • Limit: ${v.quotaValue} ${v.quotaMetric.includes('per_day') ? 'per day' : 'per minute'}`)
                  if (v.quotaDimensions?.model) {
                    console.log(`   • Model: ${v.quotaDimensions.model}`)
                  }
                })
              }
              if (detail.retryDelay) {
                console.log(`   • Retry after: ${detail.retryDelay}`)
              }
            })
          }
        } catch (e) {
          console.log(`   Raw error: ${errorText}`)
        }
      }
    } catch (error) {
      console.log('❌ Network/Other Error:', error)
    }
  }
  
  // Test rate limits more carefully
  console.log('\n\n🏃 Rate Limit Test (3 requests with delays)')
  console.log('─'.repeat(40))
  
  let successCount = 0
  for (let i = 0; i < 3; i++) {
    process.stdout.write(`Request ${i + 1}/3... `)
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Test ${i}` }] }]
          })
        }
      )
      
      if (response.ok) {
        successCount++
        console.log('✅')
      } else {
        console.log(`❌ (${response.status})`)
        if (response.status === 429) {
          const error = await response.json()
          const quotaValue = error.error.details?.[0]?.violations?.[0]?.quotaValue
          console.log(`   Rate limit: ${quotaValue} RPM`)
        }
      }
    } catch (error) {
      console.log('❌ (network error)')
    }
    
    // Wait 7 seconds between requests
    if (i < 2) {
      process.stdout.write('   Waiting 7s... ')
      await new Promise(resolve => setTimeout(resolve, 7000))
      console.log('done')
    }
  }
  
  console.log(`\n✅ Successful requests: ${successCount}/3`)
  
  console.log('\n\n📊 QUOTA STATUS SUMMARY')
  console.log('═'.repeat(40))
  console.log('• If you see "per_day" errors: You\'ve hit daily limits')
  console.log('• If you see "per_minute" errors: You\'re hitting rate limits')
  console.log('• If requests succeed with delays: Billing is likely active')
  console.log('\n💡 Daily quotas reset at midnight Pacific Time')
  console.log('   Current time: ' + new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) + ' PT')
}

// Run the check
checkQuotaStatus().catch(console.error)
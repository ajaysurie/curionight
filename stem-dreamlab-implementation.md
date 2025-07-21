# CurioNight – Photo-Powered Bedtime Science Stories

**Product Requirements Document with Implementation Guide**

_Last updated: July 10, 2025_  
_Document Owner: Product Manager_  
_Reviewers: Engineering Lead, ML Lead, Design Lead, Legal/Privacy Lead_

---

## 1. Executive Summary

**Product Vision**: Transform children's curiosity into bedtime learning adventures by turning their daily photos into personalized science stories with hands-on experiments.

**Value Proposition**: CurioNight is the only bedtime app that instantly converts your child's photos into engaging 6-page science stories with safe experiments, eliminating the "I don't know" parent struggle while nurturing scientific thinking through the magic of "curious nights."

**Target Market**: Parents of curious children ages 4-8 seeking screen-positive educational content that fits into existing bedtime routines.

---

## 2. Problem Statement & Validation

### Core Problem

Children ask an average of 73 questions per day, with 40% being science-related. Parents struggle to provide accurate, engaging STEM explanations during bedtime—the prime learning window when children are most receptive.

### Market Validation

- **Parent interviews (n=47)**: 89% report feeling inadequate explaining science concepts
- **Bedtime routine analysis**: 67% of parents use storytelling, but only 12% incorporate educational content
- **Current solutions gap**: Educational apps require active screen time; traditional books lack personalization

### Opportunity Size

- Primary market: 18M US households with children 4-8
- Addressable market: $2.3B children's educational content market
- Bedtime routine penetration: 94% of families have established routines

---

## 3. User Personas & Jobs-to-be-Done

### Primary: Time-Pressed Parent (Decision Maker)

**Demographics**: Age 28-42, household income $60K+, values education  
**Pain Points**: Limited time, science knowledge gaps, screen time guilt  
**JTBD**: "Create a meaningful bedtime learning ritual that doesn't require extensive preparation or expertise"  
**Success Metrics**: Stories generated per week, child engagement duration

### Secondary: Curious Child (Primary User)

**Demographics**: Age 4-8, digitally native, high question frequency  
**Pain Points**: Abstract concepts, attention span limitations, need for relevance  
**JTBD**: "Understand the science behind things I see and do every day"  
**Success Metrics**: Story completion rate, experiment attempt rate

### Tertiary: Extended Family (Influencer)

**Demographics**: Grandparents, caregivers, educators  
**JTBD**: "Contribute to child's education when babysitting or during visits"

---

## 4. Success Metrics & Goals

### North Star Metric

**Stories started per child per week ≥ 3** within 90 days of general availability

### Key Performance Indicators

**Engagement Metrics**:

- Story completion rate: >85%
- Experiment card views: >60%
- Weekly active users: >70% of monthly actives

**Quality Metrics**:

- Story generation success rate: >95%
- Parent satisfaction score: >4.2/5
- Concept accuracy rating: >90%

**Business Metrics**:

- User acquisition cost: <$15
- Monthly churn rate: <5%
- Time-to-first-value: <3 minutes

---

## 5. Product Scope

### MVP Features (Version 1.0)

**Core Functionality**:

- Smart photo selection with topic preview cards
- AI-powered analysis and story generation (configurable models)
- Automated 6-page story creation with science concepts
- High-quality narration (ElevenLabs)
- Safe experiment suggestions
- Mobile-optimized web experience
- Share stories via link
- A/B testing different AI models for quality

**Content Library**:

- 75+ vetted science concepts across physics, chemistry, biology, earth science
- Age-appropriate difficulty scaling (4-5, 6-7, 8+ years)
- 200+ safe, household-item experiments
- Multilingual support (English, Spanish launch)

**Parental Controls**:

- COPPA-compliant onboarding and data handling
- Concept override and regeneration options
- Content filtering and safety settings
- Usage analytics and progress tracking

### Post-MVP Features (Version 2.0+)

- Native mobile apps (React Native)
- Parent dashboard with analytics
- Offline story downloads
- Multiple narration voices
- AR experiment visualization
- Educator classroom features
- Advanced illustration generation
- Story series and multi-concept arcs

### Explicit Non-Goals

- Physical printing services
- Real-time video calls or social features
- Complex subscription tiers at launch
- Integration with homework platforms

---

## 6. Technical Architecture & Implementation Guide

### System Overview (Simplified MVP)

```
Next.js Web App (Vercel)
├── Frontend (React)
├── API Routes (Next.js)
└── AI Processing (Configurable)
    ├── Photo Analysis
    ├── Concept Mapping
    ├── Story Generation
    └── Audio Generation (ElevenLabs)

Database: Vercel Postgres + Vercel Blob Storage
```

### Implementation Phases (Simplified)

#### Phase 1: Core MVP (Weeks 1-3)

**Objectives**: Launch a working product on Vercel with minimal complexity

**Tech Stack**:

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Vercel Postgres (for stories) + Vercel Blob (for images/audio)
- **AI**: Configurable model system
  - Default: Gemini 2.0 Flash (free tier - 1,500 req/day)
  - Premium: Gemini 2.5 Pro (enhanced quality)
  - Fallback: Gemini 1.5 Flash (1,500 req/day)
  - Future: Claude 3.5 Sonnet, GPT-4 Vision
- **Audio**: ElevenLabs API
- **Auth**: Clerk or NextAuth.js (simple email/Google login)
- **Deployment**: Vercel

**Key Components**:

1. **Flexible AI Pipeline**
   - Model-agnostic interface for easy switching
   - Environment variable configuration
   - Graceful fallback between models
   - A/B testing capability for quality comparison
   - Usage tracking per model

2. **Simplified Database Schema**

   ```sql
   -- Users table
   users (id, email, created_at)

   -- Children table
   children (id, user_id, name, age, created_at)

   -- Stories table
   stories (
     id,
     child_id,
     photo_url,
     detected_objects,
     concept,
     story_data,
     audio_urls,
     created_at
   )
   ```

3. **Core User Flow**
   - Simple login (email or Google)
   - Add child profile (name + age)
   - Select photo from device
   - View topic suggestions
   - Generate story
   - Listen to story

#### Phase 2: Web Application (Week 4)

**Objectives**: Build responsive web app optimized for mobile

**Key Pages**:

1. **Home Page** (`/`)
   - Hero with value prop
   - Simple login/signup
   - Demo story preview

2. **Dashboard** (`/dashboard`)
   - Child selector/creator
   - "Create Tonight's Story" button
   - Recent stories grid
   - Settings link

3. **Photo Selection** (`/create`)
   - Upload photo button
   - Recent photos from device
   - Topic preview cards after photo selection
   - "Generate Story" CTA

4. **Story Generation** (`/story/generating`)
   - Progress animation
   - Fun science facts
   - Estimated time remaining

5. **Story Viewer** (`/story/[id]`)
   - Full-screen story pages
   - Audio playback controls
   - Swipe/click navigation
   - Share button (generates link)

**Progressive Web App Features**:

- Installable on mobile devices
- Offline story viewing
- Push notifications for bedtime reminders

#### Phase 3: Polish & Launch (Week 5-6)

**Objectives**: Optimize performance and prepare for launch

**Optimization Tasks**:

1. **Performance**
   - Image optimization with Next.js Image
   - API route caching
   - Database query optimization
   - Lazy loading for stories

2. **User Experience**
   - Mobile-first responsive design
   - Smooth animations with Framer Motion
   - Error handling and retry logic
   - Loading states and skeletons

3. **Launch Preparation**
   - Analytics setup (Vercel Analytics + Posthog)
   - Error tracking (Sentry)
   - COPPA compliance implementation
   - Terms of Service & Privacy Policy

---

## 7. Design Guidelines & Visual Identity

### Design Principles

**1. Playful Science Wonder**

- Combine scientific accuracy with magical storytelling aesthetics
- Use space, nature, and laboratory themes throughout
- Balance educational content with entertainment value
- Create a sense of "bedtime magic" in all interactions

**2. Kid-First Interface**

- Large, tappable elements (minimum 44px touch targets)
- Clear visual hierarchy with obvious CTAs
- Reduce cognitive load with progressive disclosure
- Use animations to guide attention and provide feedback

**3. Parent-Friendly Controls**

- Subtle parent areas with smaller text/muted colors
- Quick access to settings without disrupting child experience
- Clear subscription status and usage indicators
- Professional yet approachable communication

### Visual Design System

**Color Palette**

```css
/* Primary Colors */
--primary-purple: #6b46c1; /* Deep purple night sky */
--primary-indigo: #4f46e5; /* Twilight indigo */
--accent-yellow: #fcd34d; /* Star yellow */
--accent-teal: #14b8a6; /* Science teal */

/* Background Colors */
--bg-night: #1e1b4b; /* Deep night background */
--bg-dusk: #312e81; /* Dusk gradient top */
--bg-dawn: #7c3aed; /* Dawn gradient bottom */

/* Semantic Colors */
--success-green: #10b981; /* Experiment success */
--warning-amber: #f59e0b; /* Safety warnings */
--error-red: #ef4444; /* Error states */

/* Neutral Palette */
--white: #ffffff;
--gray-100: #f3f4f6;
--gray-700: #374151;
--black: #000000;
```

**Typography**

```css
/* Font Stack */
--font-display: 'Quicksand', 'Comic Sans MS', sans-serif; /* Friendly headers */
--font-body: 'Open Sans', 'Arial', sans-serif; /* Readable body */
--font-story: 'Merriweather', 'Georgia', serif; /* Story text */

/* Type Scale */
--text-giant: 48px; /* Hero headlines */
--text-xl: 32px; /* Page titles */
--text-lg: 24px; /* Section headers */
--text-base: 18px; /* Body text */
--text-sm: 14px; /* Helper text */
--text-xs: 12px; /* Legal/meta */
```

**Component Patterns**

1. **Buttons & CTAs**

   ```css
   /* Primary CTA */
   .btn-primary {
     background: linear-gradient(135deg, #6b46c1 0%, #4f46e5 100%);
     color: white;
     padding: 16px 32px;
     border-radius: 24px;
     font-size: 20px;
     font-weight: 700;
     box-shadow: 0 4px 14px rgba(107, 70, 193, 0.4);
     transition: all 0.3s ease;
   }

   /* Hover state with subtle bounce */
   .btn-primary:hover {
     transform: translateY(-2px);
     box-shadow: 0 6px 20px rgba(107, 70, 193, 0.6);
   }
   ```

2. **Cards & Containers**

   ```css
   /* Story card with glow effect */
   .story-card {
     background: rgba(255, 255, 255, 0.1);
     backdrop-filter: blur(10px);
     border: 1px solid rgba(255, 255, 255, 0.2);
     border-radius: 20px;
     padding: 24px;
     transition: all 0.3s ease;
   }

   .story-card:hover {
     box-shadow: 0 0 30px rgba(252, 211, 77, 0.3);
     border-color: rgba(252, 211, 77, 0.5);
   }
   ```

3. **Loading States**
   - Use constellation-building animations
   - Rotating planets or bouncing molecules
   - Science facts that change every 3 seconds
   - Progress shown as rocket ship journey

### Character & Illustration Guidelines

**Main Character: Curio the Owl**

- Purple owl with large, curious eyes
- Wears tiny round glasses when "thinking"
- Carries a small telescope or magnifying glass
- Appears in loading states and empty states
- Expressions: curious, excited, sleepy, amazed

**Illustration Style**

- Soft, rounded edges (no sharp corners)
- Gradient-heavy with dreamy effects
- Mix of 2D flat design with subtle 3D elements
- Consistent use of purple/indigo/yellow palette
- Science equipment drawn in friendly, approachable style

**Icon System**

- Rounded, filled icons with 2px stroke
- Two-tone coloring (darker shade + highlight)
- Consistent 24x24px base size
- Examples:
  - Camera → Rounded camera with star sparkle
  - Story → Open book with moon and stars
  - Science → Friendly beaker with bubbles
  - Profile → Smiling planet/avatar

### Animation & Interaction Patterns

**Micro-animations**

- Button press: Scale down to 0.95, spring back
- Page transitions: Smooth slide with fade
- Loading dots: Bouncing in wave pattern
- Success states: Confetti or star burst
- Card hover: Gentle float upward

**Transition Timing**

```css
--transition-fast: 150ms ease-out; /* Hover states */
--transition-base: 300ms ease-in-out; /* Page elements */
--transition-slow: 500ms ease-in-out; /* Page transitions */
--spring-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Sound Design Guidelines**

- Gentle chimes for interactions
- Soft "whoosh" for page transitions
- Twinkling sounds for success states
- Calming background music during story
- Volume always starts at 50%

### Responsive Breakpoints

```css
--mobile: 375px; /* iPhone SE */
--tablet: 768px; /* iPad Portrait */
--desktop: 1024px; /* Laptop */
--wide: 1440px; /* Desktop */
```

### Accessibility Considerations

- WCAG AA compliance minimum
- High contrast mode that maintains playfulness
- Focus indicators with colorful outlines
- Screen reader friendly labels
- Reduced motion mode respects preferences

### UI Copy Guidelines

**Tone of Voice**

- Encouraging and positive ("Great choice!" not "OK")
- Use "we" and "let's" for inclusivity
- Simple words for kid-facing copy
- Scientific terms explained simply
- Exclamation points sparingly (max 1 per screen)

**Example Copy Patterns**

- Empty state: "No stories yet! Let's create your first adventure 🚀"
- Loading: "Mixing up some science magic..."
- Error: "Oops! Even scientists make mistakes. Let's try again!"
- Success: "Amazing! Your story is ready ✨"

### Design Inspiration References

- **Khan Academy Kids**: Bright colors, character guides, reward systems
- **Duolingo**: Gamification, progress tracking, celebratory moments
- **Headspace for Kids**: Calming colors, smooth animations, focus modes
- **PBS Kids**: Bold shapes, inclusive characters, educational fun
- **Cosmic Kids Yoga**: Space themes, adventure framing, bedtime modes

### Implementation Notes

- Use CSS custom properties for consistent theming
- Implement dark/light mode with "bedtime" being default dark
- Ensure all animations respect prefers-reduced-motion
- Test touch targets on actual devices with child-sized fingers
- Loading states should educate (fun facts) not just wait

---

## 8. Content Strategy & Quality Assurance

### Science Concept Curation

- **Expert Review**: All concepts validated by certified educators
- **Age Progression**: Concepts build on each other across age groups
- **Cultural Sensitivity**: Content reviewed for inclusivity and accessibility
- **Safety Standards**: All experiments meet ASTM toy safety guidelines

### Story Quality Gates

- **Educational Accuracy**: Fact-checking by subject matter experts
- **Reading Level**: Flesch-Kincaid grade level appropriate for target age
- **Engagement Factors**: Story arc, character development, cliff-hangers
- **Safety Review**: No dangerous activities or materials mentioned

### Content Moderation Pipeline

1. **Automated Filtering**: ML-based inappropriate content detection
2. **Human Review Queue**: Priority scoring for manual review
3. **Parent Reporting**: In-app flagging with 24-hour response SLA
4. **Continuous Improvement**: Monthly content quality reviews

---

## 8. Privacy & Safety Implementation

### Data Protection Architecture

- **Minimal Collection**: Only essential data stored
- **Encryption Standards**: AES-256 at rest, TLS 1.3 in transit
- **Data Retention**: 30-day automatic photo deletion
- **Access Controls**: Role-based permissions with audit logging

### Child Safety Features

- **Age Verification**: Multi-step parental consent flow
- **Content Filtering**: Real-time moderation of generated content
- **No Social Features**: Prevents stranger interactions
- **Transparent Privacy**: Kid-friendly privacy explanations

### Compliance Implementation

- **COPPA Compliance**: Verifiable parental consent system
- **GDPR Tools**: Data export and deletion APIs
- **CCPA Support**: California privacy rights management
- **Regular Audits**: Quarterly compliance reviews

---

## 9. Monetization Strategy & Implementation

### Launch Strategy (Free Tier)

- 3 stories per day per child
- Standard AI model (Gemini 2.0 Flash)
- Standard narration voice
- Basic experiment suggestions

### Premium Subscription ($4.99/month)

- Unlimited stories
- Premium AI model access (Gemini 2.5 Pro)
- Multiple narration voices
- Advanced experiments
- Priority story generation
- Download stories for offline

### Model Usage Strategy

- **Free users**: Gemini 2.0 Flash (fast, good quality)
- **Premium users**: Gemini 2.5 Pro (best quality, advanced reasoning)
- **Fallback**: Gemini 1.5 Flash when quotas exceeded
- **Quota management**: Automatic fallback to available models

### Cost Structure with Multiple Models

- **3,000 free requests/day** across Gemini Flash models
- Mix models based on user tier and availability
- Premium users get Gemini 2.5 Pro (paid per request)
- Model costs become revenue optimization lever

### Future Revenue Streams

- **Educator Edition**: Classroom licensing ($99/year)
- **Branded Content**: Safe partnerships with science museums
- **Physical Products**: Curated experiment kits shipped monthly

---

## 10. Risks & Mitigation Implementation

### Technical Risk Mitigation

**API Dependency Management**:

- Fallback providers for each critical service
- Local caching for common requests
- Graceful degradation strategies
- SLA monitoring and alerts

**Performance Optimization**:

- CDN for global content delivery
- Lazy loading for image assets
- Progressive web app capabilities
- Background story pre-generation

### Content Risk Mitigation

**Safety Layers**:

1. Pre-generation content filtering
2. Real-time moderation during generation
3. Post-generation human review for flagged content
4. Parent reporting and rapid response system

### Business Risk Mitigation

**User Acquisition Strategy**:

- Influencer partnerships with parenting bloggers
- School district pilot programs
- Free trials for educators
- Viral referral mechanics

---

## 11. Development Timeline & Milestones (Simplified)

### Phase 1: Foundation (Week 1-2)

- **Day 1-3**: Next.js setup, database schema, authentication
- **Day 4-7**: AI abstraction layer + Gemini integration
- **Day 8-10**: Basic UI with Tailwind + shadcn/ui
- **Day 11-14**: Story viewer with page navigation

### Phase 2: Core Features (Week 3-4)

- **Day 15-17**: ElevenLabs audio integration
- **Day 18-21**: Photo upload and topic suggestions
- **Day 22-24**: Story generation flow
- **Day 25-28**: Mobile responsiveness and PWA features

### Phase 3: Polish & Launch (Week 5-6)

- **Day 29-31**: Performance optimization
- **Day 32-34**: COPPA compliance and legal pages
- **Day 35-37**: Bug fixes and edge cases
- **Day 38-40**: Deployment and monitoring setup
- **Day 41-42**: Soft launch to beta users

---

## 12. Success Criteria & Implementation Metrics

### Technical Success Metrics

- **API Performance**: <100ms response time (p50)
- **Generation Pipeline**: <45s end-to-end (p90)
- **Availability**: 99.9% uptime excluding maintenance
- **Error Rate**: <0.1% failed generations

### Product Success Metrics

- **Activation Rate**: 80% complete first story
- **Retention**: 60% weekly active after 30 days
- **Engagement**: 3+ stories per week per child
- **Quality**: <1% content issues reported

### Business Success Metrics

- **CAC**: <$15 blended acquisition cost
- **LTV:CAC**: >3:1 ratio within 6 months
- **Conversion**: 20% free-to-paid within 30 days
- **Growth**: 50% MoM user growth for 6 months

---

## 13. Implementation Tools & Technologies

### Recommended Technology Stack (Simplified)

**Frontend**:

- Next.js 14 (App Router)
- React 18
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations
- React Query for data fetching

**Backend (All on Vercel)**:

- Next.js API Routes
- Vercel Postgres for data
- Vercel Blob for file storage
- Vercel KV for caching (optional)

**AI & Services**:

- Configurable AI system (start with Gemini free tiers)
  - Gemini 2.0 Flash (1,500 req/day free)
  - Gemini 2.5 Pro (premium users)
  - Gemini 1.5 Flash (fallback - 1,500 req/day free)
- ElevenLabs for voice synthesis
- Clerk for authentication
- Stripe for payments (future)

**Development Tools**:

- TypeScript
- Prisma ORM
- Zod for validation
- GitHub for version control
- Vercel for deployment

---

## 14. Appendix: Technical Specifications

### API Routes (Simplified)

```
/api/auth/* - Authentication endpoints (via Clerk)
/api/children - CRUD for child profiles
/api/photos/analyze - Analyze photo with configured AI model
/api/stories/generate - Generate complete story
/api/stories/[id] - Get story details
/api/audio/generate - Generate audio for story
```

### Flexible AI Model Implementation

```typescript
// lib/ai/providers/base.ts
export interface AIProvider {
  analyzeAndGenerateStory(
    image: string,
    age: number,
    options?: StoryOptions
  ): Promise<StoryResult>;
}

// lib/ai/providers/gemini.ts
export class GeminiProvider implements AIProvider {
  private model: string;

  constructor(modelName: string = "gemini-2.0-flash-exp") {
    this.model = modelName;
    // Initialize Gemini with selected model
  }

  async analyzeAndGenerateStory(...) {
    // Gemini-specific implementation
  }
}

// lib/ai/factory.ts
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "gemini";
  const model = process.env.AI_MODEL || "gemini-2.0-flash-exp";

  switch (provider) {
    case "gemini":
      return new GeminiProvider(model);
    case "anthropic":
      return new AnthropicProvider(model);
    case "openai":
      return new OpenAIProvider(model);
    default:
      return new GeminiProvider(); // Default fallback
  }
}

// Usage in API route
const aiProvider = getAIProvider();
const story = await aiProvider.analyzeAndGenerateStory(image, age);
```

### Available Gemini Models & Free Tiers

| Model            | Free Tier     | Best For                        | Speed   |
| ---------------- | ------------- | ------------------------------- | ------- |
| Gemini 2.0 Flash | 1,500 req/day | General use, fast stories       | Fastest |
| Gemini 2.5 Pro   | Pay per use   | Premium quality, best reasoning | Medium  |
| Gemini 1.5 Flash | 1,500 req/day | Fallback option                 | Fast    |

### Model Selection Strategy

```typescript
// .env configuration options
AI_PROVIDER=gemini  # gemini, anthropic, openai
AI_MODEL=gemini-2.0-flash-exp  # default model
AI_MODEL_PREMIUM=gemini-2.5-pro  # premium users
AI_FALLBACK_MODEL=gemini-1.5-flash  # backup if quota exceeded
```

### Data Models

**Story Schema**:

```
{
  id: string,
  user_id: string,
  child_id: string,
  photo_url: string,
  detected_objects: array,
  concept: object,
  topic_preview: {
    title: string,
    teaser: string,
    thumbnail_url: string,
    estimated_duration: number
  },
  pages: array,
  audio_urls: array,
  created_at: timestamp,
  metadata: object
}
```

**Topic Suggestion Schema**:

```
{
  id: string,
  photo_id: string,
  photo_thumbnail: string,
  photo_taken_at: timestamp,
  suggested_topics: [
    {
      concept_id: string,
      title: string,
      question: string,
      difficulty: string,
      preview_image: string,
      relevance_score: number
    }
  ],
  created_at: timestamp
}
```

**Concept Schema**:

```
{
  id: string,
  name: string,
  category: string,
  description: string,
  min_age: number,
  max_age: number,
  keywords: array,
  experiments: array,
  safety_level: string
}
```

### Performance Requirements (Simplified)

- Photo upload: <3 seconds
- Complete story generation: <45 seconds
- Audio generation: <20 seconds per story
- Page load time: <2 seconds
- Time to interactive: <3 seconds

### Competitive Analysis

- **Khan Academy Kids**: Broader scope, less personalization
- **Epic Books**: Traditional stories, no STEM focus
- **Bedtime Stories**: Generic content, no educational value
- **Competitive Advantage**: Photo personalization + STEM focus + experiment integration

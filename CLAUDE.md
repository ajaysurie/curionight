# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted

### Database
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio to view/edit data
- `npm run db:generate` - Generate Prisma client types

### Testing (when implemented)
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

## High-level Architecture

### AI Provider System
The app uses a flexible AI provider pattern to support multiple AI models:
- `lib/ai/providers/base.ts` - Base interface for all AI providers
- `lib/ai/providers/gemini.ts` - Google Gemini implementation
- `lib/ai/factory.ts` - Factory to instantiate providers based on env config
- Models are configured via environment variables for easy switching
- Supports fallback models when quotas are exceeded

### Story Generation Flow
1. User uploads photo → `/app/create/page.tsx`
2. Photo analyzed by AI → `/api/photos/analyze`
3. Topic suggestions shown → `components/story/TopicCard.tsx`
4. Story generated (6 pages) → `/api/stories/generate`
5. Audio narration created → `/api/audio/generate`
6. Story displayed → `/app/story/[id]/page.tsx`

### Database Schema (Prisma)
- **Stories**: Main table storing story data, pages, audio URLs
- **Children**: Child profiles (age affects story complexity)
- **Users**: Parent accounts (added later in Phase 6)
- Uses SQLite locally, Vercel Postgres in production

### UI Component Structure
- `components/ui/*` - shadcn/ui base components
- `components/story/*` - Story-specific components
- `components/layout/*` - Layout components (header, nav)
- Uses Tailwind CSS with custom purple night theme

### Key Design Patterns
1. **Server Components by default** - Use client components only when needed
2. **API Routes** - All AI/database operations in `/app/api/*`
3. **Type Safety** - TypeScript types in `/types/*`
4. **Error Boundaries** - Graceful error handling throughout
5. **Progressive Enhancement** - Works without JS, enhanced with it

## Important Considerations

### Performance
- Images optimized with Next.js Image component
- Lazy loading for story pages
- API responses cached where appropriate
- PWA for offline story viewing

### Security
- Environment variables for all secrets
- Input validation with Zod
- Content filtering for child safety
- COPPA compliance implementation

### AI Model Usage
- Free tier: Gemini 2.0 Flash (1,500 requests/day)
- Premium: Gemini 2.5 Pro (better quality)
- Automatic fallback to available models
- Track usage to avoid quota limits
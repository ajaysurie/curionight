# CurioNight

Transform children's photos into personalized bedtime science stories with hands-on experiments.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables:
```bash
cp .env.example .env.local
```

3. Set up the database:
```bash
npm run db:push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **AI**: Configurable AI provider system (Gemini, OpenAI, Anthropic)
- **Audio**: ElevenLabs for narration
- **Database**: SQLite (local) / Vercel Postgres (production)
- **Storage**: Vercel Blob Storage

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:push` - Update database schema
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utility functions and providers
│   ├── ai/          # AI provider implementations
│   ├── db/          # Database utilities
│   └── utils/       # Helper functions
├── types/           # TypeScript type definitions
└── hooks/           # Custom React hooks
```

## Environment Variables

Create a `.env.local` file with:

```env
# AI Configuration
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash-exp
GOOGLE_GEMINI_API_KEY=your-api-key

# Audio Generation
ELEVENLABS_API_KEY=your-api-key

# Database
DATABASE_URL="file:./dev.db"
```
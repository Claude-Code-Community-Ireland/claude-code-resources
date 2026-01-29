# Claude Development Guide

This is a monorepo containing a Next.js application with Supabase, Prisma, and Sanity blog integration, managed with pnpm workspaces.

## Project Structure

```
├── packages/
│   ├── web/                    # Next.js app
│   │   ├── app/                # App Router (Next.js 15+)
│   │   │   └── blog/           # Blog routes (/blog, /blog/[slug], etc.)
│   │   ├── lib/
│   │   │   ├── supabase/       # Supabase client configurations
│   │   │   ├── sanity/         # Sanity client and configurations
│   │   │   ├── prisma.ts       # Prisma client singleton
│   │   │   └── generated/prisma/ # Generated Prisma client
│   │   ├── components/
│   │   │   └── blog/           # Blog components
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   └── studio/                 # Sanity Studio for content management
│       ├── schemaTypes/        # Sanity schema definitions
│       └── sanity.config.ts    # Studio configuration
├── package.json               # Root package.json with workspace scripts
├── pnpm-workspace.yaml       # Workspace configuration
└── .gitignore                # Git ignore rules
```

## Development Commands

### Start Development Server

```bash
pnpm dev                    # Start web package dev server
pnpm --filter web dev       # Alternative syntax
```

### Build and Deploy

```bash
pnpm build                  # Build web package
pnpm start                  # Start production server
pnpm lint                   # Run linting
```

### Database Operations

```bash
pnpm --filter web exec prisma db pull          # Pull schema from Supabase
pnpm --filter web exec prisma generate         # Generate Prisma client
pnpm --filter web exec prisma migrate dev      # Run migrations
```

### Sanity Studio Commands

```bash
pnpm studio:dev             # Start Sanity Studio development server
pnpm studio:build           # Build Sanity Studio
pnpm studio:deploy          # Deploy Studio to Sanity hosting
```

### Testing Commands

```bash
pnpm test                   # Run all tests
pnpm test:watch            # Run tests in watch mode
pnpm test:ui               # Open Vitest web UI
pnpm test:coverage         # Run tests with coverage
```

## Import Aliasing

**IMPORTANT**: Always use import aliasing (`@/*`) when importing files within the Next.js application. This project is configured with TypeScript path mapping for cleaner imports.

### ✅ Correct Usage:

```typescript
import { MyComponent } from '@/components/MyComponent/MyComponent';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/client';
import { client, urlFor } from '@/lib/sanity';
```

### ❌ Avoid Relative Imports:

```typescript
import { createClient } from '../../../lib/supabase/client';
import { prisma } from '../../lib/prisma';
import { client } from '../../../lib/sanity/client';
import Component from './components/MyComponent';
```

## Component Organization

**CRITICAL CONVENTIONS:**

- **ALWAYS** use folder-based component organization with named exports
- **Component Structure**: Each component should have its own folder with the component file inside
- **Naming**: Use PascalCase for both folder and file names
- **Exports**: Always use named exports, never default exports

### ✅ Correct Component Structure:

```
components/
├── Button/
│   ├── Button.tsx           # Named export: export const Button = () => {...}
│   └── Button.test.tsx      # Colocated test file
├── Modal/
│   ├── Modal.tsx            # Named export: export const Modal = () => {...}
│   └── Modal.test.tsx       # Colocated test file
└── Header/
    ├── Header.tsx           # Named export: export const Header = () => {...}
    └── Header.test.tsx      # Colocated test file
```

### ❌ Avoid Flat Component Files:

```
components/
├── Button.tsx               # DON'T DO THIS
├── Modal.tsx                # Should be in folders instead
└── Header.tsx               # Should be in folders instead
```

### Component Export Pattern:

```typescript
// components/Button/Button.tsx
export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

// Usage in other files
import { Button } from '@/components/Button/Button';
```

## Database Integration

### Supabase Client

- **Browser**: `@/lib/supabase/client` - For client-side operations
- **Server**: `@/lib/supabase/server` - For server-side operations with cookies

### Prisma Client

- Import from: `@/lib/prisma`
- Pre-configured singleton to prevent multiple instances
- Schema auto-generated from Supabase database

### Sanity Client

- **Client**: `@/lib/sanity/client` - For fetching published content
- **Preview Client**: `@/lib/sanity/previewClient` - For draft content preview
- **Image URLs**: `@/lib/sanity/image` - For optimized image URLs
- **Types**: `@/lib/sanity/types` - TypeScript types for blog content

### Example Usage:

```typescript
// API Route example
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/client';
import { client } from '@/lib/sanity';
import { postsQuery } from '@/lib/sanity/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  // Use Supabase for real-time features
  const supabase = createClient();
  const { data } = await supabase.from('users').select('*');

  // Use Prisma for complex queries
  const userCount = await prisma.user.count();

  // Use Sanity for blog content
  const posts = await client.fetch(postsQuery, { start: 0, end: 10 });

  return NextResponse.json({ data, userCount, posts });
}
```

## Environment Variables

Environment variables are configured in:

- `.env.local` - Next.js environment variables
- `.env` - Prisma environment variables

Required variables:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (for Prisma)
- `DIRECT_URL` (for Prisma migrations)

**Sanity:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually "production")
- `SANITY_API_READ_TOKEN` (optional, for preview mode)

## Testing Integration

This project uses **Vitest** for testing with jsdom environment and comprehensive coverage reporting.

### Test File Naming and Organization

**CRITICAL CONVENTIONS:**

- **ALWAYS** use `filename.test.ts` naming convention - NEVER use `__tests__` directories
- **ALWAYS** colocate test files with the source files they test
- Use `@/*` import aliasing in test files

### ✅ Correct Test File Structure:

```
lib/
├── utils.ts
├── utils.test.ts          # Colocated with utils.ts
├── supabase/
│   ├── client.ts
│   └── client.test.ts     # Colocated with client.ts
components/
├── Button/
│   ├── Button.tsx         # Named export component
│   └── Button.test.tsx    # Colocated test file
```

### ❌ Avoid **tests** Directories:

```
lib/
├── utils.ts
└── __tests__/             # DON'T DO THIS
    └── utils.test.ts      # Should be colocated instead
```

### Test Environment

- **Framework**: Vitest with jsdom environment
- **Coverage**: Configured for text, JSON, and HTML reports
- **Global**: `describe`, `it`, `expect`, `vi` available globally
- **Aliases**: `@/*` paths work in tests

Test API endpoint available at: `/api/test-prisma`

- Verifies Supabase connection
- Verifies Prisma connection
- Returns connection status

## Blog Features

The integrated Sanity blog provides:

- **Blog Routes**: `/blog` (listing), `/blog/[slug]` (posts), `/blog/category/[slug]`, `/blog/author/[slug]`
- **Content Types**: Posts, Authors, Categories with rich relationships
- **Featured Posts**: Highlight important content on the blog homepage
- **SEO Optimized**: Meta titles, descriptions, Open Graph, Twitter Cards
- **Image Optimization**: Automatic image optimization through Sanity CDN
- **Responsive Design**: Mobile-first responsive components
- **ISR Support**: Incremental Static Regeneration for performance
- **TypeScript**: Fully typed content models and API responses

### Blog Content Management

- **Sanity Studio**: Available at `/studio` when running `pnpm studio:dev`
- **Rich Text Editor**: Portable Text with custom blocks and marks
- **Media Management**: Image uploads with alt text and captions
- **Preview Mode**: Draft content preview (requires read token)
- **Publishing**: Scheduled publishing with published dates

## Key Features

- **Monorepo**: pnpm workspaces for efficient dependency management
- **Next.js 15**: Latest with App Router and Turbopack
- **Supabase**: Real-time database and authentication
- **Prisma**: Type-safe database client with auto-generated types
- **Sanity Blog**: Headless CMS with rich content management
- **TypeScript**: Full type safety across the stack
- **Import Aliasing**: Clean imports with `@/*` paths

## Notes for Claude

1. Always use `@/` import aliasing - never relative imports
2. Use pnpm workspace commands: `pnpm --filter web <command>` or `pnpm --filter studio <command>`
3. Prisma client is a singleton - import from `@/lib/prisma`
4. Sanity client is configured - import from `@/lib/sanity`
5. Environment variables are split between `.env.local` and `.env`
6. Database schema is pulled from Supabase, not manually created
7. Blog content is managed through Sanity Studio at `/studio`
8. Test connectivity with `/api/test-prisma` endpoint
9. **CRITICAL**: Use `filename.test.ts` naming - NEVER `__tests__/` directories
10. **CRITICAL**: Always colocate test files with source files they test
11. **CRITICAL**: Use folder-based component organization (`/MyComponent/MyComponent.tsx`) with named exports
12. **CRITICAL**: Always use named exports for components, never default exports
13. **BLOG**: Blog routes are at `/blog/*` - posts, categories, and authors
14. **BLOG**: Use GROQ queries from `@/lib/sanity/queries` for data fetching

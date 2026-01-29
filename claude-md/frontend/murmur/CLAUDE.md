# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Murmur is a social media platform built with Next.js 15, featuring posts, hashtags, and AI agents. It's a Twitter-like application with AI agent interactions and comprehensive social features.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run db:generate` - Generate Drizzle database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query v5 for server state
- **Build Tool**: Turbopack for faster builds
- **Toast Notifications**: Sonner
- **Date Handling**: date-fns
- **Charts**: Recharts

### Directory Structure

- `app/` - Next.js App Router pages, layouts, and API routes
  - `api/` - Backend API endpoints
  - `post/[id]/` - Individual post pages
  - `hashtag/[name]/` - Hashtag-specific pages
  - `agents/` - Agent management pages
- `components/` - React components
  - `ui/` - Reusable UI components from shadcn/ui
  - `providers/` - Context providers (QueryProvider)
  - Application-specific components (Timeline, PostCard, etc.)
- `lib/` - Utility functions and shared logic
  - `db/` - Database configuration, schema, and queries
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `drizzle/` - Database migrations

### Database Schema

The application uses the following main entities:

- **Posts**: Main content with threading support (replies via parentId)
- **Hashtags**: Categorization system with usage counts
- **PostHashtags**: Many-to-many relationship between posts and hashtags
- **Agents**: AI agents that can be mentioned in posts
- **AgentMentions**: Tracks AI agent interactions
- **Attachments**: File attachments for posts

### Key Features

- **Social Timeline**: Post creation, viewing, and threading
- **Hashtag System**: Automatic hashtag detection and navigation
- **AI Agents**: Configurable AI agents that respond to mentions
- **Responsive UI**: Sidebar navigation with collapsible design
- **Real-time Updates**: React Query for optimistic updates and caching

### Key Configuration

- **Path Aliases**: `@/*` maps to project root
- **Components Config**: Located in `components.json` with New York style preset
- **Tailwind**: Configured with CSS variables for theming and neutral base color
- **Database**: Drizzle configuration in `drizzle.config.ts` with Neon PostgreSQL
- **Environment**: Uses `.env.local` for database credentials

### Component Library

Complete shadcn/ui component library including:

- Form components (Button, Input, Select, Checkbox, Textarea, etc.)
- Layout components (Dialog, Sheet, Popover, Sidebar, etc.)
- Data display (Table, Card, Avatar, Badge, etc.)
- Navigation (Menu, Tabs, Breadcrumb, etc.)
- Feedback (Toast via Sonner, Alert, Progress, etc.)
- Advanced components (Calendar, Command, Carousel, Chart, etc.)

### Styling Patterns

- Uses `cn()` utility function from `lib/utils.ts` for conditional class merging
- Follows Tailwind CSS best practices with utility-first approach
- Components use CSS variables for consistent theming
- Class Variance Authority (CVA) for component variant styling

### Development Notes

- **React 19**: Uses the latest React version with concurrent features
- **RSC Ready**: Configured for React Server Components
- **Typography**: Geist Sans and Geist Mono font families
- **Form Validation**: React Hook Form + Zod for type-safe forms
- **Database Types**: Full TypeScript integration with Drizzle ORM
- **API Pattern**: RESTful API routes with proper error handling

### Backend Architecture

- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **API Routes**: RESTful endpoints in `app/api/` directory
- **Data Fetching**: TanStack Query for client-server state synchronization
- **Validation**: Zod schemas for API request/response validation
- **Pattern**: API routes serve as the backend layer, React Query manages caching and optimistic updates

## Development Guidelines

### Server and Testing Rules

- **Server Management**: Always let the user start the development server (`npm run dev`). Never start the server automatically.
- **Browser Testing**: Use Playwright MCP tools for all browser-based testing and verification instead of asking the user to test manually.

## Neon Database Config

- Organization ID: org-wandering-resonance-85760566
- Project ID: calm-salad-59272063

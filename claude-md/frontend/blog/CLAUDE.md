# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `yarn dev` or `npm run dev`
- **Build for production**: `yarn build` or `npm run build` 
- **Start production server**: `yarn serve` or `npm run serve`
- **Lint code**: `yarn lint` or `npm run lint` (fixes issues automatically)
- **Bundle analysis**: `yarn analyze` or `npm run analyze`
- **Format code**: Prettier auto-formats on commit via husky pre-commit hooks

## Architecture Overview

This is a Next.js 15 blog built with the Tailwind Next.js Starter Blog template. Key architectural components:

### Content Management
- **Contentlayer2**: Transforms MDX files in `data/blog/` into type-safe content objects
- **MDX**: All blog posts are written in MDX format with frontmatter
- **Content Types**: Blog posts (`data/blog/`) and Authors (`data/authors/`)

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework for styling
- **Dark/Light Theme**: Automatic theme switching with next-themes
- **Space Grotesk Font**: Primary font loaded via next/font/google

### Core Directories
- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable React components
- `layouts/`: Template layouts for different content types (PostLayout, PostSimple, PostBanner, ListLayout, ListLayoutWithTags)
- `data/`: Content files (blog posts, authors, site metadata)
- `public/static/`: Static assets (images, favicons, documents)

### Key Features
- **Search**: KBar command palette search (can be switched to Algolia)
- **Comments**: Giscus-powered commenting system
- **Analytics**: Google Analytics + Vercel Analytics
- **Newsletter**: Buttondown integration for email subscriptions
- **RSS Feed**: Auto-generated at `/feed.xml`
- **Sitemap**: Auto-generated for SEO

### Configuration Files
- `contentlayer.config.ts`: Content processing and MDX plugin configuration
- `data/siteMetadata.js`: Site-wide configuration (title, social links, analytics, etc.)
- `next.config.js`: Next.js configuration with security headers and CSP
- `tailwind.config.js`: Tailwind CSS customization

### Build Process
- Content is processed by Contentlayer during build
- Tag counts are automatically generated and saved to `app/tag-data.json`
- Search index is generated for KBar search functionality
- RSS feeds are generated for the main blog and individual tags via `scripts/postbuild.mjs`
- Post-build script runs automatically after `next build` to generate RSS feeds

### Testing
This project does not have a formal test suite. Manual testing is done through the development server.

### Deployment
- Configured for Vercel deployment (standalone output mode)
- Docker support available via included Dockerfile
- Static export possible with `EXPORT=1 UNOPTIMIZED=1 yarn build`

### Code Quality & Git Hooks
- **Husky**: Git hooks configured for pre-commit formatting
- **lint-staged**: Runs ESLint on staged JS/TS files and Prettier on all staged files
- **ESLint**: Configured with Next.js, TypeScript, and Prettier rules
- **Prettier**: Code formatting with Tailwind CSS plugin

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
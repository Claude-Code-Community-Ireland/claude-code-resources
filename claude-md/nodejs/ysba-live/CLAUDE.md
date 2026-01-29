# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start development server with nodemon (uses server-optimized.js)
npm start          # Start production server (uses server-optimized.js)
npm run dev-worker # Start worker in development mode with nodemon
npm run build      # Update cache version for CSS/JS files
```

### Background Worker
```bash
npm run start-worker  # Start background scraper worker
npm run test-worker   # Test worker locally (same as start-worker)
```

### Testing & Debugging
```bash
# Test API endpoints
curl "http://localhost:3000/api/status"
curl "http://localhost:3000/api/divisions?filterEmpty=true"
curl "http://localhost:3000/api/standings?division=9U-select&tier=all-tiers"

# Enable debug mode in browser console
localStorage.setItem('debugMode', 'true')
```

## Architecture Overview

This is a Node.js web application that displays real-time baseball standings for York Simcoe Baseball Association (YSBA). The application uses Express for the server, vanilla JavaScript for the frontend, and relies entirely on pre-generated JSON files from GitHub Actions for data (no in-app scraping).

### Background Worker System

The application now includes a background worker system (`src/scraper/`) that:
- Runs independently as a background service via GitHub Actions every 30 minutes
- Scrapes all YSBA divisions and detects changes
- Generates structured JSON files (`data/ysba.json`, `public/ysba.json`)
- Sends email notifications when significant standings changes occur
- Generates new homepage stories when story-worthy events happen (first wins, hot streaks, undefeated runs, etc.)
- Provides clean API data that the frontend can consume quickly

### Key Components

**`server-optimized.js`** - Main Express server handling all routes, API endpoints (serves cached JSON files only, no scraping)

**`scripts/github-action-scraper.js`** - GitHub Actions worker that orchestrates scraping, change detection, emails, and story generation

**`src/scraper/scraper.js`** - Modular Puppeteer-based scraping engine (extracted from original scraper.js)

**`src/scraper/formatter.js`** - Data formatting and structuring for clean JSON output

**`src/scraper/writer.js`** - File writing operations for JSON output to data/ and public/ directories

**`config.js`** - Multi-division configuration defining all divisions, tiers, and their settings

**`public/js/app.js`** - Frontend application logic handling standings display, team schedules, and user interactions

**`email-service.js`** - SendGrid-powered email notification system with GitHub Gist backup for subscriber data

**`ai-story-service.js`** - OpenAI-powered story generation system for homepage news content

### Multi-Division System

The application supports multiple divisions with dynamic routing:
- **Rep Divisions**: 8U through 22U and Senior (with A/AA/AAA tiers)
- **Select Divisions**: 9U, 11U, 13U, 15U (all teams)
- **URL structure**: `/{division}/{tier}` (e.g., `/13U-rep/A` or `/9U-select/all-tiers`)

Division configuration is centralized in `config.js` using `getDivisionConfig(division, tier)`.

### Caching Strategy

Three-level caching system with 30-minute duration:
1. **Division cache**: `cachedDataByDivision[division-tier]` - Main standings data
2. **Team schedule cache**: `teamScheduleCache[teamCode-division-tier]` - Individual team schedules  
3. **Comprehensive schedule cache**: `allGamesCache[schedule-division-tier]` - All games for background loading

### Browser Session Management

Scraping operations use `withBrowserSession()` to coordinate Puppeteer instances and prevent conflicts. Only one browser session runs at a time.

### Email Notification System

- **Primary storage**: GitHub Gist (unlimited capacity, automatic backup)
- **Fallback**: Environment variables (4KB limit)
- **Change detection**: Compares standings between scraping cycles
- **Token-based unsubscribe**: Secure subscriber management

### Application vs Background Worker

**Application Server** (`server-optimized.js`):
- Serves cached JSON files only
- No scraping or Puppeteer operations
- Fast API responses from pre-generated data
- Handles email subscriptions and serves pre-generated stories

**Background Worker** (`scripts/github-action-scraper.js`):
- Runs independently via GitHub Actions every 30 minutes
- Performs all Puppeteer scraping operations
- Detects significant changes in standings
- Sends email notifications for standings changes
- Generates new stories when story-worthy events occur (first wins, hot streaks, etc.)
- Generates JSON files that the application serves

## Key API Endpoints

- `GET /api/standings?division=X&tier=Y` - Get standings data
- `GET /api/divisions?filterEmpty=true` - Get available divisions
- `GET /api/team/:teamCode/schedule?division=X&tier=Y` - Get team schedule
- `GET /api/stories` - Get pre-generated homepage stories
- `GET /api/status` - Application health check
- `POST /api/subscribe` - Email subscription
- `POST /api/unsubscribe-token` - Token-based unsubscribe
- `POST /api/stories/generate` - Manually trigger story generation (testing only)

## Common Development Tasks

### Adding New Division
1. Update `config.js` - add division to appropriate section (rep/select)
2. Test with `/?division=NEW-DIVISION&tier=TIER`
3. Verify scraping works via `/api/standings` endpoint

### Modifying Scraping Logic
1. Update `src/scraper/scraper.js` - modify Puppeteer selectors/logic
2. Test locally with `npm run test-worker` or `npm run test-scraper`
3. Deploy changes to trigger GitHub Actions scraping

### Frontend Changes
1. Main logic in `public/js/app.js`
2. Styles in `public/css/styles.css`
3. Use `npm run build` to update cache version for deployment

### Email System Changes
1. Modify `email-service.js` for email logic
2. Use `/api/subscribers/export` for testing subscriber data
3. GitHub Gist backup happens automatically on deployment
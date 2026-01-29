# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Croatian events platform ("Kružna Karta Hrvatska") built as a monorepo with:
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite (located in `frontend-new/`)
- **Backend**: FastAPI + Python + PostgreSQL with advanced geocoding and scraping capabilities
- **Infrastructure**: Docker with comprehensive development tooling

The platform aggregates events from 14+ Croatian websites through intelligent web scraping, provides real-time geocoding for venues, and features an advanced map system with clustering capabilities powered by Mapbox GL JS.

## Key Architecture

### Monorepo Structure
- `frontend-new/` - React 19 TypeScript application with advanced mapping
- `backend/` - FastAPI Python application with geocoding and scraping services
- `docker/` - Docker configurations and infrastructure
- Root-level `Makefile` with 40+ development commands

### Technology Stack
- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS 3.4, Vite 7, Mapbox GL JS 3.13, TanStack Query 5
- **Backend**: FastAPI, SQLAlchemy 2.0, Alembic, Celery, Redis, Playwright, Pydantic 2.4+
- **Database**: PostgreSQL with Redis for caching/sessions, advanced geocoding tables
- **Deployment**: Docker Compose, Nginx reverse proxy, uv package management

### Advanced Features
- **Map System**: Mapbox GL JS with intelligent clustering, real-time filtering, and performance optimization
- **Geocoding Service**: Real-time venue geocoding with Croatian geographic database and fallback systems
- **Scraping System**: 14+ specialized scrapers (Entrio, InfoZagreb, Visit sites, etc.) with enhanced error handling
- **Type-Safe Configuration**: Pydantic-based configuration management with environment variable expansion
- **Performance Optimization**: Throttled map updates, marker batching, clustering transitions

## Development Commands

The project uses a comprehensive Makefile with 40+ commands. Key commands:

### Quick Start
```bash
make setup           # Initial project setup
make dev            # Start full development environment
make frontend-dev   # Frontend only
make backend-dev    # Backend only
```

### Daily Development
```bash
make logs           # View all logs
make frontend-logs  # Frontend logs only
make backend-logs   # Backend logs only
make db-shell      # PostgreSQL shell access
make redis-shell   # Redis CLI access
```

### Code Quality
```bash
make lint          # Run all linters
make test          # Run all tests
make frontend-test # Frontend tests only
make backend-test  # Backend tests with coverage
```

### Database Management
```bash
make migrate       # Run database migrations
make migration     # Create new migration
make db-reset     # Reset database with sample data
```

## Key Business Logic

### Enhanced Scraping System
**Multi-Source Event Scraping**:
- **Base Architecture**: Abstract base scraper with common functionality for retry logic, date parsing, and text cleaning
- **BrightData Integration**: Proxy support with scraping browser for JavaScript-heavy sites
- **Playwright Support**: Dynamic content scraping for Vue.js/React applications
- **Specialized Scrapers**: 14+ Croatian event sources including Croatia.hr, Entrio, Info Zagreb, city tourism sites
- **Data Transformation**: Croatian date/time parsing, location extraction, and event normalization
- **Deduplication**: Hash-based duplicate detection and event merging

**Supported Event Sources**:
- `croatia_scraper.py` - Croatia.hr official tourism events (Vue.js-based)
- `entrio_scraper.py` - Entrio ticketing platform
- `infozagreb_scraper.py` - Zagreb city events
- City tourism sites: Split, Rijeka, Dubrovnik, Karlovac, Opatija, Varaždin, Vukovar, Zadar
- `ulaznice_scraper.py` - Ulaznice.hr ticketing platform

### Advanced Geocoding and Location Services
**Real-time Geocoding Service**:
- **Multi-Provider Strategy**: Mapbox API primary, Nominatim (OpenStreetMap) fallback
- **Croatian Geographic Database**: Built-in database of 70+ Croatian cities, regions, and landmarks with coordinates
- **Venue Coordinate Caching**: Database caching of geocoded venues with 30-day refresh cycle
- **Fallback Strategies**: Croatian city center fallback, Zagreb coordinates as ultimate fallback
- **Address Enhancement**: Croatian address pattern recognition and street-level geocoding
- **Batch Processing**: Concurrent geocoding with rate limiting and retry logic

**Croatian Geographic Coverage**:
- Major cities: Zagreb, Split, Rijeka, Osijek, Zadar, Pula, Dubrovnik
- Tourist destinations: Hvar, Korčula, Krk, Rovinj, Opatija, Makarska
- Regional centers and counties with population-based confidence scoring
- Fuzzy matching for Croatian diacritics (č, ć, š, ž, đ)

### Configuration System
**Type-Safe Configuration Management**:
- **Pydantic Settings**: Full type validation with automatic environment variable binding
- **YAML Configuration**: `backend/config.yaml` with environment variable expansion (`${VAR:default}`)
- **Component-Based Structure**: Database, Redis, API, Auth, Scraping, Services, Monitoring configs
- **Security**: Automatic secure key generation, insecure value detection, minimum security requirements
- **Development**: Mock external APIs, debug options, database seeding flags

**Configuration Components**:
```python
# Access via centralized CONFIG object
from app.config.components import get_settings
CONFIG = get_settings()

# Type-safe access to all settings
database_url = CONFIG.database.url
scraping_config = CONFIG.scraping
geocoding_provider = CONFIG.services.geocoding.provider
```

### Event Management
- Events stored with venue, pricing, and scheduling data
- Booking system with seat selection where applicable
- Integration with payment processors
- Platform commission of 5% applied to all bookings

### Multi-language Support
- Croatian (hr) as primary language and English (en) as secondary
- Translation files in `frontend-new/src/locales/`
- Backend API serves localized content

### Database Schema Updates
**Enhanced Event Schema**:
- Geographic coordinates (`latitude`, `longitude`) with decimal precision
- Enhanced location tracking (`location`, `venue_id` relationships)
- Scraping metadata (`source`, `external_id`, `scrape_hash`, `last_scraped_at`)
- Event categorization and tagging systems
- Booking system integration with commission tracking

**New Tables**:
- `venue_coordinates` - Geocoding cache with confidence scoring and multiple data sources
- Additional analytics, booking, and social feature tables from migration system

**Geographic Extensions**:
- PostGIS/Earthdistance for geographic queries and distance calculations
- Spatial indexing for location-based event searches
- Croatian coordinate validation and bounds checking

## Development Guidelines

### Frontend Patterns (frontend-new/)
- React 19 with strict TypeScript and ESLint configuration
- Components in `src/components/` with feature-based organization
- Custom hooks for map interactions (`useEventClustering`, `useThrottledMapUpdates`)
- TanStack Query for API state management with intelligent caching
- Mapbox-specific utilities in `src/utils/` for clustering and geo calculations
- Tailwind CSS with CVA (Class Variance Authority) for component variants

### Frontend Performance Optimization
- **Throttled Map Updates**: Dual-state system with immediate updates (60fps) for smooth animations and debounced updates (250ms) for expensive operations
- **Event Clustering**: Real-time clustering algorithm with zoom-aware thresholds and distance-based grouping
- **Batched Marker Positioning**: RAF-throttled batch calculations for marker positions to prevent layout thrashing
- **Performance Monitoring**: Development-mode performance metrics tracking with timing analysis
- **Hardware Acceleration**: CSS transforms with `translateZ(0)` and `will-change` optimizations
- **Memory Management**: Efficient cleanup and resource management for map instances and event listeners

### Advanced Map System
- **Mapbox GL JS Integration**: Modern vector tile rendering with custom styling
- **Dynamic Clustering**: Zoom-aware event clustering with micro-positioning to prevent overlaps
- **Interactive Markers**: Custom cluster markers with hover states and click interactions
- **Smart Popups**: Context-aware popups for single events vs. event clusters
- **Bounds Management**: Automatic fitting and bounds calculation for optimal viewing
- **Real-time Updates**: Throttled map state management for smooth pan/zoom operations
- **Responsive Design**: Adaptive clustering thresholds and marker sizing based on zoom level

### Backend Patterns
- FastAPI with Pydantic 2.4+ for type-safe validation and configuration
- Configuration management through `app/config/components.py` with environment expansion
- SQLAlchemy 2.0 ORM with advanced geocoding tables and spatial queries
- 14+ specialized scrapers in `app/scraping/` with base scraper inheritance
- Real-time geocoding service with Croatian geographic database fallback
- Celery for background tasks with comprehensive error handling and monitoring

### Environment Setup
- Frontend env: `frontend-new/.env` (Mapbox tokens, API endpoints)
- Backend env: `backend/.env` (database, Redis, geocoding services, scraper config)
- Docker env: `docker/.env` (ports, volumes, service configuration)
- Configuration via YAML with Pydantic validation and type safety

### Advanced Development Features
- uv package management for Python dependencies with lock file
- Comprehensive Makefile with 40+ commands for development workflows
- Type-safe configuration system with environment variable expansion
- Real-time geocoding with intelligent caching and Croatian location database
- Advanced map clustering with performance optimization and smooth transitions

### Testing
- Frontend: Vitest + React Testing Library
- Backend: pytest with fixtures and database isolation
- Run `make test` for full test suite

### Database Migrations
- Use `make migration name="description"` to create migrations
- Always review generated migrations before applying
- Use `make migrate` to apply pending migrations

## Common Tasks

### Adding New Event Source
1. Create scraper in `backend/app/scraping/scrapers/`
2. Add URL patterns to scraper registry
3. Test with `make scrape-test`
4. Update documentation

### API Development
- Add routes in `backend/app/api/routes/`
- Use dependency injection for database access
- Add Pydantic schemas in `backend/app/schemas/`
- Follow existing patterns for error handling

**Enhanced Event API**:
- `GET /events` - Advanced filtering by location, date range, coordinates, radius
- `GET /events/search` - Full-text search with geographic constraints
- `GET /events/{id}` - Event details with venue coordinates and directions
- Geographic search parameters: `latitude`, `longitude`, `radius_km`

**Venue Management API**:
- `GET /venues` - Venue listing with coordinate data
- `GET /venues/search` - Geographic venue search
- Automatic geocoding integration for new venues

**Scraping Management**:
- Background task scheduling for event scraping
- Real-time scraping status and statistics
- Manual scraping trigger endpoints for development

### Frontend Map Components
- Create map components in `frontend-new/src/components/map/`
- Use `EventMap` component for full-featured map display with clustering
- Implement custom hooks for performance-critical map operations
- Follow clustering patterns for geo-spatial data visualization
- Use Mapbox GL JS patterns for custom marker and popup implementations

### Backend Development Patterns
**Enhanced Patterns**:
- **Centralized Configuration**: All settings via `CONFIG` object from `app.config.components`
- **Geographic Data Handling**: Coordinate validation, Croatian bounds checking, fallback strategies
- **Async Geocoding**: Batch geocoding with concurrent processing and rate limiting
- **Scraping Architecture**: Abstract base classes with site-specific implementations
- **Error Handling**: Comprehensive logging with structured error context
- **Type Safety**: Full Pydantic model validation for all data transformations

**File Organization**:
```
backend/app/
├── config/components.py      # Centralized configuration
├── core/geocoding_service.py # Geocoding and location services
├── core/croatian_geo_db.py   # Croatian geographic database
├── scraping/base_scraper.py  # Base scraper architecture
├── scraping/*_scraper.py     # 14+ specialized scrapers
├── models/schemas.py         # Enhanced Pydantic schemas
└── migrations/versions/      # Database schema evolution
```

## Infrastructure

### Local Development
- All services orchestrated via comprehensive Makefile commands
- Frontend dev server with HMR and Mapbox integration
- Backend with uv package management and real-time geocoding
- PostgreSQL with advanced geocoding tables and spatial extensions
- Redis for caching, sessions, and geocoding results

### Advanced Services
- **Geocoding Service**: Real-time venue coordinate resolution with Croatian geographic database
- **Scraping System**: 14+ specialized scrapers with intelligent error handling and performance monitoring
- **Map Clustering**: Dynamic event clustering with performance optimization and smooth transitions
- **Configuration Management**: Type-safe Pydantic configuration with environment variable expansion

### Production Deployment
- Docker Compose with optimized production configurations
- Nginx reverse proxy with static file serving and SSL termination
- Advanced database with geocoding tables and spatial queries
- Comprehensive monitoring and error handling across all services

## Troubleshooting

### Common Issues
- **Port conflicts**: Check `docker/.env` and root `package.json` for port assignments
- **Database connection**: Ensure PostgreSQL container with geocoding extensions is running
- **Migration failures**: Check Alembic migrations and geocoding table schemas
- **Scraping issues**: Verify Playwright browser installation and Croatian scraper configurations
- **Map rendering**: Ensure Mapbox access token is configured in `frontend-new/.env`
- **Geocoding failures**: Check geocoding service configuration and Croatian location database

### Enhanced Debug Commands
```bash
make help           # Show all 40+ available commands
make dev            # Start full development environment
make frontend-dev   # Frontend only with Mapbox (runs on port 3001)
make backend-dev    # Backend with geocoding services
make logs           # All service logs
make db-shell       # PostgreSQL with geocoding tables
make lint           # Frontend + backend linting
make test           # Comprehensive test suite
```

### Performance Optimization
- **Map Performance**: Use throttled updates and clustering for large event datasets
- **Geocoding**: Leverage caching and Croatian location database for faster lookups
- **Scraping**: Monitor scraper performance and adjust throttling as needed
- **Database**: Utilize spatial indexes and optimized geocoding queries


# Rules for Backend Development

- **MUST** use appropriate AI libraries and avoid deprecated dependencies
- **MUST** put all the imports at the top of the file, and group them by standard library, third-party libraries, and local imports
- **MUST** include static code analysis using tools like pylint, flake8, or mypy
- **MUST** implement robust error handling, input validation, and fallback mechanisms for failures
- **MUST** implement proper data validation and preprocessing pipelines
- **MUST** choose efficient data structures (e.g. pandas DataFrames for tabular data, NumPy/PyTorch tensors for numerical data) to optimize AI workload performance and memory use.
- **MUST** follow PEP 8 style guidelines strictly
- **MUST** use type hints for all function parameters and return values
- **MUST** implement proper docstrings using Google or NumPy style
- **MUST** keep functions small and focused (single responsibility principle)
- **MUST** implement proper logging with appropriate log levels
- **MUST** implement efficient data loading and preprocessing
- **MUST** implement proper memory management for large datasets
- **MUST** avoid unnecessary computational overhead
- **MUST** profile AI code performance and identify bottlenecks

- **MUST** use **Pydantic** for data validation and serialization, which provides type safety, automatic validation, and easy serialization to JSON.
- **MUST** use **Pydantic Settings** which provide type-safe configuration management with automatic validation. Benefits: Type safety with automatic validation, Environment variable support with prefixes, Default values and required fields.
- **MUST** use **Pydantic BaseModel** for data validation and serialization, which provides type safety, automatic validation, and easy serialization to JSON.
- **MUST** use **Pydantic Field** for defining fields with validation rules, which provides type safety, automatic validation, and easy serialization to JSON.
- **MUST** use **Pydantic Config** for configuring Pydantic models, which provides type safety, automatic validation, and easy serialization to JSON.
- **MUST** use **Pydantic BaseSettings** for managing application settings, which provides type-safe configuration management with automatic validation.
- MUST use Pydantic for data validation and configuration (e.g. BaseModel for schemas, Field for validation, BaseSettings for config). Pydantic ensures type safety, automatic validation, environment variable support, and easy JSON serialization.

- **SHOULD** retrieve every configuration value exclusively through the CONFIG object defined in **components.py** to ensure type-safe, centralized access and avoid direct environment or file lookups.
- **SHOULD** implement proper **GPU memory management** for deep learning models
- **SHOULD** use meaningful **variable** and **function names**
- **SHOULD** use appropriate **optimization techniques** for AI workloads
- **SHOULD** provide **meaningful error messages** for debugging
- **SHOULD** log errors with sufficient context for troubleshooting
- **SHOULD** implement proper model **serialization** and **deserialization**
- **SHOULD** create **reproducible development environments** using Docker
- **SHOULD** implement proper model **monitoring** and **logging** when explicitly needed
- **SHOULD** consider **parallel processing** and **distributed computing** when appropriate

- **SUGGEST** proper **caching** **mechanisms** for **expensive** operations

- **FOLLOW** the RESTAPI code structuring examples

- **DO NOT** use DEAFULT calls like: legal_bert_config = **CONFIG.get**("models", {}).get("legal_bert", {})
- **DO NOT** use **load_dotenv**, loading env file inside of the project, we always get the env file from the config file
- **DO NOT** use **emojis** in any part of the code
- **DO NOT** use **print** statements in the code, we use **logging** instead
- **DO NOT** put any code inside of the **__init__.py** file, unless there is a specific reason to do so
- **DO NOT** use **global** variables, we use **class variables**
- **DO NOT** use **magic methods** like `__call__`, `__getattr__`, `__setattr__`, etc. unless there is a specific reason to do so
- **DO NOT** use **format** in the code, we use **f-strings** method instead
- **DO NOT** use relative imports in the code, we use absolute imports instead
- **DO NOT** import os, unless there is a specific reason to do so
- **DO NOT** "git add" or "git commit", just propose the commit message after a big update
- **DO NOT** hardcode credentials, API keys, passwords, or sensitive information in any code
- **DO NOT** create code that compiles but contains subtle logical errors
- **DO NOT** generate functions that handle most cases but fail on edge cases
- **DO NOT** produce code with off-by-one errors or boundary condition mistakes
- **DO NOT** create algorithms that work for simple inputs but fail for complex ones
- **DO NOT** generate code that lacks proper error checking or validation for edge cases.
- **DO NOT** create functions that miss essential validation steps
- **DO NOT** generate code based on assumptions about unclear specifications
- **DO NOT** create conditional logic that misaligns with stated requirements
- **DO NOT** implement features that contradict the intended business logic
- **DO NOT** generate code that solves a different problem than what was asked
- **DO NOT** suggest inappropriate data structures for the given use case
- **DO NOT** generate regex patterns that match different strings than intended
- **DO NOT** create sorting or searching algorithms with incorrect complexity
- **DO NOT** use synchronous operations where asynchronous ones are required
- **DO NOT** continue generating "fixes" after 3 failed attempts without changing approach
- **DO NOT** keep apologizing and making similar mistakes repeatedly
- **DO NOT** generate increasingly complex solutions when simple ones would work
- **DO NOT** create functions that are impossible to unit test
- **DO NOT** generate code that requires specific system states to function
- **DO NOT** create tightly coupled code that cannot be tested in isolation
- **DO NOT** create complex algorithms without explaining the approach
- **DO NOT** generate code with magic numbers or unexplained constants
- **DO NOT** create functions with unclear parameter requirements
- **DO NOT** generate code that future developers cannot understand or modify
- **DO NOT** create functions that violate the single responsibility principle
- **DO NOT** generate code with poor variable naming conventions
- **DO NOT** create tight coupling between unrelated components
- **DO NOT** present generated code as definitively correct without caveats
- **DO NOT** ignore potential edge cases or limitations in the solution
- **DO NOT** generate code without acknowledging areas of uncertainty
- **DO NOT** claim the code is production-ready without proper testing
- **DO NOT** generate code with unnecessary deeply nested conditions, loops or inefficient algorithms
- **DO NOT** create memory leaks or resource management issues
- **DO NOT** generate code that blocks threads unnecessarily
- **DO NOT** create database queries that could cause performance problems at scale
- **DO NOT** create code that uses excessive memory for simple operations
- **DO NOT** generate solutions that require unnecessary external dependencies
- **DO NOT** create code that makes redundant network calls or file operations
- **DO NOT** generate **CPU-intensive** operations without considering alternatives
- **DO NOT** generate code that **assumes** specific **libraries** without mentioning them
- **DO NOT** create functions that **depend** on **undefined** variables or imports
- **DO NOT** generate code that **conflicts** with existing codebase patterns
- **DO NOT** ignore **version compatibility issues** with dependencies
- **DO NOT** create **new bugs** while trying to fix existing ones

- **AUDIO ALERT**: Run `afplay /System/Library/Sounds/Glass.aiff` at the end of tasks or when input is needed

---

# FRONTEND RULES — React · Vite · TailwindCSS · TypeScript (v1.0)

> **Scope**  
> These rules govern all web-frontend code in this repository. They apply to React 19+, Vite 7+, TailwindCSS 3.4+, and TypeScript 5.8+.  
> Animations must follow the **GSAP (Tween / Timeline)** guidelines below; when other motion libraries are used, apply comparable constraints.

---

## 1 · MUST

### 1.1 Coding Standards & Style
- **MUST** enable **`"strict": true`** and all `noUnchecked` flags in `tsconfig.json`.
- **MUST** use **ESLint** with `@typescript-eslint` + **Prettier**; run in pre-commit and CI.  
- **MUST** write components as **function components** with **React hooks**; avoid legacy `class` components.
- **MUST** name files and symbols by intent:  
  - Components → `PascalCase.tsx` (`UserCard.tsx`)  
  - Hooks → `useDescriptiveThing.ts`  
  - Utilities → `camelCase.ts`
- **MUST** colocate component, test, and style files under a feature folder (`/features/user/UserCard.tsx`).
- **MUST** export a single default component per file; named exports for non-components.
- **MUST** add **JSDoc/TSDoc** to every public prop, hook parameter, and return value.

### 1.2 State & Data Flow
- **MUST** favour **React context + hooks** for cross-cutting state; prefer **Zustand** or **Redux Toolkit** only for complex, shared state.
- **MUST** treat server data as immutable; normalise and cache via **TanStack Query** v5 with intelligent caching strategies.
- **MUST** handle errors and loading states for every async request.
- **MUST** use custom hooks for performance-critical operations like map updates and clustering.

### 1.3 TailwindCSS
- **MUST** enable `content` paths correctly in `tailwind.config.js` to purge unused styles.
- **MUST** compose utility classes with **clsx / classnames** or Tailwind `@apply`; avoid long inline class strings in JSX.
- **MUST** extend the design system in `theme.extend` (colors, spacing, typography); **never** modify Tailwind core.

### 1.4 Accessibility
- **MUST** follow **WCAG 2.1 AA**: semantic HTML, keyboard navigation, focus outlines.
- **MUST** respect **`prefers-reduced-motion`** by disabling or simplifying animations.
- **MUST** add `aria-*` attributes and labels to interactive elements.

### 1.5 Animations & Motion
- **MUST** implement complex motion with **GSAP** timelines; wrap GSAP calls inside `useLayoutEffect` or custom hooks.
- **MUST** store animation targets via `useRef`; **never** query DOM with `document.querySelector`.
- **MUST** keep each animation < 200 ms for micro-interactions, < 500 ms for page-level transitions.
- **MUST** batch or debounce scroll/resize-based animations (GSAP `ScrollTrigger` or `requestAnimationFrame`).
- **MUST** pause / kill animations on component unmount (`ctx.revert()` or `gsap.killTweensOf`).

### 1.6 Build & Tooling
- **MUST** use **Vite** with `react`, `tsconfig-paths`, and `tailwindcss` plugins.
- **MUST** split vendor and common chunks via Vite’s `build.rollupOptions` → `manualChunks`.
- **MUST** enable HTTPS and HMR in local dev (`vite --https --open`).

### 1.7 Testing & QA
- **MUST** test UI logic with **React Testing Library** and hooks with **@testing-library/react-hooks**.
- **MUST** reach ≥ 90 % statement coverage on critical features.
- **MUST** run **axe-core** accessibility tests in CI.

---

## 2 · SHOULD

### 2.1 Performance & Optimisation
- **SHOULD** memoise heavy components (`React.memo`, `useMemo`, `useCallback`).
- **SHOULD** lazy-load routes (`React.lazy` + `Suspense`) and large assets (`import.meta.glob` in Vite).
- **SHOULD** enable **`react-refresh`** and **`vite-plugin-inspect`** for dev-time diagnostics.
- **SHOULD** compress SVG/PNG and serve modern formats (WebP/AVIF).

### 2.2 Advanced Motion
- **SHOULD** use **Framer Motion** or **@react-spring/web** for simple UI transitions if GSAP overhead is unjustified.
- **SHOULD** centralise timing and easing in a `motionTokens.ts` file.
- **SHOULD** coordinate page transitions with **React Router** `useNavigationType` + GSAP `context`.

### 2.3 Design & DX
- **SHOULD** abstract repetitive Tailwind patterns into **@/components/ui** primitives (Button, Card).
- **SHOULD** document components in **Storybook** with interactive controls.

### 2.4 Security
- **SHOULD** enable **Content Security Policy (CSP)** headers with `vite-plugin-csp`.
- **SHOULD** sanitise all user-generated HTML (use `dompurify`).

---

## 3 · SUGGEST

- Add **pre-commit** hooks (lint, prettier, test, type-check).
- Provide a **VS Code dev-container** with Node LTS, pnpm, and Cypress pre-installed.
- Integrate **Cypress** for E2E tests and visual regression (Percy, Loki, or Playwright-trace).

---

## 4 · DO NOT

### 4.1 Code Smells
- **DO NOT** store non-serialisable objects in React state.
- **DO NOT** mutate props or context.
- **DO NOT** dispatch Redux actions inside render.

### 4.2 Performance
- **DO NOT** trigger layout-thrashing animations; batch DOM reads/writes.
- **DO NOT** mount heavy GSAP timelines eagerly; lazy-initialise in the viewport.

### 4.3 Style
- **DO NOT** write plain CSS/Sass; use Tailwind utilities or `@apply`.
- **DO NOT** override Tailwind base styles in component files.

### 4.4 Security
- **DO NOT** interpolate raw user input into HTML without sanitising.
- **DO NOT** commit `.env` or secret keys.

### 4.5 Version Control
- **DO NOT** commit compiled `dist/` or `.turbo/` artefacts.
- **DO NOT** auto-run `git add` / `git commit`; output proposed messages only.

---

## 5 · AUDIO ALERT
Play a chime when long‐running front-end build or test tasks finish:  
```bash
afplay /System/Library/Sounds/Glass.aiff
```

---

# External Documentation

Mapbox documentation:
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Style Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
- [Mapbox Vector Tiles](https://docs.mapbox.com/vector-tiles/)
- [Mapbox API Reference](https://docs.mapbox.com/api/)
- [Mapbox Studio](https://docs.mapbox.com/studio/)
- [Mapbox SDKs](https://docs.mapbox.com/sdk/)
- [Mapbox GL JS Examples](https://docs.mapbox.com/mapbox-gl-js/examples/)

Pydantic documentation:
- [Pydantic](https://docs.pydantic.dev/latest/)

BrightData documentation:
- [BrightData](https://docs.brightdata.com/introduction)

---

## Change Management

This project maintains a comprehensive changelog to track all modifications, improvements, and fixes. This ensures transparency, facilitates debugging, and provides context for future development decisions.

### Change Tracking System

**Primary Documentation**: [`CHANGELOG.md`](./CHANGELOG.md) - Complete history of all changes following [Keep a Changelog](https://keepachangelog.com/) format.

**Change Categories**:
- **Added**: New features, functionality, or capabilities
- **Changed**: Modifications to existing functionality, refactoring, improvements
- **Deprecated**: Features marked for removal (with migration path)
- **Removed**: Features, files, or functionality completely removed
- **Fixed**: Bug fixes, error corrections, issue resolutions  
- **Security**: Security-related changes, vulnerability fixes, enhancements

### Mandatory Change Documentation

**When Claude Code makes ANY changes to the project**:

1. **MUST** update `CHANGELOG.md` immediately after implementing changes
2. **MUST** use appropriate category (Added/Changed/Fixed/etc.)
3. **MUST** include specific details about what changed and why
4. **MUST** reference affected files and functions when relevant
5. **MUST** note any breaking changes or migration requirements

### Change Entry Format

```markdown
### [Category]
- **Component/Feature Name**: 
  - Specific change description with technical details
  - Impact on functionality and user experience
  - Files affected: `path/to/file.py`, `path/to/component.tsx`
  - Migration notes (if applicable)
```

### Change Documentation Examples

**Good Change Entries**:
```markdown
### Added
- **Croatia.hr Scraper Enhancements**:
  - Vue.js dynamic content handling with Playwright browser automation
  - Event categorization system using Croatian keywords (10+ categories)
  - Files affected: `backend/app/scraping/croatia_scraper.py`
  - Breaking change: Removed BASE_URL constant, requires configuration update

### Fixed  
- **Map Performance Issues**:
  - Resolved layout thrashing during marker positioning operations
  - Implemented RAF-throttled batch calculations for smooth 60fps updates
  - Files affected: `frontend-new/src/components/map/EventMap.tsx`
  - Performance improvement: 40% reduction in render time for large datasets
```

### Recent Major Changes

The following significant enhancements have been implemented (see [`CHANGELOG.md`](./CHANGELOG.md) for complete details):

**2024-08-03 - Croatia Scraper Enhancement Release**:
- Enhanced Croatia.hr scraper with Vue.js handling and Croatian categorization
- Advanced geocoding service with Croatian geographic database integration  
- Dynamic map clustering with performance optimization
- Comprehensive frontend performance improvements

**Key Files Modified**:
- `backend/app/scraping/croatia_scraper.py` - Complete scraper rewrite
- `backend/app/core/geocoding_service.py` - Enhanced geocoding capabilities
- `backend/app/core/croatian_geo_db.py` - New Croatian geographic database
- `frontend-new/src/components/map/*` - Advanced clustering system
- `frontend-new/src/hooks/useEventClustering.ts` - Performance optimization hooks

### Development Workflow Integration

**Before Starting Work**:
1. Review recent entries in `CHANGELOG.md` to understand current state
2. Check for any breaking changes that might affect your work
3. Note any deprecated features to avoid using in new development

**During Development**:
1. Keep notes of changes made for later documentation
2. Consider impact on existing functionality and users
3. Plan change documentation structure as you work

**After Completing Work**:
1. Update `CHANGELOG.md` with comprehensive change documentation
2. Ensure all affected files and components are listed
3. Include migration guidance for breaking changes
4. Test that documentation accurately reflects implemented changes

### Claude Code Instructions

**For All Code Modifications**:
- Always read the current `CHANGELOG.md` before making changes to understand project state
- Document every change immediately after implementation, not as batch updates
- Use specific technical details rather than generic descriptions
- Include file paths, function names, and component names where relevant
- Note performance impacts, breaking changes, and user-facing improvements
- Reference the changelog when explaining decisions or providing context

**Change Documentation Priority**:
1. **Critical**: Security fixes, breaking changes, data loss risks
2. **High**: New features, API changes, configuration updates  
3. **Medium**: Performance improvements, bug fixes, refactoring
4. **Low**: Documentation updates, code cleanup, minor UI tweaks

### Debugging and Troubleshooting

When investigating issues:
1. **Check CHANGELOG.md first** - Recent changes often reveal issue sources
2. **Look for "Fixed" entries** - Similar issues may have been resolved before
3. **Review "Changed" entries** - Modifications might have introduced regressions
4. **Check version dates** - Correlate issues with timing of specific changes

### Quality Assurance

**Before Release/Deployment**:
- Verify `CHANGELOG.md` accurately reflects all changes since last release
- Ensure breaking changes are clearly documented with migration paths
- Confirm security-related changes are properly categorized and detailed
- Review that all significant bug fixes and new features are documented

This change management system ensures that every modification to the Croatian Events Platform is properly tracked, documented, and understood by all team members and future developers.
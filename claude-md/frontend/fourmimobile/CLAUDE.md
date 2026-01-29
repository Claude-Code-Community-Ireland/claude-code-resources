# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

[byterover-mcp]

# important 
always use byterover-retrieve-knowledge tool to get the related context before any tasks 
always use byterover-store-knowledge to store all the critical informations after sucessful tasks

# FourmiMobile - Financial Education Quest System

## Project Overview

FourmiMobile is a React Native financial education app built with Ignite boilerplate, implementing Domain Driven Design (DDD) and Test Driven Development (TDD). The app uses a quest-based educational system where users learn financial management through guided interactions.

## Development Commands

### Basic Development
```bash
pnpm install              # Install dependencies
pnpm start                # Start development server with Expo
pnpm run android          # Run on Android device/emulator  
pnpm run ios              # Run on iOS device/simulator
pnpm run web              # Run web version
```

### Testing & Quality
```bash
pnpm test                 # Run Jest test suite
pnpm run test:watch       # Run tests in watch mode
pnpm run lint             # Run ESLint with auto-fix
pnpm run lint:check       # Check linting without fixing
pnpm run compile          # TypeScript type checking
```

### Building
```bash
pnpm run build:ios:sim    # Build for iOS simulator
pnpm run build:ios:dev    # Build for iOS device (development)
pnpm run build:android:sim # Build for Android simulator
```

### Maestro E2E Testing
```bash
pnpm run test:maestro     # Run Maestro end-to-end tests
```

## Architecture Overview

### Domain Driven Design Structure

The application follows DDD with 3 bounded contexts:

1. **USER PROGRESSION** - Quest orchestration and gamification
   - Quest Aggregate: Educational quest management
   - UserProgression Aggregate: User progress, XP, feature unlocking

2. **FINANCIAL DATA** - User financial information management  
   - FinancialProfile Aggregate: Budget calculations, financial health
   - PendingFactsProcessor Aggregate: AI extraction with human validation

3. **PROJECT MANAGEMENT** - Complex financial projects (real estate, debt consolidation)
   - Project Aggregate: Financial simulations, analysis, recommendations

### Code Organization
```
app/
├── components/          # Reusable UI components (Ignite standard)
├── screens/            # Screen components  
├── navigators/         # Navigation configuration
├── services/           # Application layer services
├── context/            # React context providers
├── domain/             # DDD domain layer (to be implemented)
│   ├── aggregates/     # Domain aggregates
│   ├── value-objects/  # Domain value objects  
│   ├── events/         # Domain events
│   └── services/       # Domain services
├── infrastructure/     # Infrastructure adapters (to be implemented)
└── application/        # Use cases and application services (to be implemented)
```

## Development Guidelines

### DDD & TDD Approach
- **Test First**: Always write failing tests before implementation
- **Feature-by-Feature**: Implement incrementally with commits per sub-step
- **Red-Green-Refactor**: Follow strict TDD cycle
- **Domain-Centric**: Business logic belongs in domain aggregates
- **Event-Driven**: Use domain events for cross-aggregate communication

### Quest System Architecture  
- Quests are the core unit combining education + data collection + AI analysis
- Each quest follows: Scenario → Input → AI Analysis → Profile Update → Progression
- Quest completion unlocks new features and subsequent quests
- All user inputs (forms or voice) go through AI validation with human approval

### Commit Guidelines
- Commit frequently - each sub-step gets a commit
- **IMPORTANT**: Do NOT include "Co-Authored-By: Claude" in commit messages
- Follow conventional commit format: type(scope): description
- Test changes before committing

### Code Style & Patterns
- Follow existing Ignite patterns and conventions
- Use TypeScript with strict mode enabled
- Prefer functional components with hooks
- Import paths: Use `@/` for app imports, `@assets/` for assets
- Test files: Co-locate with source files (`.test.ts/.test.tsx`)

### Value Objects & Domain Modeling
Key value objects to implement:
- `MoneyAmount`: Financial calculations with cents precision  
- `Currency`: Multi-currency support
- `QuestId`, `UserId`, `ProjectId`: Type-safe identifiers
- `ValidationStatus`: AI-generated content approval states

### Mobile-First Design
- Responsive design with mobile-first approach
- Tab navigation: Home (dynamic quest content), Profile (editable data), Quests (progress), Analysis (AI insights)  
- Overlay chat system for contextual AI assistance
- Voice input support for accessibility

## Important Project Notes

### Backend Integration
- Initially planned for Convex backend but infrastructure may change
- Focus on domain layer first, adapt infrastructure layer as needed
- Repository pattern provides abstraction for backend switching

### AI Integration Philosophy  
- AI suggests, human validates - never impose AI decisions
- All AI-generated content has pending/validated states
- Creator tracking: differentiate user vs AI generated content
- Educational content entity should be separated from quest aggregates

### Testing Strategy
Follow test pyramid:
- **Unit tests**: Domain aggregates and value objects (high coverage)  
- **Integration tests**: Application services and repositories
- **E2E tests**: User journey flows (Maestro)
- Avoid heavy test scripts - prefer direct testing approach

### Missing Entities to Implement
Based on domain analysis, implement these missing entities:
- Educational Content aggregate (separate from quests)
- Currency value object for multi-currency support  
- User creation tracking for AI validation workflow

### Event Bus Architecture Clarification
Review and decide on Event Bus implementation:
- Current docs reference EventBus but unclear if needed for MVP
- Consider simple pub/sub vs full event sourcing approach
- Document decision in Architecture Decision Records (ADRs)

## Ignite Boilerplate Conventions

### Internationalization (i18n)
**MANDATORY**: All user-facing text must use i18n system
- Use `tx` prop for all Text components: `<Text tx="welcomeScreen.title" />`
- Never use `text` prop with hardcoded strings for user-facing text
- Translations in `app/i18n/` with TypeScript type safety via `TxKeyPath`
- Support for RTL languages automatically handled
- Add new translations to `app/i18n/fr.ts` (primary) and `app/i18n/en.ts`

### Theming System
**MANDATORY**: Use theming system for all styles
- Use `useAppTheme()` hook to access theme context and colors
- Light/dark mode automatically supported with persistence via MMKV
- Colors defined in `app/theme/colors.ts` and `app/theme/colorsDark.ts`
- Use `themed()` function for conditional styling: `style={themed($buttonStyle)}`
- Never hardcode colors - always use theme colors

### Component Conventions
**Screen Component:**
- Always use `<Screen>` wrapper with preset: "fixed" | "scroll" | "auto"
- Automatic safe area handling, keyboard avoidance, and error boundaries
- Example: `<Screen preset="scroll" safeAreaEdges={["top"]}>`

**Text Component:**
- Use `tx` prop for translated text: `<Text tx="common.ok" />`
- Use presets: "heading" | "subheading" | "formLabel" | "formHelper"
- Typography weights and sizes via props: `<Text preset="heading" weight="bold" size="xl" />`

### Navigation Patterns
- TypeScript-strict navigation with param lists in `AppNavigator.tsx`
- Bottom tab navigation for main flows (see `DemoNavigator.tsx` as example)
- Stack navigation for auth flows and modals
- Always add new screens to param lists and anchor comments

### Ignite CLI Generators
Use CLI for consistent code generation:
```bash
npx ignite-cli generate screen QuestScreen    # Creates typed screen
npx ignite-cli generate component QuestStep  # Creates component with theming
npx ignite-cli generate model User           # Creates data model
```
- Generated files automatically integrate with navigation and typing
- Templates in `ignite/templates/` can be customized for project needs

## Analytics with PostHog

### MANDATORY Analytics Integration
**Setup**: PostHog must be configured for all user interactions
- Track quest progression: quest started, step completed, quest finished
- Track user journey: screen changes, feature usage, error states
- Track financial actions: profile updates, project calculations
- Privacy-compliant with user consent management

**Event Naming Convention:**
```typescript
// Quest events
analytics.track("quest_started", { quest_id: "budget_setup", user_level: "beginner" })
analytics.track("step_completed", { quest_id, step_id, completion_time_ms, method: "form" | "voice" })
analytics.track("quest_completed", { quest_id, total_time_ms, experience_gained })

// Financial events  
analytics.track("profile_updated", { field_changed: "income", validation_method: "ai" | "manual" })
analytics.track("calculation_performed", { calculation_type: "budget_balance", result_value })

// AI interaction events
analytics.track("ai_suggestion_accepted", { suggestion_type, context_screen })
analytics.track("ai_validation_corrected", { field_type, confidence_score })
```

### Privacy & Data Protection
- No sensitive financial amounts in analytics - use ranges or percentages
- User consent required before analytics activation
- GDPR compliance with data export/deletion capabilities

## Feature Development Requirements

### Documentation Structure
**MANDATORY**: Every feature must have documentation in `docs/features/[FEATURE_NAME]/`
- `requirements.md`: PRD with user stories, acceptance criteria, business rules
- `roadmap.md`: Linear task breakdown (bullet points, no time estimates)
- `technical-design.md`: Architecture decisions, API contracts, data models

### Feature Development Process
1. **Planning**: Create documentation files before any code
2. **TDD Implementation**: Write tests first for each step
3. **Commit Strategy**: One commit per sub-step with descriptive messages  
4. **Review**: Code review + documentation review before merge
5. **Analytics**: PostHog events added for all user interactions

### Folder Structure per Feature
```
docs/features/quest-system/
├── requirements.md          # What and why
├── roadmap.md              # How (step by step)
├── technical-design.md     # Implementation details
└── testing-strategy.md     # Test approaches
```

### Documentation Templates

#### requirements.md Template
```markdown
# [Feature Name] - Requirements

## User Stories
- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Given [context] when [action] then [expected result]
- [ ] Given [context] when [action] then [expected result]

## Business Rules
1. [Rule description with rationale]
2. [Rule description with rationale]

## PostHog Analytics Events
- Event: `feature_started` - Properties: [list]
- Event: `feature_completed` - Properties: [list]
- Event: `feature_error` - Properties: [list]

## Dependencies
- Domain aggregates: [list of required aggregates]
- External services: [list of external dependencies]
- UI components: [list of new components needed]
```

#### roadmap.md Template  
```markdown
# [Feature Name] - Roadmap

## Linear Implementation Steps
- Step 1: [Description of atomic task]
- Step 2: [Description of atomic task]  
- Step 3: [Description of atomic task]
- Step 4: [Description of atomic task]

## TDD Approach per Step
Each step follows Red-Green-Refactor:
1. Write failing test
2. Minimal implementation to pass
3. Refactor for clean code
4. Commit with descriptive message

## Definition of Done
- [ ] All unit tests pass (>90% coverage)
- [ ] Integration tests pass
- [ ] PostHog events implemented
- [ ] i18n translations added (fr + en)
- [ ] Dark mode support verified
- [ ] Mobile responsive design verified
- [ ] Code review completed
```

**CRITICAL**: It's mandatory to have the docs before implementing any code related to a feature

## Dependency Injection Pattern

### Use Cases Architecture
Follow the Use Cases pattern for Application Layer orchestration:

```typescript
// Singleton dependency injection (like Dependencies.ts example)
export class Dependencies {
  // Repositories (Infrastructure Layer)
  private static _questRepository: QuestRepository | null = null;
  private static _userProgressionRepository: UserProgressionRepository | null = null;
  
  // Services (Application Layer) 
  private static _rewardService: RewardService | null = null;
  private static _educationalContentService: EducationalContentService | null = null;
  private static _analyticsService: AnalyticsService | null = null;

  // Use Cases (Application Layer)
  private static _completeQuestUseCase: CompleteQuestUseCase | null = null;
  private static _startQuestUseCase: StartQuestUseCase | null = null;
  
  static initialize(): void {
    // Initialize infrastructure adapters
    this._questRepository = new ConvexQuestRepository();
    this._userProgressionRepository = new ConvexUserProgressionRepository();
    
    // Initialize application services
    this._rewardService = new RewardService();
    this._educationalContentService = new EducationalContentService();
    this._analyticsService = new PostHogAnalyticsService();
    
    // Initialize use cases with dependencies
    this._completeQuestUseCase = new CompleteQuestUseCase(
      this._questRepository,
      this._userProgressionRepository,
      this._rewardService,
      this._analyticsService
    );
  }
  
  // Getters for use cases
  static completeQuestUseCase(): CompleteQuestUseCase {
    if (!this._completeQuestUseCase) throw new Error("Dependencies not initialized");
    return this._completeQuestUseCase;
  }
}
```

### Cross-Context Communication
**NO EventBus** - Use direct service calls in Use Cases:
- Use Cases orchestrate multiple aggregates
- Direct calls between services in Application Layer
- React Context for UI state, not domain events

### Rewards System  
**RewardService** (Application Layer) - not a domain aggregate:
- XPPoints as Value Object in UserProgression aggregate
- Simple XP calculation based on quest/step type
- Reward configuration in service, not domain logic
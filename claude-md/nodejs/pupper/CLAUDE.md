# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is pup.ai v2, a context-aware Slack bot with personality and memory. The bot:
- Maintains conversation memory using PostgreSQL with pgvector embeddings
- Builds user personality profiles over time
- Has an opinionated, humorous personality
- Uses MCP (Model Context Protocol) for extensibility
- Deploys to Railway

## Core Principles

1. **Memory First**: Every interaction should consider historical context
2. **Personality Driven**: Responses should be consistent with bot's personality traits
3. **Performance Conscious**: Use caching, rate limiting, and efficient queries
4. **Type Safe**: Leverage TypeScript's type system fully
5. **Test Coverage**: Aim for >80% test coverage on critical paths

## Development Commands

### Project Setup
```bash
npm install
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed initial data (if applicable)
```

### Development
```bash
npm run dev           # Start development server with hot reload
npm run build         # Build TypeScript to JavaScript
npm run start         # Start production server
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix auto-fixable ESLint issues
npm run typecheck     # Run TypeScript type checking
npm run test          # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests
```

### Database Operations
```bash
npm run db:create -- migration-name   # Create new migration
npm run db:migrate    # Run pending migrations
npm run db:rollback   # Rollback last migration
npm run db:reset      # Reset database (caution: deletes all data)
```

## Architecture Overview

### Message Processing Pipeline
1. **Slack Event Reception** (`src/bot/handlers/`): All messages in channels where bot is present are captured
2. **Message Storage** (`src/db/queries.ts`): Messages are stored with deduplication logic
3. **Embedding Generation** (`src/workers/embeddings.ts`): Background job generates OpenAI embeddings via BullMQ
4. **Context Analysis** (`src/ai/memory.ts`): When bot needs to respond, it performs semantic search on message history
5. **Response Generation** (`src/ai/personality.ts`): Bot generates contextual responses using personality engine

### Key Components

**Bot Personality System** (`src/ai/personality.ts`):
- Maintains different "moods" based on recent interactions
- Forms opinions about users based on stored interaction history
- Implements contextual humor and callback mechanisms

**Memory Retrieval** (`src/ai/memory.ts`):
- Uses pgvector for semantic similarity search
- Implements conversation threading and context windows
- Prioritizes recent and highly relevant messages

**MCP Integration** (`src/mcp/`):
- PostgreSQL MCP server for database operations
- Brave Search MCP server for web searches
- Custom Slack MCP server for extended Slack operations

**Background Workers** (`src/workers/`):
- BullMQ-based job processing
- Handles embedding generation, summarization, and profile updates
- Implements retry logic and error handling

### Database Schema
The system uses PostgreSQL with pgvector extension:
- `users`: Stores Slack user info and personality profiles (JSONB for flexible attributes)
- `messages`: Stores all messages with vector embeddings (1536 dimensions for OpenAI)
- `conversation_summaries`: Daily/periodic conversation summaries
- `user_interactions`: Tracks relationships between users

### Environment Configuration
Required environment variables:
- `SLACK_BOT_TOKEN`: Bot user OAuth token (xoxb-)
- `SLACK_APP_TOKEN`: App-level token for Socket Mode (xapp-)
- `SLACK_SIGNING_SECRET`: For request verification
- `OPENAI_API_KEY`: For embeddings and AI responses
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection for caching and job queue

### Testing Strategy
- Unit tests mock external services (Slack API, OpenAI, database)
- Integration tests use test database and mock MCP servers
- Use `@slack/bolt/dist/test-helpers` for Slack event mocking

### Railway Deployment
The project includes a `railway.toml` for deployment configuration:
- Automatic database migrations on deploy
- Environment variable injection
- Health check endpoint at `/health`

## Important Implementation Notes

1. **Rate Limiting**: OpenAI API calls are rate-limited using a token bucket algorithm
2. **Message Deduplication**: Messages are deduplicated by `message_ts` to prevent duplicates
3. **Vector Search**: Use cosine similarity for semantic search, with a threshold of 0.7 for relevance
4. **Error Handling**: All async operations should have try-catch blocks with fallback behavior
5. **Memory Context**: Limit context window to 50 most relevant messages to avoid token limits

## MCP Server Details

The project implements Model Context Protocol servers for:
- **PostgreSQL Operations**: CRUD operations on user profiles and message history
- **Brave Search**: Web search integration for current events
- **Slack Extended**: Access to Slack-specific data not available through Bolt.js

MCP servers are initialized in `src/mcp/client.ts` and used throughout the application for extensible functionality.

## Code Style Guidelines

### TypeScript Conventions
- Use interfaces prefixed with `I` (e.g., `IUser`, `IMessage`)
- Use type aliases for complex types without prefix
- Prefer `type` over `interface` for function types
- Use strict null checks and handle undefined cases

### Import Organization
Imports should be organized in this order:
1. Node.js built-ins
2. External packages
3. Internal modules using path aliases (@bot, @ai, @db, etc.)
4. Relative imports
5. Type imports last

### Error Handling
- Always use custom error classes from `src/utils/errors.ts`
- Include context in error messages
- Log errors with appropriate levels
- Use circuit breakers for external services

### Database Queries
- Use parameterized queries to prevent SQL injection
- Include appropriate indexes for vector searches
- Batch operations when possible
- Use transactions for multi-step operations

## Common Patterns

### Feature Flag Usage
```typescript
import { isFeatureEnabled, FeatureFlag } from '@utils/featureFlags';

if (isFeatureEnabled(FeatureFlag.SEARCH, userId)) {
  // Feature-specific code
}
```

### Memory Retrieval Pattern
```typescript
const context = await memoryService.getRelevantContext({
  query: message.text,
  userId: message.user,
  limit: 50,
  threshold: 0.7
});
```

### Personality Response Pattern
```typescript
const response = await personalityEngine.generateResponse({
  context,
  userProfile,
  mood: currentMood,
  recentInteractions
});
```

## Performance Considerations

1. **Embedding Generation**: Queue in background, don't block message processing
2. **Vector Search**: Use appropriate limits and thresholds
3. **Caching**: Cache user profiles and frequent queries
4. **Rate Limiting**: Respect API limits for OpenAI and Slack
5. **Database Connections**: Use connection pooling

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Input Validation**: Sanitize all user inputs
3. **SQL Injection**: Use parameterized queries
4. **Rate Limiting**: Implement per-user rate limits
5. **Error Messages**: Don't expose internal details

## Debugging Tips

1. **Enable Debug Mode**: Set `LOG_LEVEL=debug` and `FEATURE_FLAGS=debug_mode`
2. **VS Code Debugging**: Use provided launch configurations
3. **Database Queries**: Enable query logging in development
4. **Worker Jobs**: Monitor with Bull Board at http://localhost:3001
5. **Memory Usage**: Profile with `npm run profile`

## Common Issues and Solutions

### Bot Not Responding
- Check Socket Mode connection in logs
- Verify bot is in the channel
- Check for rate limiting

### Embeddings Not Generated
- Check Redis connection for job queue
- Verify OpenAI API key and limits
- Check worker logs

### Memory Retrieval Issues
- Verify pgvector extension is installed
- Check embedding dimensions match
- Review similarity threshold settings

## Testing Guidelines

1. **Unit Tests**: Mock all external dependencies
2. **Integration Tests**: Use test database
3. **E2E Tests**: Use Slack test workspace
4. **Performance Tests**: Monitor response times
5. **Coverage**: Maintain >80% on critical paths
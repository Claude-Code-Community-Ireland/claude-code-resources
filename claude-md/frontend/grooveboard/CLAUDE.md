# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GrooveBoard is a simple, real-time collaborative whiteboard application designed for ease of use (even for younger users). The project is built with a React TypeScript frontend and follows Test-Driven Development (TDD) principles. This is currently in Phase 1 of development, focusing on core drawing and real-time anonymous collaboration.

## Architecture

The application follows a client-server architecture:

- **Frontend**: React 19 with TypeScript, using Create React App
- **Real-time Communication**: Socket.IO for WebSocket-based collaborative features
- **Backend**: Currently expects a WebSocket server running on `localhost:3001`
- **Future Architecture**: Planned microservices architecture with AWS/Kubernetes deployment

### Key Components

- `App.tsx` - Main application state management, WebSocket connection, and multi-page support
- `Board.tsx` - Board wrapper component
- `CanvasPage.tsx` - Canvas rendering and drawing interaction logic
- `Toolbar.tsx` - Tool selection and drawing controls
- `Tool.tsx` - Tool type definitions

### Data Model

The core data structure is the `Stroke` interface:
```typescript
interface Stroke {
  id: string;
  tool: Tool | 'pen';
  points: { x: number; y: number }[];
  color: string;
  width: number;
}
```

The application supports multiple pages, where each page contains an array of strokes.

## Development Commands

All commands should be run from the `frontend/` directory:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Type checking (via react-scripts)
npx tsc --noEmit
```

## Development Guidelines

### Test-Driven Development
All development should follow TDD principles - write tests before implementation code. The project uses Jest and React Testing Library.

### Code Style
- TypeScript with strict mode enabled
- React functional components with hooks
- Props interfaces for all components
- Consistent naming conventions (camelCase for variables/functions, PascalCase for components)

### Key Development Patterns

1. **State Management**: Uses React hooks with centralized state in App component
2. **Real-time Updates**: WebSocket events are handled with optimistic updates (update local state immediately, then broadcast)
3. **Multi-page Support**: Pages are managed as an array of stroke arrays with currentPageIndex
4. **Tool System**: Extensible tool system with pen and eraser tools

### WebSocket Events
- `draw` - Broadcast new stroke data
- `erase` - Broadcast updated paths after erasure
- `clear` - Clear current page

## Current Development Focus

The project is in Phase 1: Core Drawing & Real-time Anonymous Collaboration Foundation. Key features implemented:
- Basic pen tool with configurable color/width
- Eraser tool with configurable width
- Clear board functionality
- Multi-page support
- Real-time collaboration via WebSocket

## Future Phases

- Phase 2: Kubernetes deployment, board persistence, ad integration
- Phase 3: User authentication, premium features
- Phase 4: Monitoring, optimization, advanced cloud features

## Observability Stack Integration

GrooveBoard will integrate with Visa's observability infrastructure using industry-standard tools:

### Metrics Collection (Prometheus + M3DB)
- **Prometheus**: Collect application metrics (drawing operations, user sessions, WebSocket connections)
- **M3DB**: Long-term scalable storage for Prometheus metrics
- Monitor canvas performance, stroke counts, page switches, and collaboration patterns

### Distributed Tracing (OpenTelemetry)
- **OpenTelemetry SDK**: Instrument React frontend and future backend services
- **OTel Collector**: Aggregate and export telemetry data
- Trace user interactions: input → WebSocket → canvas updates → collaboration events

### Logging (OpenSearch Migration)
- **Current**: Elastic + Splunk
- **Target**: OpenSearch for centralized log aggregation
- Structured logging for user actions, errors, WebSocket events, and system diagnostics

### Analytics Datastore (ClickHouse)
- Store user behavior analytics and drawing patterns
- Fast queries for real-time dashboards and collaboration insights
- Track usage metrics for product optimization

### Implementation Plan
1. Add OpenTelemetry SDK to React frontend
2. Instrument drawing pipeline and WebSocket events
3. Replace console.log with structured logging
4. Set up Prometheus metrics collection
5. Configure OTel Collector for data aggregation
6. Design ClickHouse schema for behavioral analytics

This observability stack will provide comprehensive monitoring across the entire collaborative whiteboard experience.

## Testing

Run tests with `npm test` in the frontend directory. Follow TDD practices by writing tests first for all new features.
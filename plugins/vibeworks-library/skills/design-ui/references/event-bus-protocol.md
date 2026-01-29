# Event Bus Protocol Specification

This document defines the communication protocol between agents and the orchestrator in the design system's event-driven architecture.

## Overview

The event bus provides asynchronous, topic-based communication between autonomous agents and the orchestrator. This decouples agents from each other and enables true parallelism.

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                           EVENT BUS                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Topics:                                                          │
│   ├── agent.design_researcher.goal     (orchestrator → agent)     │
│   ├── agent.design_researcher.status   (agent → orchestrator)     │
│   ├── agent.design_generator.goal                                  │
│   ├── agent.design_generator.status                                │
│   ├── agent.design_reviewer.goal                                   │
│   ├── agent.design_reviewer.status                                 │
│   ├── agent.spatial_auditor.goal                                   │
│   ├── agent.spatial_auditor.status                                 │
│   ├── agent.color_judge.goal                                       │
│   ├── agent.color_judge.status                                     │
│   ├── agent.typography_critic.goal                                 │
│   ├── agent.typography_critic.status                               │
│   ├── agent.vibe_code_detector.goal                                │
│   ├── agent.vibe_code_detector.status                              │
│   ├── agent.accessibility_critic.goal                              │
│   ├── agent.accessibility_critic.status                            │
│   ├── agent.performance_critic.goal                                │
│   ├── agent.performance_critic.status                              │
│   ├── agent.brand_alignment_critic.goal                            │
│   └── agent.brand_alignment_critic.status                          │
│                                                                     │
│   Storage: .design-system-events.json (JSON Lines format)          │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Topic Naming Convention

```
agent.<agent_id>.<message_type>

Components:
- agent: Fixed prefix for all agent topics
- agent_id: Unique identifier (snake_case)
- message_type: Either 'goal' or 'status'
```

**Examples:**
- `agent.design_generator.goal` - Goals sent to design-generator
- `agent.design_generator.status` - Status updates from design-generator
- `agent.color_judge.goal` - Goals sent to color-judge
- `agent.color_judge.status` - Status updates from color-judge

## Message Types

### 1. Goal Message (Orchestrator → Agent)

Published by orchestrator to assign a task to an agent.

```json
{
  "id": "goal_uuid_v4",
  "topic": "agent.design_generator.goal",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "payload": {
    "goal_id": "goal_abc123",
    "goal": "Generate a responsive landing page for a fintech startup",
    "context": {
      "brief": {
        "sector": "fintech",
        "audience": "B2B professionals",
        "style": ["modern", "trustworthy"]
      },
      "research_findings": {
        "patterns": [...],
        "competitors": [...],
        "recommendations": [...]
      },
      "previous_iteration": {
        "number": 2,
        "score": 7.1,
        "feedback": ["Improve card spacing", "Fix button contrast"]
      },
      "locked_decisions": ["Color palette: blue primary"],
      "failed_approaches": ["Gradient backgrounds"]
    },
    "config": {
      "framework": "react",
      "css": "tailwind",
      "quality_preset": "standard",
      "quality_threshold": 0.90
    }
  }
}
```

### 2. Status Messages (Agent → Orchestrator)

Agents publish status updates to report progress and completion.

#### TASK_RECEIVED

Sent immediately when agent receives and begins processing a goal.

```json
{
  "id": "evt_uuid_001",
  "topic": "agent.design_generator.status",
  "timestamp": "2026-01-22T10:30:01.000Z",
  "payload": {
    "signal": "TASK_RECEIVED",
    "goal_id": "goal_abc123",
    "agent_id": "design_generator",
    "message": "Starting internal improvement loop"
  }
}
```

#### ITERATION_COMPLETE

Sent after each internal evaluation cycle.

```json
{
  "id": "evt_uuid_002",
  "topic": "agent.design_generator.status",
  "timestamp": "2026-01-22T10:30:15.000Z",
  "payload": {
    "signal": "ITERATION_COMPLETE",
    "goal_id": "goal_abc123",
    "agent_id": "design_generator",
    "iteration": 2,
    "score": 0.78,
    "gates": {
      "html_validity": { "score": 1.0, "status": "pass" },
      "css_responsiveness": { "score": 0.9, "status": "pass" },
      "accessibility_basics": { "score": 0.6, "status": "fail" },
      "token_coverage": { "score": 0.7, "status": "partial" }
    },
    "feedback": [
      "Missing alt attributes on 3 images",
      "Skip link not implemented",
      "Hardcoded color values in footer"
    ],
    "message": "Score below threshold, continuing refinement"
  }
}
```

#### SUCCESS

Sent when agent meets quality threshold.

```json
{
  "id": "evt_uuid_003",
  "topic": "agent.design_generator.status",
  "timestamp": "2026-01-22T10:30:45.000Z",
  "payload": {
    "signal": "SUCCESS",
    "goal_id": "goal_abc123",
    "agent_id": "design_generator",
    "iteration": 3,
    "final_score": 0.94,
    "gates": {
      "html_validity": { "score": 1.0, "status": "pass" },
      "css_responsiveness": { "score": 0.95, "status": "pass" },
      "accessibility_basics": { "score": 0.9, "status": "pass" },
      "token_coverage": { "score": 0.92, "status": "pass" }
    },
    "output": {
      "files": [
        { "path": "design-output/index.html", "type": "html" },
        { "path": "design-output/styles.css", "type": "css" },
        { "path": "design-output/design-tokens.json", "type": "json" }
      ],
      "summary": "Generated responsive React landing page with Tailwind CSS"
    },
    "metrics": {
      "total_iterations": 3,
      "execution_time_ms": 44000,
      "model_calls": {
        "execute": 1,
        "evaluate": 3,
        "refine": 2
      }
    }
  }
}
```

#### FAILURE_MAX_ITERATIONS

Sent when agent exhausts iterations without meeting threshold.

```json
{
  "id": "evt_uuid_004",
  "topic": "agent.design_generator.status",
  "timestamp": "2026-01-22T10:32:00.000Z",
  "payload": {
    "signal": "FAILURE_MAX_ITERATIONS",
    "goal_id": "goal_abc123",
    "agent_id": "design_generator",
    "iteration": 5,
    "best_score": 0.82,
    "best_iteration": 4,
    "gates": {
      "html_validity": { "score": 1.0, "status": "pass" },
      "css_responsiveness": { "score": 0.9, "status": "pass" },
      "accessibility_basics": { "score": 0.75, "status": "partial" },
      "token_coverage": { "score": 0.85, "status": "pass" }
    },
    "best_output": {
      "files": [...],
      "summary": "Best attempt after 5 iterations"
    },
    "persistent_issues": [
      "Unable to achieve AAA contrast with requested color palette",
      "Complex form validation accessibility incomplete"
    ],
    "message": "Max iterations reached. Best attempt attached."
  }
}
```

#### ERROR_UNRECOVERABLE

Sent when agent encounters a fatal error.

```json
{
  "id": "evt_uuid_005",
  "topic": "agent.design_generator.status",
  "timestamp": "2026-01-22T10:30:05.000Z",
  "payload": {
    "signal": "ERROR_UNRECOVERABLE",
    "goal_id": "goal_abc123",
    "agent_id": "design_generator",
    "error_type": "MODEL_UNAVAILABLE",
    "error_message": "Execute model timed out after 3 retries",
    "partial_output": null,
    "context": {
      "phase": "execute",
      "iteration": 1
    }
  }
}
```

## Signal Summary

| Signal | Meaning | Contains Output | Terminal |
|--------|---------|-----------------|----------|
| `TASK_RECEIVED` | Agent started processing | No | No |
| `ITERATION_COMPLETE` | Internal iteration done | No | No |
| `SUCCESS` | Quality threshold met | Yes (final) | Yes |
| `FAILURE_MAX_ITERATIONS` | Max attempts reached | Yes (best) | Yes |
| `ERROR_UNRECOVERABLE` | Fatal error | Maybe (partial) | Yes |

## Orchestrator Behavior

### Publishing Goals

```markdown
## Goal Publishing

To assign a task to an agent:

1. Create goal message with unique goal_id
2. Include full context (brief, research, previous feedback)
3. Specify quality threshold and config
4. Append to .design-system-events.json
5. Update orchestrator state with pending agent
```

### Listening for Status

```markdown
## Status Listening

To receive agent status updates:

1. Read .design-system-events.json
2. Filter for agent.*.status topics
3. Find events newer than last processed timestamp
4. Process each status signal:
   - TASK_RECEIVED: Log, continue waiting
   - ITERATION_COMPLETE: Log progress, continue waiting
   - SUCCESS: Store output, proceed to next phase
   - FAILURE_MAX_ITERATIONS: Evaluate fallback options
   - ERROR_UNRECOVERABLE: Activate error handling
5. Update last processed timestamp
```

### Parallel Critic Execution

```markdown
## Parallel Critic Dispatch

To run all 7 critics simultaneously:

1. Publish goals to all critic topics:
   - agent.spatial_auditor.goal
   - agent.color_judge.goal
   - agent.typography_critic.goal
   - agent.vibe_code_detector.goal
   - agent.accessibility_critic.goal
   - agent.performance_critic.goal
   - agent.brand_alignment_critic.goal

2. Track pending agents:
   pending = [all 7 critics]

3. Poll for status signals:
   while pending is not empty:
     check for new status events
     for each SUCCESS: remove from pending, store output
     for each FAILURE: handle according to severity

4. Aggregate results when all complete
```

## File-Based Implementation

### Event Log Structure

Events are stored in `.design-system-events.json` using JSON Lines format (one JSON object per line):

```jsonl
{"id":"evt_001","topic":"agent.design_researcher.goal","timestamp":"2026-01-22T10:00:00Z","payload":{...}}
{"id":"evt_002","topic":"agent.design_researcher.status","timestamp":"2026-01-22T10:00:01Z","payload":{"signal":"TASK_RECEIVED",...}}
{"id":"evt_003","topic":"agent.design_researcher.status","timestamp":"2026-01-22T10:00:15Z","payload":{"signal":"ITERATION_COMPLETE","iteration":1,...}}
{"id":"evt_004","topic":"agent.design_researcher.status","timestamp":"2026-01-22T10:00:25Z","payload":{"signal":"SUCCESS",...}}
{"id":"evt_005","topic":"agent.design_generator.goal","timestamp":"2026-01-22T10:00:26Z","payload":{...}}
```

### Writing Events

```markdown
To publish an event:

1. Generate unique event ID (UUID v4)
2. Create event object with topic, timestamp, payload
3. Serialize to JSON (single line, no pretty print)
4. Append to .design-system-events.json
5. Ensure file write is atomic (write to temp, then rename)
```

### Reading Events

```markdown
To read events:

1. Open .design-system-events.json
2. Read line by line
3. Parse each line as JSON
4. Filter by topic pattern if needed
5. Filter by timestamp if checking for new events
6. Return matching events
```

### State Tracking

The orchestrator tracks event processing in `.design-system-state.json`:

```json
{
  "orchestrationState": {
    "lastEventProcessed": "evt_004",
    "lastEventTimestamp": "2026-01-22T10:00:25Z",
    "pendingAgents": ["design_generator"],
    "completedAgents": {
      "design_researcher": {
        "status": "SUCCESS",
        "completedAt": "2026-01-22T10:00:25Z",
        "output": {...}
      }
    }
  }
}
```

## Communication Patterns

### Sequential Agent Execution

```
Orchestrator                 Researcher                  Generator
     │                           │                           │
     │─── goal ─────────────────►│                           │
     │                           │                           │
     │                           │◄── ralph loop ──►│        │
     │                           │                           │
     │◄── SUCCESS ───────────────│                           │
     │                           │                           │
     │─── goal (with research) ──────────────────────────────►│
     │                           │                           │
     │                           │           │◄── ralph loop ──►│
     │                           │                           │
     │◄── SUCCESS ───────────────────────────────────────────│
```

### Parallel Critic Execution

```
Orchestrator              Critics (7x parallel)
     │                         │
     │─── goal ───────────────►│ spatial_auditor
     │─── goal ───────────────►│ color_judge
     │─── goal ───────────────►│ typography_critic
     │─── goal ───────────────►│ vibe_code_detector
     │─── goal ───────────────►│ accessibility_critic
     │─── goal ───────────────►│ performance_critic
     │─── goal ───────────────►│ brand_alignment_critic
     │                         │
     │   [all run ralph loops simultaneously]
     │                         │
     │◄── SUCCESS ─────────────│ (first to complete)
     │◄── SUCCESS ─────────────│ (second)
     │◄── SUCCESS ─────────────│ (third)
     │         ...             │
     │◄── SUCCESS ─────────────│ (last)
     │                         │
     │─── aggregate ──────────►│
```

## Error Handling

### Agent Failure Scenarios

| Scenario | Signal | Orchestrator Response |
|----------|--------|----------------------|
| Low quality after max iterations | FAILURE_MAX_ITERATIONS | Use best attempt if score > 0.7, else fallback |
| Model timeout | ERROR_UNRECOVERABLE | Retry once, then fallback |
| Invalid context | ERROR_UNRECOVERABLE | Log error, checkpoint for human |
| Single critic fails | FAILURE_MAX_ITERATIONS | Continue with remaining critics, adjust weights |
| Multiple critics fail | FAILURE_MAX_ITERATIONS | Use heuristic scoring, checkpoint for human |

### Fallback Strategies

1. **Researcher fails**: Use fallback patterns from sector-patterns.md
2. **Generator fails**: Retry with simplified requirements or checkpoint
3. **Single critic fails**: Skip critic, normalize remaining weights
4. **Reviewer fails**: Use individual critic outputs directly

## Best Practices

### For Event Publishing

1. Always include unique event ID
2. Use ISO 8601 timestamps with timezone
3. Include goal_id for correlation
4. Keep payloads focused (don't duplicate context)

### For Event Listening

1. Process events in timestamp order
2. Handle duplicate events gracefully
3. Track last processed event for resume
4. Set reasonable polling intervals

### For Debugging

1. Event log serves as audit trail
2. Filter by goal_id to trace a request
3. Filter by agent_id to debug specific agent
4. Check iteration counts for stuck loops

## References

- `self-improving-agent-spec.md` - Agent internal loop specification
- `agent-quality-gates.md` - Per-agent quality criteria
- `.design-system-state.json` - Orchestrator state format

# Self-Improving Agent Specification

This document defines the base behavior for all self-improving agents in the design system. Each agent implements an internal Ralph Wiggum Loop that enables autonomous quality refinement.

## Core Concepts

### The Ralph Wiggum Loop

Every self-improving agent implements an internal improvement cycle:

```
┌─────────────────────────────────────────────────────────────────┐
│                    RALPH WIGGUM LOOP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │   EXECUTE    │ ← Primary task execution                     │
│   │   (v1)       │   Model: execute_model                       │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │   EVALUATE   │ ← Self-critique against quality gates        │
│   │              │   Model: evaluate_model                      │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ├──── score >= threshold ────► SUCCESS                 │
│          │                              (signal orchestrator)   │
│          │                                                       │
│          │ score < threshold                                    │
│          ▼                                                       │
│   ┌──────────────┐                                              │
│   │    REFINE    │ ← Targeted improvements                      │
│   │    (v2)      │   Model: refine_model                        │
│   └──────┬───────┘                                              │
│          │                                                       │
│          └─────────────────────────────► back to EVALUATE       │
│                                                                  │
│   After max_iterations ────► FAILURE_MAX_ITERATIONS             │
│                              (signal orchestrator with best)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Two-Level Architecture

The design system operates on two distinct levels:

| Level | Loop | Manager | Scope |
|-------|------|---------|-------|
| **Macro** | Orchestration Loop | design-orchestrator | Inter-agent coordination |
| **Micro** | Ralph Wiggum Loop | Individual agents | Intra-agent refinement |

## Base Agent Interface

All self-improving agents implement these three phases:

### 1. Execute Phase

The primary task execution using `execute_model`.

**Responsibilities:**
- Receive goal and context from orchestrator
- Perform the agent's core function
- Produce initial output (v1)

**Input:**
- `goal`: High-level objective from orchestrator
- `context`: Supporting information (research findings, previous outputs, etc.)

**Output:**
- Initial output appropriate to the agent type

### 2. Evaluate Phase

Self-critique of the output against internal quality gates using `evaluate_model`.

**Responsibilities:**
- Check output against each internal quality gate
- Calculate weighted score (0.0 to 1.0)
- Generate specific, actionable feedback for failures

**Scoring Formula:**
```
score = sum(gate.weight * gate.score for gate in internal_quality_gates)

where:
  gate.score = 1.0 if gate fully passes
  gate.score = actual_value / threshold if partially passing
  gate.score = 0.0 if completely failing
```

**Output:**
- `score`: Float between 0.0 and 1.0
- `feedback`: List of specific issues to address

### 3. Refine Phase

Targeted improvement based on evaluation feedback using `refine_model`.

**Responsibilities:**
- Take current output and feedback from Evaluate phase
- Make specific corrections for identified issues
- Produce improved output (v_n+1)

**Input:**
- `output`: Current version
- `feedback`: Specific issues from evaluate()
- `context`: Original goal and supporting information

**Output:**
- Improved output addressing the feedback

## Configuration Parameters

Each agent specifies these parameters in frontmatter:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `self_improving` | boolean | true | Enable internal Ralph loop |
| `execute_model` | string | varies | Model for primary execution |
| `evaluate_model` | string | haiku | Model for self-critique |
| `refine_model` | string | haiku | Model for refinement |
| `max_iterations` | integer | 5 | Maximum internal iterations |
| `quality_threshold` | float | 0.9 | Score needed for SUCCESS |

### Frontmatter Example

```yaml
---
name: design-generator
description: Creates production-ready UI assets...
tools: Write, Edit, Read, Bash
model: sonnet
color: green

# Self-Improvement Configuration
self_improving: true
execute_model: sonnet
evaluate_model: haiku
refine_model: haiku
max_iterations: 5
quality_threshold: 0.90
---
```

## Model Allocation Strategy

| Phase | Recommended Model | Rationale |
|-------|------------------|-----------|
| Execute | sonnet (complex) or haiku (focused) | Primary tasks need appropriate capability |
| Evaluate | haiku | Fast, cheap, good at focused critique |
| Refine | haiku | Good at making targeted edits |

**Cost Optimization:**
- Haiku for evaluate/refine is ~10x cheaper than sonnet
- Most iterations only run evaluate/refine phases
- Execute runs once per agent invocation
- Total cost is: 1 execute + N evaluates + (N-1) refines

## Internal Quality Gates

Each agent defines domain-specific quality gates. See `agent-quality-gates.md` for complete specifications.

### Gate Structure

```yaml
internal_quality_gates:
  - name: gate_identifier
    description: What this gate measures
    threshold: 0.9  # Minimum to pass (0.0-1.0)
    weight: 0.25    # Contribution to overall score
```

### Common Patterns

**For Generators:**
```yaml
internal_quality_gates:
  - name: validity
    description: Output is syntactically correct
    threshold: 1.0
    weight: 0.3
  - name: completeness
    description: All required elements present
    threshold: 0.9
    weight: 0.3
  - name: quality_baseline
    description: Meets minimum quality standards
    threshold: 0.8
    weight: 0.4
```

**For Critics/Reviewers:**
```yaml
internal_quality_gates:
  - name: coverage
    description: All elements analyzed
    threshold: 0.95
    weight: 0.4
  - name: specificity
    description: Issues are specific and actionable
    threshold: 0.85
    weight: 0.3
  - name: consistency
    description: Scoring follows documented criteria
    threshold: 0.9
    weight: 0.3
```

**For Researchers:**
```yaml
internal_quality_gates:
  - name: source_quality
    description: Sources are reputable
    threshold: 0.8
    weight: 0.3
  - name: coverage
    description: All research areas addressed
    threshold: 0.9
    weight: 0.4
  - name: actionability
    description: Findings are actionable
    threshold: 0.8
    weight: 0.3
```

## Loop Execution Flow

### Step-by-Step Process

1. **Receive Goal**
   - Agent receives goal and context from orchestrator via event bus
   - Signal `TASK_RECEIVED` to orchestrator

2. **Execute (once)**
   - Perform primary task using execute_model
   - Produce initial output v1

3. **Evaluate**
   - Check output against internal quality gates
   - Calculate weighted score
   - Generate specific feedback for failures
   - Signal `ITERATION_COMPLETE` with score

4. **Check Threshold**
   - If score >= quality_threshold:
     - Signal `SUCCESS` with final output
     - Exit loop
   - If score < quality_threshold AND iteration < max_iterations:
     - Proceed to Refine
   - If iteration >= max_iterations:
     - Signal `FAILURE_MAX_ITERATIONS` with best output
     - Exit loop

5. **Refine**
   - Take current output and feedback
   - Make targeted improvements
   - Produce improved output v_(n+1)
   - Return to Evaluate (step 3)

### Iteration Tracking

Each agent tracks:
- Current iteration number
- Score history across iterations
- Best output so far (highest score)
- Feedback history

## Error Handling

### Recoverable Errors

| Error | Response |
|-------|----------|
| Low quality score | Continue refinement loop |
| Single gate failure | Target specific improvement |
| Model timeout | Retry once with longer timeout |
| Partial output | Attempt to complete in refine phase |

### Unrecoverable Errors

| Error | Response |
|-------|----------|
| All models unavailable | Signal `ERROR_UNRECOVERABLE` |
| Context too large | Signal `ERROR_UNRECOVERABLE` |
| Max iterations reached | Signal `FAILURE_MAX_ITERATIONS` with best |
| Critical validation failure | Signal `ERROR_UNRECOVERABLE` |

### Failure Escalation

When an agent signals failure:

1. `FAILURE_MAX_ITERATIONS`:
   - Orchestrator receives best attempt
   - If score > 0.7: Use with warning
   - If score <= 0.7: Activate fallback or checkpoint

2. `ERROR_UNRECOVERABLE`:
   - Orchestrator activates fallback strategy
   - May trigger human checkpoint
   - Logs error for debugging

## Best Practices

### For Agent Authors

1. **Keep internal gates focused**: Each agent should only evaluate what it directly controls

2. **Use fast models for evaluate/refine**: Cost adds up quickly with iterations

3. **Set realistic thresholds**: 0.9 is good for most agents; 0.95+ for critical paths

4. **Log all iterations**: Essential for debugging and learning system

5. **Fail fast**: If early gates fail badly, don't waste iterations

6. **Be specific in feedback**: Vague feedback leads to poor refinement

### For Threshold Calibration

| Agent Type | Recommended Threshold |
|------------|----------------------|
| Generators (critical) | 0.90 |
| Generators (simple) | 0.85 |
| Critics | 0.90 |
| Researchers | 0.85 |
| Reviewers | 0.95 |

## Example: Design Generator Execution

```
Iteration 1:
  Execute: Generate HTML/CSS from research
  Evaluate: Score 0.65
    - Gate 'html_validity': 1.0 (PASS)
    - Gate 'css_responsiveness': 0.3 (FAIL - no breakpoints)
    - Gate 'accessibility_basics': 0.6 (PARTIAL - missing alt tags)
    - Gate 'token_coverage': 0.7 (PARTIAL - hardcoded colors)
  Refine: Add media queries, alt attributes, CSS variables

Iteration 2:
  Evaluate: Score 0.82
    - Gate 'html_validity': 1.0 (PASS)
    - Gate 'css_responsiveness': 0.9 (PASS)
    - Gate 'accessibility_basics': 0.75 (PARTIAL - missing skip link)
    - Gate 'token_coverage': 0.85 (PASS)
  Refine: Add skip link, ARIA labels

Iteration 3:
  Evaluate: Score 0.94 ✓ (>= 0.90 threshold)
    - All gates passing
  Signal: SUCCESS
```

## References

- `event-bus-protocol.md` - Communication protocol with orchestrator
- `agent-quality-gates.md` - Per-agent quality gate specifications
- `quality-gates.md` - Orchestrator-level quality gates (macro loop)

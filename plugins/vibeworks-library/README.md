# Vibeworks Library

Complete developer workflow toolkit for Claude Code.

34 skills, 34 agents, and 21 commands covering the full software development lifecycle.

## What's Included

### Skills (auto-activated by context)

#### Core Development (18)

| Skill | What it teaches Claude |
|-------|----------------------|
| `tdd-workflow` | Red-green-refactor cycle, test-first development |
| `debugging-systematic` | Hypothesis-driven debugging, binary search isolation |
| `code-review-checklist` | Multi-criteria review with severity classification |
| `git-workflow` | Commit conventions, rebase, conflict resolution |
| `branch-strategy` | Branch naming, Git Flow vs trunk-based |
| `pr-description` | Structured PR templates, stacked PRs |
| `architecture-decision-record` | ADR format and decision documentation |
| `api-design` | REST conventions, status codes, pagination |
| `error-handling-patterns` | Error types, retry strategies, circuit breakers |
| `testing-strategy` | Test pyramid, mocking guidelines, coverage |
| `performance-profiling` | Bottleneck identification, caching, optimization |
| `refactoring-patterns` | Code smells, named transformations, safety rules |
| `documentation-standards` | README structure, comments, changelogs |
| `dependency-audit` | Vulnerability scanning, license compliance |
| `database-migration` | Zero-downtime migrations, rollback strategies |
| `security-review` | OWASP Top 10, auth, input validation |
| `logging-observability` | Structured logging, metrics, tracing |
| `incident-response` | Triage, mitigation, post-incident review |

#### Plugin Development (7)

| Skill | What it teaches Claude |
|-------|----------------------|
| `plugin-structure` | Plugin directory layout, manifest configuration |
| `agent-development` | Agent structure, system prompts, triggering |
| `command-development` | Slash command structure, YAML frontmatter |
| `hook-development` | Event hooks, PreToolUse/PostToolUse/Stop handlers |
| `skill-development` | Skill creation, progressive disclosure |
| `mcp-integration` | Model Context Protocol server configuration |
| `plugin-settings` | Plugin configuration and state files |

#### UI/UX Design (3)

| Skill | What it teaches Claude |
|-------|----------------------|
| `design-patterns` | Proven UI design patterns and component templates |
| `quality-standards` | Quality gates, scoring rubrics, acceptance criteria |
| `design-ui` | Accessibility-first design, anti-vibe-code patterns |

#### Workflow & Productivity (4)

| Skill | What it teaches Claude |
|-------|----------------------|
| `discord` | Discord server management and moderation |
| `start-of-day` | Daily project sync, git check, status report |
| `finish-the-day` | End-of-day wrap-up, commit, push |
| `ui-ux-pro-max` | 50 styles, 21 palettes, 50 font pairings, 9 stacks |

#### Community (2)

| Skill | What it teaches Claude |
|-------|----------------------|
| `community-code-reviewer` | Code review for correctness, security, performance |
| `conventional-commits` | Conventional commit message generation |

### Agents (specialized workers)

#### Core Development (8)

| Agent | Role |
|-------|------|
| `tdd-coach` | Enforces red-green-refactor; won't write code without a failing test |
| `debugger` | Scientific method debugging with hypothesis log |
| `reviewer` | Code review with confidence scoring (only reports >= 80) |
| `architect` | Designs approaches with trade-offs and implementation blueprints |
| `doc-writer` | Generates README, API docs, comments, changelogs |
| `refactorer` | Named refactoring patterns with test verification |
| `security-auditor` | OWASP-focused security review with severity ratings |
| `test-strategist` | Analyzes test suite gaps, balance, and quality |

#### Feature Development (4)

| Agent | Role |
|-------|------|
| `code-architect` | Designs feature architectures with implementation blueprints |
| `code-explorer` | Deep codebase analysis, tracing execution paths |
| `code-reviewer` | Reviews code with confidence-based filtering |
| `code-simplifier` | Simplifies code for clarity and maintainability |

#### Plugin Development (3)

| Agent | Role |
|-------|------|
| `agent-creator` | Guided agent creation workflow |
| `plugin-validator` | Validates plugin structure and components |
| `skill-reviewer` | Reviews skill quality and effectiveness |

#### UI/UX Design (16)

| Agent | Role |
|-------|------|
| `design-reviewer` | Orchestrates parallel critic agents for design review |
| `design-generator` | Creates production-ready HTML, CSS, design tokens |
| `design-researcher` | Sector-specific patterns and competitor analysis |
| `design-orchestrator` | Coordinates multi-agent design workflows |
| `typography-critic` | Font pairing, hierarchy, readability auditing |
| `color-judge` | Contrast, color harmony, emotional impact |
| `spatial-auditor` | Grid, spacing, alignment, whitespace |
| `vibe-code-detector` | Detects generic AI patterns, ensures uniqueness |
| `3d-modeler` | Three.js/R3F photorealistic 3D scenes |
| `shader-artist` | Custom WebGL shaders and visual effects |
| `interaction-designer` | Camera controls, mouse tracking, responsive behaviors |
| `animation-choreographer` | Complex GSAP animations with self-refinement |
| `performance-auditor` | Lighthouse audits and performance analysis |
| `accessibility-critic` | WCAG compliance, keyboard nav, screen readers |
| `brand-alignment-critic` | Brand personality and visual identity |
| `design-performance-critic` | CSS efficiency and asset optimization |

#### Review (2)

| Agent | Role |
|-------|------|
| `design-review` | Comprehensive front-end PR design review |
| `pragmatic-code-review` | Pragmatic code review balancing quality and velocity |

#### Community (1)

| Agent | Role |
|-------|------|
| `community-refactor-agent` | Code refactoring with test verification |

### Commands (slash commands)

#### Core Workflow (10)

| Command | What it does |
|---------|-------------|
| `/tdd` | Start a TDD session |
| `/debug` | Systematic debugging |
| `/review` | Multi-aspect code review |
| `/plan` | Feature planning with architecture design |
| `/document` | Generate documentation |
| `/refactor` | Safe refactoring with test verification |
| `/audit` | Security + dependency + performance audit |
| `/git-flow` | Branch, commit, PR, merge, conflict help |
| `/adr` | Create an Architecture Decision Record |
| `/retro` | Retrospective analysis of recent work |

#### Extended (11)

| Command | What it does |
|---------|-------------|
| `/feature-dev` | Guided feature development workflow |
| `/code-review` | Automated PR code review |
| `/create-plugin` | Guided plugin creation |
| `/design-ui` | Multi-agent UI design generation |
| `/review-ui` | Design quality review pipeline |
| `/design-review` | Front-end PR design review |
| `/pragmatic-review` | Pragmatic code review |
| `/security-scan` | Security-focused code review |
| `/ralph-loop` | Start self-referential iteration loop |
| `/cancel-ralph` | Cancel active Ralph loop |
| `/ralph-help` | Ralph Loop plugin help |

### MCP Integrations

| Server | What it provides |
|--------|-----------------|
| GitHub | Repository management, issues, PRs via MCP |
| Context7 | Up-to-date library documentation lookup |

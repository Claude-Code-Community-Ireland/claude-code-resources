# Vibeworks Library

Developer workflow skills, agents, and commands for Claude Code.

**34 skills** | **34 agents** | **21 commands** | **2 MCP servers** | Covers the full SDLC

## Install

### Option 1: Claude Code Marketplace (recommended)

```
/plugin marketplace add vibeworks/vibeworks-library
/plugin install vibeworks-library
```

### Option 2: npm

```bash
npx vibeworks-library install
```

### Option 3: Manual

```bash
git clone https://github.com/vibeworks/vibeworks-library.git ~/.claude/plugins/vibeworks-library
```

Then in Claude Code:
```
/plugin marketplace add ~/.claude/plugins/vibeworks-library
/plugin install vibeworks-library
```

## What's Inside

### Skills

Skills are reference knowledge that Claude loads automatically based on context. When you're working on TDD, the `tdd-workflow` skill activates. When reviewing code, the `code-review-checklist` kicks in.

| Skill | Purpose |
|-------|---------|
| `tdd-workflow` | Red-green-refactor cycle |
| `debugging-systematic` | Hypothesis-driven debugging |
| `code-review-checklist` | Multi-criteria review with severity classification |
| `git-workflow` | Commit conventions, rebase, conflict resolution |
| `branch-strategy` | Branch naming, Git Flow vs trunk-based |
| `pr-description` | Structured PR templates, stacked PRs |
| `architecture-decision-record` | ADR format and decision documentation |
| `api-design` | REST conventions, status codes, pagination, versioning |
| `error-handling-patterns` | Error types, retry strategies, circuit breakers |
| `testing-strategy` | Test pyramid, mocking guidelines, coverage targets |
| `performance-profiling` | Bottleneck identification, caching, optimization |
| `refactoring-patterns` | Code smells, named transformations, safety rules |
| `documentation-standards` | README structure, comments, changelogs |
| `dependency-audit` | Vulnerability scanning, license compliance |
| `database-migration` | Zero-downtime migrations, rollback strategies |
| `security-review` | OWASP Top 10, auth, input validation |
| `logging-observability` | Structured logging, metrics, distributed tracing |
| `incident-response` | Triage, mitigation, post-incident review |
| `plugin-structure` | Plugin directory layout, manifest configuration |
| `agent-development` | Agent structure, system prompts, triggering |
| `command-development` | Slash command structure, YAML frontmatter |
| `hook-development` | Event hooks, PreToolUse/PostToolUse/Stop handlers |
| `skill-development` | Skill creation, progressive disclosure |
| `mcp-integration` | Model Context Protocol server configuration |
| `plugin-settings` | Plugin configuration and state files |
| `design-patterns` | Proven UI design patterns and component templates |
| `quality-standards` | Quality gates, scoring rubrics, acceptance criteria |
| `design-ui` | Accessibility-first design, anti-vibe-code patterns |
| `discord` | Discord server management and moderation |
| `start-of-day` | Daily project sync, git check, status report |
| `finish-the-day` | End-of-day wrap-up, commit, push |
| `ui-ux-pro-max` | 50 styles, 21 palettes, 50 font pairings, 9 stacks |
| `community-code-reviewer` | Code review for correctness, security, performance |
| `conventional-commits` | Conventional commit message generation |

### Agents

Agents are specialized autonomous workers that Claude delegates to for focused tasks.

| Agent | Role | Model |
|-------|------|-------|
| `tdd-coach` | Enforces red-green-refactor; won't write code without a failing test | Sonnet |
| `debugger` | Scientific method debugging with numbered hypothesis log | Sonnet |
| `reviewer` | Code review with confidence scoring (only reports issues >= 80/100) | Sonnet |
| `architect` | Designs 2-3 approaches with trade-offs, recommends one with blueprint | Sonnet |
| `doc-writer` | Generates README, API docs, comments, changelogs, runbooks | Sonnet |
| `refactorer` | Named refactoring patterns with test verification at each step | Sonnet |
| `security-auditor` | OWASP-focused security review with severity ratings and remediation | Sonnet |
| `test-strategist` | Analyzes test suite gaps, pyramid balance, and quality issues | Sonnet |
| `code-architect` | Designs feature architectures with implementation blueprints | Sonnet |
| `code-explorer` | Deep codebase analysis, tracing execution paths | Sonnet |
| `code-reviewer` | Reviews code with confidence-based filtering | Sonnet |
| `code-simplifier` | Simplifies code for clarity and maintainability | Sonnet |
| `agent-creator` | Guided agent creation workflow | Sonnet |
| `plugin-validator` | Validates plugin structure and components | Sonnet |
| `skill-reviewer` | Reviews skill quality and effectiveness | Sonnet |
| `design-reviewer` | Orchestrates parallel critic agents for design review | Sonnet |
| `design-generator` | Creates production-ready HTML, CSS, design tokens | Sonnet |
| `design-researcher` | Sector-specific patterns and competitor analysis | Sonnet |
| `design-orchestrator` | Coordinates multi-agent design workflows | Sonnet |
| `typography-critic` | Font pairing, hierarchy, readability auditing | Haiku |
| `color-judge` | Contrast, color harmony, emotional impact | Haiku |
| `spatial-auditor` | Grid, spacing, alignment, whitespace | Haiku |
| `vibe-code-detector` | Detects generic AI patterns, ensures uniqueness | Haiku |
| `3d-modeler` | Three.js/R3F photorealistic 3D scenes | Sonnet |
| `shader-artist` | Custom WebGL shaders and visual effects | Sonnet |
| `interaction-designer` | Camera controls, mouse tracking, responsive behaviors | Sonnet |
| `animation-choreographer` | Complex GSAP animations with self-refinement | Sonnet |
| `performance-auditor` | Lighthouse audits and performance analysis | Haiku |
| `accessibility-critic` | WCAG compliance, keyboard nav, screen readers | Haiku |
| `brand-alignment-critic` | Brand personality and visual identity | Haiku |
| `design-performance-critic` | CSS efficiency and asset optimization | Haiku |
| `design-review` | Comprehensive front-end PR design review | Sonnet |
| `pragmatic-code-review` | Pragmatic code review balancing quality and velocity | Opus |
| `community-refactor-agent` | Code refactoring with test verification | Sonnet |

### Commands

Commands are slash commands you invoke directly.

| Command | Description |
|---------|-------------|
| `/tdd [feature]` | Start a TDD session with the tdd-coach agent |
| `/debug [error]` | Launch systematic debugging |
| `/review [scope]` | Multi-aspect code review with confidence filtering |
| `/plan [feature]` | Architecture design and implementation planning |
| `/document [target]` | Generate documentation (README, API, changelog, runbook) |
| `/refactor [target]` | Safe refactoring with test verification at each step |
| `/audit [scope]` | Security + dependency + performance audit |
| `/git-flow [action]` | Git workflow help (branch, commit, pr, merge, conflict) |
| `/adr [topic]` | Create an Architecture Decision Record |
| `/retro [period]` | Retrospective analysis of recent git history |
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

## Usage Examples

```
# Start test-driven development for a new feature
/tdd Add a search endpoint that supports full-text queries with pagination

# Debug a failing test
/debug TypeError: Cannot read property 'id' of undefined in UserService.getProfile

# Review your uncommitted changes
/review

# Plan a new feature with architecture design
/plan Add real-time notifications using WebSocket connections

# Generate API documentation
/document api

# Run a full security audit
/audit security

# Create a properly structured branch and PR
/git-flow branch
/git-flow pr
```

## How It Works

- **Skills** load automatically when contextually relevant (~100 tokens for metadata scanning, full content < 5K tokens when activated)
- **Agents** are spawned by commands or by Claude when it recognizes a task that matches an agent's description
- **Commands** are user-invoked via slash commands and orchestrate agents + skills for complete workflows
- **Hooks** provide gentle reminders (e.g., "tests were not run after editing source files")

## Customization

Override any skill by creating a same-named skill in your project's `.claude/skills/` directory. Project-level skills take precedence over plugin skills.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-skill`
3. Add your skill, agent, or command following existing patterns
4. Run validation: `bash tests/validate-skills.sh`
5. Open a PR with a description of what the new component does

## License

MIT

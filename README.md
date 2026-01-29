# Vibeworks Library

Developer workflow skills, agents, and commands for Claude Code.

**18 skills** | **8 agents** | **10 commands** | Covers the full SDLC

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

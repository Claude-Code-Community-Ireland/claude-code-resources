# Vibeworks Library

Complete developer workflow toolkit for Claude Code.

18 skills, 8 agents, and 10 commands covering the full software development lifecycle.

## What's Included

### Skills (auto-activated by context)

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

### Agents (specialized workers)

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

### Commands (slash commands)

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

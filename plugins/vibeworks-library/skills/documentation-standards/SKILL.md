---
name: documentation-standards
description: Documentation best practices — README structure, inline code comments, API docs, changelogs, and technical writing principles. Reference when writing any documentation.
---

# Documentation Standards

## README Template

Every project README should follow this structure. Omit sections that genuinely do not apply, but default to including them.

```markdown
# Project Name

[![Build Status](badge-url)][ci-link]
[![Coverage](badge-url)][coverage-link]
[![npm version](badge-url)][npm-link]
[![License](badge-url)][license-link]

One-paragraph description of what this project does, who it is for,
and why it exists. Lead with the value proposition, not the technology.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14

### Steps

npm install project-name

## Quick Start

Minimal working example — no more than 10 lines — that gets the
reader from zero to "it works."

## Usage

### Common Use Cases

Organize by task, not by API surface. Show the most common
workflows first.

### Advanced Usage

Edge cases, complex configurations, integration patterns.

## API Reference

Link to generated docs or inline the reference here.

## Configuration

| Variable        | Default   | Description                  |
|-----------------|-----------|------------------------------|
| `PORT`          | `3000`    | Server listening port        |
| `DATABASE_URL`  | —         | PostgreSQL connection string |

## Architecture

Brief overview or link to architecture docs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — see LICENSE file for details.
```

### README Checklist

- [ ] Title matches the package/repo name exactly
- [ ] Description answers "what," "who," and "why" in one paragraph
- [ ] Installation steps are copy-pasteable and tested on a clean machine
- [ ] Quick Start example actually works — verify before merging
- [ ] Badges are live and point to correct URLs
- [ ] All links resolve (no 404s)
- [ ] Configuration table covers every environment variable
- [ ] License is explicitly stated and matches the LICENSE file

---

## Inline Code Comments

### When to Comment

Comment the **why**, never the **what**. If you feel the need to explain what code does, refactor the code to be self-explanatory first.

#### Good Reasons to Comment

```python
# We retry up to 3 times because the upstream API occasionally
# returns 503 during deployments (see incident #247).
for attempt in range(3):
    response = call_api()
    if response.status != 503:
        break

# Sorting by created_at DESC intentionally — the UI shows newest
# first and re-sorting client-side causes a visible flicker.
queryset = queryset.order_by("-created_at")

# HACK: The PDF library misreports page count for encrypted files.
# Remove this workaround when upstream fixes #892.
page_count = max(pdf.page_count, 1)
```

#### Bad Comments — Remove or Refactor

```python
# Increment counter
counter += 1  # REMOVE: the code says this already

# Check if user is admin
if user.role == "admin":  # REMOVE: rename to is_admin check

# This function gets the user
def get_user(id):  # REMOVE: the function name says this
    ...
```

### Comment Types and When to Use Them

| Type      | Use When                                                    |
|-----------|-------------------------------------------------------------|
| `TODO`    | Known work remains; include a ticket number                 |
| `FIXME`   | Known bug or fragile code; include a ticket number          |
| `HACK`    | Intentional shortcut with known trade-offs; explain why     |
| `NOTE`    | Non-obvious design decision that future readers need        |
| `WARNING` | Code that will break if assumptions change                  |

Always attach a ticket or issue number to `TODO` and `FIXME` so they can be tracked and cleaned up.

---

## JSDoc and Docstring Conventions

### JavaScript / TypeScript (JSDoc)

```typescript
/**
 * Calculate the compounded interest for a given principal.
 *
 * @param principal - Initial investment amount in cents
 * @param rate - Annual interest rate as a decimal (e.g., 0.05 for 5%)
 * @param periods - Number of compounding periods
 * @returns The total value after compounding, in cents
 * @throws {RangeError} If rate is negative or periods is less than 1
 *
 * @example
 * ```ts
 * const total = compoundInterest(10000, 0.05, 12);
 * // => 10511
 * ```
 */
function compoundInterest(
  principal: number,
  rate: number,
  periods: number
): number {
  // ...
}
```

### Python (Google Style Docstrings)

```python
def compound_interest(principal: int, rate: float, periods: int) -> int:
    """Calculate the compounded interest for a given principal.

    Args:
        principal: Initial investment amount in cents.
        rate: Annual interest rate as a decimal (e.g., 0.05 for 5%).
        periods: Number of compounding periods.

    Returns:
        The total value after compounding, in cents.

    Raises:
        ValueError: If rate is negative or periods is less than 1.

    Example:
        >>> compound_interest(10000, 0.05, 12)
        10511
    """
    ...
```

### Docstring Checklist

- [ ] First line is a concise imperative summary (e.g., "Calculate..." not "This function calculates...")
- [ ] All parameters documented with types and constraints
- [ ] Return value described, including edge cases (what does it return on empty input?)
- [ ] Exceptions/errors documented
- [ ] At least one usage example included
- [ ] Units specified where applicable (cents, milliseconds, bytes)

---

## Changelog Format

Follow [Keep a Changelog](https://keepachangelog.com/) conventions.

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- OAuth2 PKCE flow for single-page applications (#452)

### Changed
- Rate limiter now uses sliding window algorithm (#448)

### Deprecated
- Basic auth support — will be removed in v3.0 (#460)

### Fixed
- Connection pool exhaustion under sustained load (#455)

## [2.1.0] - 2025-03-15

### Added
- Webhook retry with exponential backoff (#430)

### Security
- Upgrade jsonwebtoken to 9.0.1 to fix CVE-2023-XXXXX (#441)
```

### Changelog Categories (in order)

1. **Added** — new features
2. **Changed** — changes to existing functionality
3. **Deprecated** — features that will be removed
4. **Removed** — features that have been removed
5. **Fixed** — bug fixes
6. **Security** — vulnerability patches

### Changelog Rules

- Write entries from the user's perspective, not the developer's
- Link every entry to an issue or PR number
- Use past tense for Fixed ("Fixed crash when...") and present tense for behavioral descriptions ("Rate limiter now uses...")
- Group the Unreleased section at the top
- Never delete old entries — the log is append-only

---

## Architecture Documentation

### C4 Model Levels

Document architecture at four levels of abstraction.

| Level      | Audience             | Shows                                     |
|------------|----------------------|--------------------------------------------|
| Context    | Everyone             | System and its external actors              |
| Container  | Technical leads      | Applications, databases, message queues     |
| Component  | Developers           | Major components within a container         |
| Code       | Individual devs      | Classes, modules (usually auto-generated)   |

### Architecture Decision Records (ADRs)

Use ADRs to capture significant design decisions.

```markdown
# ADR-007: Use PostgreSQL for primary data store

## Status
Accepted

## Context
We need a relational database that supports JSONB columns for
semi-structured metadata, strong consistency, and row-level security.

## Decision
We will use PostgreSQL 15+ as our primary data store.

## Consequences
- Gain: JSONB support, mature ecosystem, RLS for multi-tenancy
- Cost: Team must learn PostgreSQL-specific features
- Risk: Vendor lock-in on PG-specific extensions (mitigated by
  limiting use of pg_trgm to search module only)
```

### Diagram Guidelines

- Use text-based diagram tools (Mermaid, PlantUML, D2) so diagrams live in version control
- Every diagram must have a title and a date or version
- Prefer sequence diagrams for workflows, C4 diagrams for architecture
- Keep diagrams focused — one diagram per concern

---

## Runbook Format

Runbooks are step-by-step guides for operational tasks. They should be executable by someone unfamiliar with the system under stress.

```markdown
# Runbook: Database Failover

## When to Use
- Primary database is unreachable for more than 60 seconds
- Monitoring alert: `db-primary-unreachable` fires

## Prerequisites
- Access to AWS Console or `aws` CLI with admin credentials
- VPN connected to production network

## Steps

1. Verify the primary is truly down:
   ```bash
   pg_isready -h primary.db.internal -p 5432
   ```

2. Promote the replica:
   ```bash
   aws rds failover-db-cluster --db-cluster-identifier prod-cluster
   ```

3. Verify the new primary is accepting writes:
   ```bash
   psql -h primary.db.internal -c "SELECT pg_is_in_recovery();"
   # Expected: f (false)
   ```

4. Update the application config if not using DNS-based routing.

## Rollback
- No rollback needed — the old primary becomes the new replica
  automatically after recovery.

## Escalation
- If failover does not complete in 10 minutes, page the DBA on-call.
```

### Runbook Checklist

- [ ] Title clearly states the operational task
- [ ] "When to Use" section ties to specific alerts or symptoms
- [ ] Prerequisites list all access, tools, and permissions needed
- [ ] Every step includes the exact command to run and expected output
- [ ] Rollback procedure is documented
- [ ] Escalation path is defined with specific contacts or rotations
- [ ] Tested by someone who did not write it

---

## Technical Writing Principles

### Audience Awareness

Before writing, answer these questions:
- Who will read this? (New hire? Senior engineer? External user?)
- What do they already know?
- What action should they take after reading?

### Active Voice

| Passive (avoid)                     | Active (prefer)                     |
|-------------------------------------|--------------------------------------|
| The request is validated by...      | The middleware validates the request |
| An error will be thrown if...       | The function throws an error if...   |
| The configuration can be changed... | Change the configuration by...       |

### Concrete Examples Over Abstract Descriptions

Bad: "The function accepts various configuration options."

Good: "Pass `{ retries: 3, timeout: 5000 }` to retry failed requests up to three times with a five-second timeout."

### Progressive Disclosure

Structure documentation in layers:
1. **Quick Start** — Get running in under 2 minutes
2. **Guides** — Task-oriented walkthroughs for common use cases
3. **Reference** — Exhaustive API surface, every option documented
4. **Internals** — How it works under the hood, for contributors

### Formatting Rules

- Use numbered lists for sequential steps
- Use bullet lists for unordered sets
- Use tables for comparing options or listing configuration
- Use code blocks for anything the reader should type or read verbatim
- Use admonitions (Note, Warning, Tip) sparingly — if everything is a warning, nothing is
- Keep paragraphs to 3-4 sentences maximum
- One idea per paragraph

### Review Checklist for Any Documentation

- [ ] Can a new team member follow this without asking questions?
- [ ] Are all code examples tested and working?
- [ ] Are technical terms defined on first use?
- [ ] Does every heading use sentence case?
- [ ] Are links to external resources still live?
- [ ] Is the document dated or versioned?
- [ ] Has someone other than the author reviewed it?

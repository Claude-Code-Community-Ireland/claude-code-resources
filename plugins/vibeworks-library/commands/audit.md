---
description: Run a comprehensive audit covering security, dependencies, performance, and code quality
argument-hint: "[security | deps | perf | all] (defaults to all)"
allowed-tools: Read, Bash, Glob, Grep, Task
---

# Audit Workflow

You are running a comprehensive audit of the codebase.

## Steps

1. **Determine scope**: Read `$ARGUMENTS` to select audit type:
   - `security` — OWASP vulnerabilities, auth, injection, secrets
   - `deps` — Dependency vulnerabilities, outdated packages, license compliance
   - `perf` — Performance bottlenecks, N+1 queries, bundle size
   - `all` (default) — Run all audit types

2. **Run audits based on scope**:

   **Security audit** — Use the Task tool to spawn the `security-auditor` agent:
   > Run a full security audit of this codebase. Check OWASP Top 10, authentication, authorization, input validation, secrets exposure, and dependency vulnerabilities. Provide severity-rated findings with remediation steps.

   **Dependency audit** — Run available package audit tools:
   - Detect package manager (npm, yarn, pip, cargo, go)
   - Run the appropriate audit command (`npm audit`, `pip-audit`, `cargo audit`, etc.)
   - Check for outdated packages
   - Scan licenses for compliance

   **Performance audit** — Analyze code for common performance issues:
   - Look for N+1 query patterns
   - Check for missing database indexes on queried fields
   - Identify unbounded data fetching (no pagination/limits)
   - Check for memory leak patterns (uncleaned listeners, subscriptions)
   - Analyze bundle size if applicable

3. **Synthesize findings**: Merge all results into a single prioritized report:

   ```
   ## Audit Report

   ### Critical (fix immediately)
   ...
   ### High (fix this sprint)
   ...
   ### Medium (plan to address)
   ...
   ### Low (consider improving)
   ...

   ### Summary
   X critical, Y high, Z medium, W low findings.
   ```

4. **Suggest next steps**: Recommend the top 3 actions to take based on findings.

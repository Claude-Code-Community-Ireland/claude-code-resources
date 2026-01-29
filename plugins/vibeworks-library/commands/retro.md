---
description: Analyze recent work for a retrospective — what went well, what could improve, action items
argument-hint: "[today | this-week | this-sprint] (defaults to this-week)"
allowed-tools: Read, Bash, Glob, Grep
---

# Retrospective Workflow

You are generating a retrospective analysis of recent development work.

## Steps

1. **Determine time period**: Read `$ARGUMENTS`:
   - `today` — Last 24 hours
   - `this-week` (default) — Last 7 days
   - `this-sprint` — Last 14 days
   - Or a specific date range

2. **Gather data**: Analyze the git history for the period:
   ```bash
   git log --since="<period>" --oneline --stat
   git log --since="<period>" --format="%h %s" --no-merges
   git shortlog --since="<period>" -sn
   ```

3. **Analyze patterns**:
   - **Commit types**: Count feat, fix, refactor, test, docs, chore commits
   - **Hotspots**: Files changed most frequently (potential complexity/instability)
   - **Churn**: Files with many additions AND deletions (rework indicator)
   - **Test coverage changes**: New test files added vs source files added
   - **Bug fix ratio**: Fixes vs features (high fix ratio = quality issues)
   - **PR metrics**: If available, check average PR size and review time

4. **Generate the retrospective**:

   ```markdown
   ## Retrospective: [period]

   ### Summary
   X commits, Y files changed, Z lines added, W lines removed

   ### What Went Well
   - [Completed features, good patterns observed, test improvements]

   ### What Could Improve
   - [Recurring bug patterns, high-churn files, missing tests, tech debt]

   ### Metrics
   | Metric | Value |
   |--------|-------|
   | Features added | X |
   | Bugs fixed | Y |
   | Tests added | Z |
   | Hotspot files | [list] |
   | Fix/feature ratio | X:Y |

   ### Action Items
   - [ ] [Specific, actionable improvement with owner]
   - [ ] [Specific, actionable improvement with owner]
   - [ ] [Specific, actionable improvement with owner]
   ```

5. **Present**: Show the retrospective and highlight the top 3 action items.

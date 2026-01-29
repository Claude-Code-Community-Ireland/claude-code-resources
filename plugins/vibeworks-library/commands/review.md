---
description: Code review current changes with multi-aspect analysis and confidence scoring
argument-hint: "[file path, branch, or PR number] (defaults to uncommitted changes)"
allowed-tools: Read, Bash, Glob, Grep, Task
---

# Code Review Workflow

You are conducting a comprehensive code review.

## Steps

1. **Determine scope**: Check `$ARGUMENTS` for a specific file, branch, or PR number.
   - If empty: Review uncommitted changes (`git diff` + `git diff --staged`)
   - If a file path: Review that specific file
   - If a branch: Review `git diff main...<branch>`
   - If a PR number: Use `gh pr diff <number>`

2. **Gather context**: Read project conventions from CLAUDE.md, .editorconfig, linter configs, and existing code patterns.

3. **Launch the reviewer**: Use the Task tool to spawn the `reviewer` agent with:

   > Review the following code changes:
   > Scope: [determined scope]
   > Project conventions: [summary from CLAUDE.md]
   > Apply the full review checklist: correctness, security, readability, performance, testing, maintainability.
   > Only report findings with confidence >= 80.
   > Provide file:line references and concrete fix suggestions.

4. **Summarize**: Present the review findings organized by severity. Include a summary count of issues by category.

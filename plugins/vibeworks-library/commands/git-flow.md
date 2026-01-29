---
description: Git workflow assistance — create branches, write commit messages, prepare PRs, resolve conflicts
argument-hint: "[branch | commit | pr | merge | conflict] action to perform"
allowed-tools: Read, Bash, Glob, Grep, Task
---

# Git Flow Workflow

You are providing contextual git workflow assistance.

## Steps

1. **Detect current state**: Run `git status`, `git branch`, and `git log --oneline -5` to understand the current git context.

2. **Determine action** from `$ARGUMENTS`:

### `branch` — Create a properly named branch
- Ask for the purpose (feature, fix, hotfix, chore, docs, refactor)
- Ask for a short description or ticket number
- Create the branch with proper naming convention: `<type>/<ticket>-<description>`
- Example: `feature/PROJ-123-user-search`

### `commit` — Stage and commit with conventional message
- Run `git diff` and `git diff --staged` to see changes
- Analyze the changes to determine the commit type (feat, fix, refactor, docs, test, chore)
- Stage relevant files (prefer specific files over `git add -A`)
- Write a conventional commit message: `type(scope): description`
- Show the user the proposed commit for approval before executing

### `pr` — Create a pull request
- Analyze all commits on the current branch vs main
- Run `git diff main...HEAD` to understand the full change
- Generate a structured PR description (Summary, Motivation, Changes, Test Plan)
- Create the PR using `gh pr create`

### `merge` — Merge a branch safely
- Check if the branch is up to date with the target
- Run tests before merging
- Merge using the project's convention (squash, merge commit, or rebase)
- Clean up the branch after merge

### `conflict` — Resolve merge conflicts
- Identify conflicting files with `git diff --name-only --diff-filter=U`
- For each conflicting file:
  - Read both versions and understand the intent of each change
  - Propose a resolution that preserves both intents
  - Show the resolution to the user for approval
- After all conflicts are resolved, run tests to verify

3. **Execute**: Carry out the chosen action with the user's approval.

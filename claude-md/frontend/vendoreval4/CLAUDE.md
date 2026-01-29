# Project Context: VendorEval3

This project uses Spec-Driven Development with Beads for issue tracking. Follow the workflows and guidelines defined below.

## Project Structure

- `memory/constitution.md` - Project principles and development guidelines
- `specs/` - Feature specifications and implementation plans
- `templates/` - Templates for specs, plans, and tasks
- `scripts/` - Helper scripts for the development workflow
- `.beads/` - Beads issue tracking database

---

# Communication Guidelines

## BE DIRECT AND HONEST

**Critical Rules for AI Assistants:**

- **Never build a tool you don't know how to build properly**
- **Never build a subpar alternative and present it as equivalent to what was requested**
- **Ask clarifying questions upfront before starting implementation**
- **Voice concerns about feasibility, complexity, or technical limitations immediately**
- **If something won't work as specified, say so explicitly and explain why**
- **Propose alternatives only after explaining why the original approach won't work**

**Communication Principles:**

1. **Transparency First** - If you're unsure, say so
2. **No False Confidence** - Don't fake expertise in unfamiliar areas
3. **Explicit Trade-offs** - Always explain what's being sacrificed in alternative approaches
4. **Upfront Honesty** - Surface problems early, not after building the wrong thing
5. **Question Assumptions** - Challenge unclear or problematic requirements before proceeding

---

# MANDATORY MESSAGE START PROTOCOL

**CRITICAL: Before responding to EVERY user message, AI assistants MUST:**

1. **Check Beads for ready work:**
   ```bash
   bd ready --json
   ```

2. **Check current project state:**
   ```bash
   bd stats --json
   ```

3. **Verify SpecKit workflow compliance:**
   - Does `memory/constitution.md` exist?
   - Does a spec exist in `specs/` directory?
   - Does current spec have `plan.md`?
   - Does current spec have `tasks.md`?

4. **CHECK IF VALIDATION IS REQUIRED:**
   - Have you just completed a phase of work?
   - Is there a "VALIDATE Phase X" task in Beads?
   - If YES: **STOP and run validation tests BEFORE proceeding to next phase**
   - If validation fails: **Fix issues before continuing**
   - Validation tasks are MANDATORY BLOCKERS - cannot be skipped

5. **Report findings before suggesting any action**

6. **NEVER skip SpecKit workflow steps:**
   - No "fast track" options
   - No "just build it" suggestions
   - No "we can skip X because Y exists"
   - Always follow: constitution → specify → plan → tasks → implement → **VALIDATE**
   - Every phase MUST be validated before starting the next phase

**If anything is missing from the workflow, start there. Do not proceed to later steps.**

**This check happens EVERY message, not just at session start.**

---

# Context7 Usage Guidelines

**ALWAYS use Context7 when you need:**

- Code generation for any library or framework
- Setup or configuration steps for tools
- Library/API documentation
- Implementation examples or patterns
- Version-specific syntax or features

**Automatic Context7 Usage:**

The AI assistant should **automatically** use Context7 MCP tools without being explicitly asked when:

1. **Implementing features** with specific libraries (React, FastAPI, SQLAlchemy, etc.)
2. **Configuring tools** (Docker, nginx, CI/CD pipelines, etc.)
3. **Using APIs** that require documentation lookup
4. **Debugging library-specific issues**
5. **Writing code** that depends on external dependencies

**Context7 Workflow:**

```bash
# 1. Resolve library ID first
context7:resolve-library-id with libraryName

# 2. Get documentation for that library
context7:get-library-docs with context7CompatibleLibraryID
```

**Example Triggers:**

- "Implement user authentication with FastAPI" → Use Context7 for FastAPI docs
- "Set up Docker compose file" → Use Context7 for Docker Compose syntax
- "Create React component with hooks" → Use Context7 for React documentation
- "Configure pytest for testing" → Use Context7 for pytest setup

**Never guess at library APIs or configuration syntax when Context7 can provide accurate, up-to-date documentation.**

---

# AI Assistant Behavioral Rules

**These rules apply to AI assistants working on this project. They define HOW to work, complementing the constitution which defines WHAT to build.**

## Required Tools and Workflow

### Use Context7 for Code Generation

- **ALWAYS** use Context7 when generating code for React, Vite, Tailwind, jsPDF, or any external library
- Never guess at library APIs or syntax
- Verify API signatures and patterns against current documentation
- Use Context7 to check for breaking changes between versions

### Follow SpecKit Workflow Without Skipping Steps

The mandatory workflow sequence is:

1. Constitution → Define principles (.specify/memory/constitution.md)
2. Specify → Define WHAT to build (specs/NNN-feature-name/spec.md)
3. Plan → Define HOW to build (specs/NNN-feature-name/plan.md)
4. Tasks → Break down implementation (specs/NNN-feature-name/tasks.md)
5. Implement → Execute tasks systematically

**Never suggest shortcuts or "fast track" options.** If a step is missing, start there.

### Track All Work in Beads (No Markdown Todos)

- Use Beads for issue tracking, NOT TodoWrite or markdown checklists
- File discovered issues immediately: `bd create "Issue description" -t TYPE -p PRIORITY`
- Update status as you work: `bd update ISSUE_ID --status in_progress`
- Close completed work: `bd close ISSUE_ID --reason "Completion details"`
- Link related work: `bd dep add FROM_ID TO_ID --type discovered-from`

### Git Workflow Standards

- **Meaningful commit messages**: Start with verb (Add, Fix, Update, Refactor)
- **Feature branches**: Create from main, name as `NNN-feature-name` (SpecKit manages this)
- **No force-push to main**: Revert mistakes, don't rewrite history
- **Quality checks before commit**: Linting, type checking, tests must pass

---

# SpecKit Commands

Spec-Driven Development workflow for building features systematically.

## /speckit.constitution

**Purpose:** Create or update the project constitution that defines governing principles and development guidelines.

**Usage:**
```
/speckit.constitution [description of principles to include]
```

**What it does:**
- Reads the constitution template from `templates/constitution-template.md`
- Creates or updates `memory/constitution.md`
- Establishes foundational principles that guide all subsequent development
- Defines coding standards, testing requirements, and quality expectations

**Example:**
```
/speckit.constitution Create principles focused on code quality, comprehensive testing, user experience consistency, performance optimization, and security best practices
```

**When to use:**
- At project initialization (first step)
- When team values or standards change
- When adding new development principles

---

## /speckit.specify

**Purpose:** Create a feature specification focusing on **WHAT** to build and **WHY**, without technical implementation details.

**Usage:**
```
/speckit.specify [description of what to build]
```

**What it does:**
- Creates a new feature directory under `specs/` with incremental numbering
- Generates `spec.md` based on `templates/spec-template.md`
- Documents user stories, requirements, and success criteria
- Focuses on business value and user outcomes, not technical solutions

**Example:**
```
/speckit.specify Build a vendor evaluation dashboard that allows users to compare multiple vendors across standardized criteria, track evaluation progress, and generate comparison reports
```

**Best practices:**
- Focus on user needs and business outcomes
- Avoid mentioning specific technologies
- Describe the problem clearly before jumping to solutions
- Include acceptance criteria

**When to use:**
- Starting a new feature
- Documenting a significant change
- Before technical planning

---

## /speckit.plan

**Purpose:** Generate a technical implementation plan based on your spec, including tech stack and architecture decisions.

**Usage:**
```
/speckit.plan [technical requirements and tech stack choices]
```

**What it does:**
- Reads the current spec.md
- Creates `plan.md` with detailed implementation strategy
- Generates supporting documentation:
  - `data-model.md` - Database schemas and data structures
  - `contracts/api-spec.json` - API endpoints and contracts
  - `research.md` - Technical research and decisions
- Uses Context7 to verify library compatibility and best practices

**Example:**
```
/speckit.plan Use FastAPI backend with SQLAlchemy ORM, PostgreSQL database, React frontend with TypeScript, Material-UI components, and pytest for testing. Deploy with Docker Compose.
```

**What to specify:**
- Backend framework and language
- Database choice
- Frontend framework
- Testing approach
- Deployment strategy
- External services or APIs

**When to use:**
- After completing the spec
- When you're ready to make technical decisions
- Before breaking down into tasks

---

## /speckit.tasks

**Purpose:** Break down the implementation plan into ordered, actionable tasks with dependencies.

**Usage:**
```
/speckit.tasks
```

**What it does:**
- Reads `plan.md` and implementation details
- Generates `tasks.md` with structured task breakdown
- Organizes tasks by user story or feature area
- Identifies dependencies between tasks
- Marks tasks that can run in parallel with `[P]`
- Specifies file paths for each task
- Orders tasks to respect dependencies (models → services → endpoints → tests)

**Output structure:**
```markdown
## User Story 1: [Description]

### Phase 1: Foundation
- [ ] Task 1: Setup project structure (path/to/file.py)
- [ ] Task 2: Create database models (path/to/models.py)

### Phase 2: Core Implementation
- [ ] [P] Task 3: Implement service layer (path/to/service.py)
- [ ] [P] Task 4: Create API endpoints (path/to/routes.py)

### Checkpoint: Validate Phase 2
- Test endpoints manually
- Verify database operations
```

**When to use:**
- After completing the plan
- Before implementation
- When you need a clear execution roadmap

---

## /speckit.implement

**Purpose:** Execute the implementation plan by running through the task breakdown.

**Usage:**
```
/speckit.implement
```

**What it does:**
- Validates prerequisites exist (constitution, spec, plan, tasks)
- Parses `tasks.md` for task list
- Executes tasks in order, respecting dependencies
- Runs parallel tasks concurrently when marked with `[P]`
- Follows TDD approach if specified in tasks
- Provides progress updates after each task
- Handles errors and pauses for manual intervention when needed

**Prerequisites:**
- Constitution must exist
- Spec must be complete
- Plan must be validated
- Tasks must be generated

**What to expect:**
- Systematic task-by-task implementation
- Use of Context7 for accurate library usage
- Test execution at checkpoints
- Progress reporting

**When to use:**
- After validating the plan and tasks
- When ready to build the feature
- For systematic, step-by-step implementation

---

## /speckit.checklist

**Purpose:** Generate quality checklists to validate requirements completeness, clarity, and consistency.

**Usage:**
```
/speckit.checklist
```

**What it does:**
- Reviews current spec.md and plan.md
- Generates validation checklist covering:
  - Requirements completeness
  - Clarity of specifications
  - Technical feasibility
  - Missing edge cases
  - Security considerations
  - Performance implications
- Identifies gaps or ambiguities
- Suggests areas needing clarification

**When to use:**
- After creating the spec but before planning
- After creating the plan but before tasks
- When reviewing existing specifications
- When something feels incomplete or unclear

---

## /speckit.analyze

**Purpose:** Generate cross-artifact consistency and alignment report.

**Usage:**
```
/speckit.analyze
```

**What it does:**
- Analyzes spec.md, plan.md, and tasks.md for consistency
- Identifies misalignments between specification and implementation plan
- Checks if tasks cover all requirements from the spec
- Flags requirements that aren't addressed in the plan
- Detects over-engineering (plan includes features not in spec)
- Validates that technical choices align with constitution principles
- Suggests improvements and corrections

**When to use:**
- After completing plan, before generating tasks
- When specs and plans were created separately or at different times
- Before implementation to catch issues early
- During code review to validate implementation matches plan

---

## /speckit.clarify

**Purpose:** Ask structured questions to de-risk ambiguous areas before planning.

**Usage:**
```
/speckit.clarify
```

**What it does:**
- Analyzes current spec.md for ambiguities
- Identifies unclear requirements
- Generates specific, targeted questions about:
  - Edge cases not covered
  - Behavioral expectations
  - Performance requirements
  - Error handling approaches
  - User experience details
- Helps de-risk before technical decisions are made

**Example questions generated:**
- "How should the system handle duplicate vendor names?"
- "What's the maximum number of vendors that can be compared simultaneously?"
- "Should evaluation scores be recalculated automatically or manually triggered?"

**When to use:**
- After initial spec, before planning
- When requirements seem incomplete
- Before making technical commitments
- When stakeholders haven't clarified details

---

# SpecKit Workflow

**Recommended sequence:**

1. **Constitution** → Define principles (`/speckit.constitution`)
2. **Specify** → Define what to build (`/speckit.specify`)
3. **Clarify** → De-risk ambiguities (`/speckit.clarify`) [optional but recommended]
4. **Plan** → Define how to build it (`/speckit.plan`)
5. **Checklist** → Validate completeness (`/speckit.checklist`) [optional but recommended]
6. **Analyze** → Check consistency (`/speckit.analyze`) [optional but recommended]
7. **Tasks** → Break down into actionable tasks (`/speckit.tasks`)
8. **Implement** → Execute the plan (`/speckit.implement`)

**Quality gates:**
- Don't plan without a clear spec
- Don't create tasks without a validated plan
- Don't implement without structured tasks
- Use clarify/analyze/checklist liberally to catch issues early

---

# Beads Issue Tracking

This project uses **Beads** for issue tracking instead of Markdown todo lists. Beads provides dependency-aware task management with persistent memory across sessions.

## Why Beads?

- **Dependency tracking** - Automatically finds ready work (no blockers)
- **Agent memory** - Agents can pick up where they left off across sessions
- **Git-versioned** - Issues are stored in `.beads/*.jsonl` and synced via git
- **Automatic discovery** - Agents file issues as they discover work
- **Audit trail** - Every change is logged

## Beads Workflow Integration

### During SpecKit Implementation

1. **After `/speckit.tasks`** - Import generated tasks into Beads for tracking
2. **During `/speckit.implement`** - File discovered issues as you go
3. **Between sessions** - Use `bd ready` to find next work
4. **Post-launch** - Track bugs, tech debt, and enhancements

### Interaction with SpecKit

- **SpecKit** creates the plan and initial task breakdown
- **Beads** tracks execution, discovered work, and ongoing maintenance
- **SpecKit tasks** are imported into Beads for dependency tracking
- **Beads issues** capture reality as implementation unfolds

## Important Technical Note

**Use bash commands for Beads, not MCP tools**, due to current environment issues with the MCP server. The bash commands are more reliable and provide full functionality.

## Auto-Approved Beads Commands

The following Beads commands should run without requiring user approval for each execution:

```bash
# Read-only commands (always safe)
bd ready --json
bd stats --json
bd list --json
bd list --status open --json
bd list --status in_progress --json
bd show * --json
bd blocked --json
bd dep tree *

# Write commands for tracking work
bd create * --json
bd update * --json
bd close * --json
bd dep add * --type *
```

These commands are essential for the development workflow and should execute automatically without approval prompts.

---

# Beads Commands Reference

## Finding Ready Work

### bd ready

**Purpose:** Find issues that are ready to work on (no open blockers).

**Usage:**
```bash
bd ready --json
```

**Flags:**
- `--json` - Output in JSON format (recommended for agents)
- `--limit N` - Limit results to N issues

**When to use:**
- At the start of every work session
- When finishing a task and looking for next work
- When an agent needs to orient itself

**Example:**
```bash
bd ready --json | jq '.[0]'  # Get first ready issue
```

---

## Creating Issues

### bd create

**Purpose:** Create a new issue or import multiple issues from a file.

**Usage:**
```bash
bd create "Issue title" -t TYPE -p PRIORITY [flags]
bd create -f tasks.md  # Import from markdown file
```

**Types:**
- `feature` - New functionality
- `bug` - Something broken
- `task` - Work item
- `improvement` - Enhancement to existing feature
- `epic` - Large feature spanning multiple issues

**Priorities:**
- `0` - Critical (P0)
- `1` - High (P1)
- `2` - Medium (P2)
- `3` - Low (P3)

**Flags:**
- `-t, --type` - Issue type
- `-p, --priority` - Priority level
- `-d, --description` - Issue description
- `-l, --labels` - Comma-separated labels
- `-g, --group` - Group/epic ID
- `--json` - Output in JSON format
- `-f, --file` - Import from markdown file

**Examples:**
```bash
# Create a bug
bd create "Login timeout not configurable" -t bug -p 1 --json

# Create a feature with description
bd create "Add CSV export" -t feature -p 2 -d "Users need to export vendor data to CSV format"

# Import tasks from SpecKit
bd create -f specs/001-feature/tasks.md

# Create an epic
bd create "User Authentication System" -t epic -p 0

# Create task under epic
bd create "Implement JWT tokens" -t task -p 0 -g <epic-id>
```

**When to use:**
- When discovering new work during implementation
- After generating tasks with `/speckit.tasks`
- When bugs are found
- When tech debt is identified

---

## Viewing Issues

### bd list

**Purpose:** List all issues with optional filtering.

**Usage:**
```bash
bd list [flags]
```

**Flags:**
- `--status STATUS` - Filter by status (open, in_progress, closed)
- `--type TYPE` - Filter by type
- `--priority N` - Filter by priority
- `--labels LABELS` - Filter by labels
- `--json` - Output in JSON format
- `--limit N` - Limit results

**Examples:**
```bash
# List all open issues
bd list --status open --json

# List high-priority bugs
bd list --type bug --priority 1 --json

# List in-progress work
bd list --status in_progress
```

---

### bd show

**Purpose:** Show detailed information about a specific issue.

**Usage:**
```bash
bd show <issue-id> [flags]
```

**Flags:**
- `--json` - Output in JSON format

**Example:**
```bash
bd show 42 --json
```

---

### bd blocked

**Purpose:** Show issues that are blocked by open dependencies.

**Usage:**
```bash
bd blocked [flags]
```

**Flags:**
- `--json` - Output in JSON format

**When to use:**
- To see what's waiting on other work
- To understand dependency chains
- To prioritize unblocking work

---

## Managing Dependencies

### bd dep add

**Purpose:** Add a dependency between two issues.

**Usage:**
```bash
bd dep add <from-id> <to-id> --type TYPE
```

**Dependency Types:**
- `blocks` - FROM blocks TO (TO can't start until FROM is done)
- `related` - Issues are related but not blocking
- `parent` - FROM is parent of TO (epic/subtask relationship)
- `discovered-from` - TO was discovered while working on FROM

**Examples:**
```bash
# Database schema blocks API implementation
bd dep add 10 20 --type blocks

# Mark related issues
bd dep add 15 16 --type related

# Link subtask to epic
bd dep add 5 42 --type parent

# Track discovered work
bd dep add 30 31 --type discovered-from
```

**Critical rule:** Only `blocks` dependencies affect ready work detection. Use `related` for informational links.

---

### bd dep remove

**Purpose:** Remove a dependency between issues.

**Usage:**
```bash
bd dep remove <from-id> <to-id>
```

**Example:**
```bash
bd dep remove 10 20
```

---

### bd dep tree

**Purpose:** Visualize dependency graph for an issue.

**Usage:**
```bash
bd dep tree <issue-id> [flags]
```

**Flags:**
- `--max-depth N` - Limit tree depth (default: 50)
- `--json` - Output in JSON format

**Example:**
```bash
bd dep tree 42 --max-depth 10
```

**When to use:**
- To understand impact of an issue
- To see what depends on your work
- To plan work order

---

## Updating Issues

### bd update

**Purpose:** Update an issue's fields.

**Usage:**
```bash
bd update <issue-id> [flags]
```

**Flags:**
- `--status STATUS` - Update status (open, in_progress, closed)
- `--priority N` - Update priority
- `--title TEXT` - Update title
- `--description TEXT` - Update description
- `--labels LABELS` - Update labels (comma-separated)
- `--json` - Output in JSON format

**Examples:**
```bash
# Mark as in progress
bd update 42 --status in_progress --json

# Change priority
bd update 42 --priority 0

# Update multiple fields
bd update 42 --status in_progress --labels "backend,api" --json
```

---

### bd close

**Purpose:** Close one or more issues.

**Usage:**
```bash
bd close <issue-id> [<issue-id>...] [flags]
```

**Flags:**
- `--reason TEXT` - Closure reason
- `--json` - Output in JSON format

**Examples:**
```bash
# Close single issue
bd close 42 --reason "Implemented and tested" --json

# Close multiple issues
bd close 10 20 30 --reason "Batch completion"
```

---

## Project Management

### bd stats

**Purpose:** Show project statistics.

**Usage:**
```bash
bd stats [flags]
```

**Flags:**
- `--json` - Output in JSON format

**Shows:**
- Total issues by status
- Issues by type
- Issues by priority
- Average completion time
- Blocked issues count

---

### bd init

**Purpose:** Initialize Beads in the current directory.

**Usage:**
```bash
bd init
```

**What it does:**
- Creates `.beads/` directory
- Creates SQLite database
- Creates issues.jsonl file
- Sets up git hooks (if requested)

**When to use:**
- Once per project, at project start

---

### bd export / import

**Purpose:** Export issues to JSONL or import from JSONL.

**Usage:**
```bash
bd export --format=jsonl -o .beads/issues.jsonl
bd import -i .beads/issues.jsonl
```

**When to use:**
- After git pull (import to sync database)
- Before git push (export to sync JSONL)
- When sharing issues across machines
- For backup purposes

**Note:** Export/import usually happens automatically via git hooks.

---

# Beads Best Practices

## For Agents

1. **Always check ready work first** - Start every session with `bd ready --json`
2. **File issues as you discover them** - Don't let work slip through the cracks
3. **Link discovered work** - Use `discovered-from` dependencies to track context
4. **Update status as you work** - Mark issues `in_progress` when starting
5. **Close with reasons** - Always provide closure reason for audit trail
6. **Use JSON output** - Makes parsing and automation easier

## For Humans

1. **Review ready work** - Check `bd ready` to see what agents can work on
2. **Manage priorities** - Keep P0/P1 issues focused on critical work
3. **Resolve blockers** - Use `bd blocked` to find stuck work
4. **Audit history** - Use `bd show` to see change history
5. **Visualize dependencies** - Use `bd dep tree` to understand relationships

## Integration Pattern

```bash
# 1. Morning standup - what's ready?
bd ready --json

# 2. Start working on issue
bd update 42 --status in_progress --json

# 3. Discover new bug while implementing
bd create "Bug: validation fails on empty input" -t bug -p 1 --json
bd dep add 42 <new-bug-id> --type discovered-from

# 4. Complete the work
bd close 42 --reason "Implemented with tests" --json

# 5. Next work
bd ready --json
```

---

# Additional Resources

## SpecKit Documentation
- [Spec-Driven Development Guide](./spec-driven.md)
- [Templates Directory](./templates/)
- [Example Specs](./specs/)

## Beads Documentation
- [Beads GitHub Repository](https://github.com/steveyegge/beads)
- [Beads Quickstart](Run `bd quickstart` in terminal)
- [Beads Database Location](./.beads/)

## Context7 Integration
- Context7 provides up-to-date library documentation
- Always prefer Context7 over guessing library APIs
- Use for any code generation involving external dependencies

---

# Quick Reference

## Typical Day with This Stack

```bash
# 1. Start session - check what's ready
bd ready --json

# 2. If starting new feature
/speckit.constitution  # Once per project
/speckit.specify       # Define the feature
/speckit.plan          # Technical approach
/speckit.tasks         # Break it down

# 3. Import tasks to Beads
bd create -f specs/001-feature/tasks.md

# 4. Implement with agent
/speckit.implement

# 5. Track discovered issues
bd create "Issue found during implementation" -t bug -p 1

# 6. End of day - what's left?
bd list --status open --json
```

## Emergency Commands

```bash
# Lost context? Check ready work
bd ready --json

# What am I working on?
bd list --status in_progress

# What's blocking everything?
bd blocked --json

# Show me the big picture
bd stats

# Need to understand this issue's impact?
bd dep tree <issue-id>
```

---

**Last Updated:** October 19, 2025
**Project:** VendorEval3
**Workflow Version:** SpecKit + Beads + Context7

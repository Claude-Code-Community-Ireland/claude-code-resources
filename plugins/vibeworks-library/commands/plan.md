---
description: Create an implementation plan for a feature with architecture design and task breakdown
argument-hint: Feature or task to plan
allowed-tools: Read, Bash, Glob, Grep, Task
---

# Plan Workflow

You are creating a structured implementation plan for a feature or task.

## Steps

1. **Understand the request**: Read the feature description from `$ARGUMENTS`. If it's ambiguous, ask clarifying questions about scope, constraints, and expected behavior.

2. **Explore the codebase**: Use the Task tool with the `Explore` subagent to understand:
   - Project structure and framework
   - Existing patterns and conventions
   - Related components that will be affected
   - Current test infrastructure

3. **Launch the architect**: Use the Task tool to spawn the `architect` agent with:

   > Design an implementation plan for:
   > Feature: $ARGUMENTS
   > Codebase context: [summary from exploration]
   >
   > Follow the full architecture process: understand the landscape, define requirements, propose 2-3 design options with trade-offs, recommend one approach, and provide a detailed implementation blueprint with specific files to create/modify, component responsibilities, data flow, and build sequence.

4. **Create a task breakdown**: Convert the blueprint into a numbered checklist of implementation steps, ordered by dependency (build foundations first).

5. **Present the plan**: Show the user:
   - Recommended approach with rationale
   - Key files to create or modify
   - Ordered implementation steps
   - Any risks or open questions

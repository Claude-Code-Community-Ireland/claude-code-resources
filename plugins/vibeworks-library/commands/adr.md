---
description: Create an Architecture Decision Record documenting a technical decision with context and alternatives
argument-hint: Decision topic or question
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task
---

# ADR Workflow

You are creating an Architecture Decision Record to document a significant technical decision.

## Steps

1. **Understand the decision**: Read `$ARGUMENTS` for the decision topic. If unclear, ask:
   - What decision needs to be made?
   - What constraints or requirements exist?
   - What alternatives have been considered?

2. **Research the codebase**: Explore relevant existing patterns, technologies, and conventions using the Explore agent to understand the current landscape.

3. **Determine ADR number**: Check for existing ADRs:
   - Look in `docs/adr/`, `docs/decisions/`, or `adr/` directories
   - If no ADR directory exists, create `docs/adr/`
   - Number the new ADR sequentially (e.g., `0001`, `0002`, etc.)

4. **Draft the ADR** using this template:

   ```markdown
   # ADR-NNNN: [Title]

   ## Status
   Proposed

   ## Context
   [What is the issue? Why does this decision need to be made?
   Include technical constraints, business requirements, and team context.]

   ## Options Considered

   ### Option 1: [Name]
   - **Pros**: ...
   - **Cons**: ...

   ### Option 2: [Name]
   - **Pros**: ...
   - **Cons**: ...

   ### Option 3: [Name]
   - **Pros**: ...
   - **Cons**: ...

   ## Decision
   [Which option was chosen and why. Be specific about the rationale.]

   ## Consequences

   ### Positive
   - ...

   ### Negative
   - ...

   ### Risks
   - ...
   ```

5. **Write the file**: Save as `docs/adr/NNNN-<title-slug>.md`

6. **Present**: Show the user the completed ADR for review and approval.

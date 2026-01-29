---
description: Generate documentation for code, APIs, or project structure
argument-hint: What to document (file, module, API, project)
allowed-tools: Read, Write, Edit, Glob, Grep, Task
---

# Document Workflow

You are generating documentation for a codebase, module, or API.

## Steps

1. **Determine the target**: Read `$ARGUMENTS` to understand what needs documenting.
   - If a file path: Document that specific file or module
   - If "readme" or "project": Generate a project README
   - If "api": Generate API documentation
   - If "changelog": Generate a changelog entry
   - If "runbook": Generate an operational runbook
   - If empty: Ask the user what to document

2. **Read the code thoroughly**: Before writing any documentation, read all relevant source files. Understand what the code does, its public API, configuration options, and edge cases.

3. **Launch the doc-writer**: Use the Task tool to spawn the `doc-writer` agent with:

   > Generate documentation for:
   > Target: $ARGUMENTS
   > Type: [detected doc type]
   > Code context: [summary of what the code does]
   >
   > Follow documentation standards. Use active voice, concrete examples, and progressive disclosure. Include code examples where relevant.

4. **Write the output**: Create or update the documentation file in the appropriate location.

5. **Verify**: Confirm all code examples in the documentation are accurate and all links resolve.

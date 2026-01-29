---
description: Safely refactor code using named patterns with test verification at each step
argument-hint: File, module, or code smell to address
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
---

# Refactor Workflow

You are performing a safe, verified refactoring of code.

## Steps

1. **Identify the target**: Read `$ARGUMENTS` to understand what to refactor.
   - If a file path: Refactor that specific file
   - If a code smell name: Find and address that smell across the codebase
   - If a module name: Refactor the module's structure
   - If empty: Ask the user what to refactor

2. **Check test coverage**: Before any refactoring, verify tests exist for the target code:
   ```
   Run the test suite to confirm current tests pass.
   Check for test files corresponding to the target code.
   ```
   If test coverage is insufficient, **warn the user** and offer to write characterization tests first.

3. **Launch the refactorer**: Use the Task tool to spawn the `refactorer` agent with:

   > Refactor the following code:
   > Target: $ARGUMENTS
   > Test status: [passing/failing/missing]
   >
   > Follow the refactoring protocol: verify tests, identify code smells, plan transformations, execute one at a time with test verification after each step. Name every transformation applied.

4. **Verify**: Run the full test suite after all transformations to confirm no regressions.

5. **Report**: List all named transformations applied, before/after summary, and test results.

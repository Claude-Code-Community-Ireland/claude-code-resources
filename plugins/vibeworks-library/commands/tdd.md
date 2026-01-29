---
description: Start a TDD workflow — writes failing test first, then implements, then refactors
argument-hint: Feature or function to implement
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
---

# TDD Workflow

You are starting a test-driven development session.

## Steps

1. **Detect the test framework**: Search for test configuration files (jest.config, vitest.config, pytest.ini, Cargo.toml [dev-dependencies], etc.) and existing test files to understand the project's testing setup.

2. **Understand the request**: Read the user's feature description in `$ARGUMENTS`. If unclear, ask for clarification.

3. **Break it down**: Decompose the feature into small, independently testable increments. List them as a checklist.

4. **Launch the TDD coach**: Use the Task tool to spawn the `tdd-coach` agent with the following prompt:

   > Implement the following feature using strict TDD (red-green-refactor):
   > Feature: $ARGUMENTS
   > Test framework: [detected framework]
   > Follow the red-green-refactor cycle for each increment. Write the failing test first, then the minimal implementation, then refactor. Run tests after each step.

5. **Verify**: After the agent completes, run the full test suite to confirm everything passes.

6. **Report**: Summarize what was built, how many tests were added, and the final test suite status.

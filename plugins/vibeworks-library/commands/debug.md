---
description: Systematically debug an issue using hypothesis-driven investigation and binary search isolation
argument-hint: Error message, unexpected behavior, or failing test
allowed-tools: Read, Bash, Glob, Grep, Task
---

# Debug Workflow

You are starting a systematic debugging session.

## Steps

1. **Capture the problem**: Read the user's problem description from `$ARGUMENTS`. Gather:
   - What is the expected behavior?
   - What is the actual behavior?
   - Exact error message or symptoms
   - Steps to reproduce (if known)

2. **Check recent changes**: Run `git log --oneline -10` and `git diff` to see if recent changes could be related.

3. **Launch the debugger**: Use the Task tool to spawn the `debugger` agent with:

   > Debug the following issue:
   > Problem: $ARGUMENTS
   > Recent changes: [git log summary]
   > Follow the systematic debugging protocol: reproduce, hypothesize, isolate, identify root cause, fix and verify.

4. **Verify the fix**: Run the test suite to confirm the fix doesn't break anything else.

5. **Report**: Summarize the root cause, the fix applied, and verification results. Suggest if a regression test should be added.

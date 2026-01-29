---
name: debugging-systematic
description: Systematic debugging methodology — binary search isolation, hypothesis-driven debugging, reproducing issues, and root cause analysis. Use when debugging errors, unexpected behavior, or test failures.
---

# Systematic Debugging Methodology

## Core Principle

Debugging is not guessing. It is a scientific process: observe the symptom, form a hypothesis, predict the outcome of a test, and run the test. Repeat until the root cause is found.

---

## The Scientific Debugging Method

### Step 1: OBSERVE — Gather Evidence

Before changing anything, collect all available information.

**Checklist:**
- [ ] Read the FULL error message, not just the first line.
- [ ] Read the FULL stack trace. Identify the frame in YOUR code (skip framework internals).
- [ ] Note the exact input / request / action that triggered the bug.
- [ ] Note the expected behavior vs. the actual behavior.
- [ ] Check logs (application logs, server logs, browser console).
- [ ] Note the environment (OS, runtime version, dependency versions, config).
- [ ] Check if the bug is reproducible. If not, note the frequency and conditions.

**Key question:** Can I reproduce this bug reliably? If not, gathering more observations is the priority.

### Step 2: HYPOTHESIZE — Form a Theory

Based on the evidence, propose a specific, falsifiable explanation.

**Good hypothesis format:**
> "The crash occurs because `user.profile` is null when the user has not completed onboarding, and line 47 accesses `user.profile.name` without a null check."

**Bad hypothesis:**
> "Something is wrong with the user object."

**Rules:**
- The hypothesis must explain ALL observed symptoms.
- If it only explains some symptoms, it is incomplete — keep refining.
- Generate multiple competing hypotheses and rank by likelihood.

### Step 3: PREDICT — Design an Experiment

Before touching the code, predict what you will see IF your hypothesis is correct.

**Examples:**
- "If the null profile hypothesis is correct, then logging `user.profile` on line 45 will print `null` for users created after January 1."
- "If the race condition hypothesis is correct, then adding a 500ms delay before the second call will make the bug disappear."

### Step 4: TEST — Run the Experiment

Execute one change at a time. Observe whether the prediction matches.

**Rules:**
- Change ONE thing at a time. Multiple changes make it impossible to attribute cause.
- Revert experiments that did not help. Do not accumulate random changes.
- Use version control: commit or stash working state before experimenting.

### Step 5: CONCLUDE

- If the prediction matched, you have likely found the cause. Write a fix and a regression test.
- If the prediction did not match, your hypothesis was wrong. Return to Step 2 with new information.

---

## Binary Search Isolation

When you have no idea where the bug lives, use binary search to narrow it down.

### In Code
1. Identify the entry point and the crash / wrong output point.
2. Add a log or assertion at the MIDPOINT of the code path.
3. Is the state correct at the midpoint?
   - YES -> The bug is in the second half. Move your probe to the 75% point.
   - NO -> The bug is in the first half. Move your probe to the 25% point.
4. Repeat until you have isolated the exact line or function.

### In Time (git bisect)
```bash
git bisect start
git bisect bad              # Current commit is broken
git bisect good <commit>    # This commit was known to work
# Git checks out the midpoint. Test it.
git bisect good  # or  git bisect bad
# Repeat until git identifies the first bad commit.
git bisect reset
```

### In Data
1. Take the failing input dataset.
2. Remove half the data.
3. Does the bug still occur?
   - YES -> The bug is in the remaining half, or is independent of the removed data.
   - NO -> The trigger is in the removed half. Restore it and remove the other half.
4. Repeat until you find the minimum failing input.

---

## Reading Stack Traces

### Anatomy of a Stack Trace

```
Error: Cannot read properties of null (reading 'name')     <-- Error type + message
    at getUserName (src/services/user.js:47:22)             <-- YOUR CODE (start here)
    at handleRequest (src/routes/profile.js:12:15)          <-- Caller
    at Layer.handle (node_modules/express/lib/router.js:5)  <-- Framework (skip)
    at next (node_modules/express/lib/router.js:13)         <-- Framework (skip)
```

**Reading order:**
1. Read the error message at the top.
2. Scan DOWN the trace to find the FIRST frame in YOUR code.
3. Open that file at that line. This is your starting point.
4. Read the frames above and below for context on the call chain.

### Common Error Patterns

| Error Message | Likely Cause |
|---|---|
| `Cannot read properties of null/undefined` | Missing null check; variable not initialized |
| `TypeError: X is not a function` | Wrong import; typo in method name; variable shadowing |
| `RangeError: Maximum call stack exceeded` | Infinite recursion; circular reference |
| `ECONNREFUSED` / `ETIMEDOUT` | External service is down or misconfigured |
| `ENOENT: no such file or directory` | Wrong path; missing file; CWD is not what you expect |
| `SyntaxError: Unexpected token` | Malformed JSON; wrong file format; encoding issue |

---

## Strategic Logging

### What to Log

```
[ENTRY]  Function name, input parameters (sanitized)
[STATE]  Key variable values at decision points
[BRANCH] Which branch of a conditional was taken
[EXIT]   Return value or thrown exception
```

### Logging Levels for Debugging

```
DEBUG  -> Detailed variable dumps (temporary, remove after fixing)
INFO   -> Flow markers ("entered function X", "querying database")
WARN   -> Unexpected but handled conditions ("retrying after timeout")
ERROR  -> Unhandled exceptions and failures
```

### Temporary Debug Logging Pattern

```python
# Add a unique tag so you can find and remove all debug logs later
print("[DEBUG-ISSUE-123] user_id:", user_id, "profile:", profile)
```

When done, search for `[DEBUG-ISSUE-123]` and remove all instances.

---

## Common Bug Categories

### 1. Off-by-One Errors
- **Symptoms:** Missing first/last element; array index out of bounds; fence-post errors.
- **Check:** Loop bounds (`<` vs `<=`), array indices (0-based vs 1-based), string slicing (inclusive vs exclusive end).

### 2. Null / Undefined Reference
- **Symptoms:** `NullPointerException`, `Cannot read properties of undefined`.
- **Check:** Optional chaining, uninitialized variables, missing return statements, database queries returning no rows.

### 3. Race Conditions
- **Symptoms:** Works sometimes but not always; fails under load; test flakiness.
- **Check:** Shared mutable state, async operations without await, missing locks/mutexes, event ordering assumptions.
- **Diagnostic:** Add delays (`sleep(500)`) to amplify timing windows. If the bug becomes more or less frequent, it is a race.

### 4. State Corruption
- **Symptoms:** Correct behavior initially, then gradually wrong; restart fixes it.
- **Check:** Global/shared state, caches, singletons, mutable default arguments, in-place mutations of objects passed by reference.

### 5. Resource Leaks
- **Symptoms:** Slow degradation over time; eventual crash; "too many open files."
- **Check:** Unclosed file handles, database connections, HTTP connections, event listeners not removed, intervals not cleared.

### 6. Encoding / Serialization
- **Symptoms:** Garbled text, wrong characters, parsing failures.
- **Check:** UTF-8 vs Latin-1, JSON/XML escaping, URL encoding, base64 padding, line endings (CRLF vs LF).

### 7. Configuration / Environment
- **Symptoms:** Works on one machine but not another; works locally but not in CI/production.
- **Check:** Environment variables, file paths, dependency versions, OS differences, timezone, locale.

---

## Debugging Checklists by Scenario

### Test Failure
- [ ] Read the assertion message. What was expected vs. actual?
- [ ] Is the test itself correct? (Tests can have bugs too.)
- [ ] Is the test isolated? Run it alone. Does it pass?
- [ ] Are test fixtures up to date?
- [ ] Did a recent change to shared code break this test?

### Runtime Exception
- [ ] Read the full stack trace.
- [ ] Reproduce it with the simplest possible input.
- [ ] Check the exact line. What variable is null/wrong?
- [ ] Trace the variable backward. Where was it set?
- [ ] Is there a missing validation or null check?

### Wrong Output (No Error)
- [ ] Confirm the expected output is actually correct.
- [ ] Add logging at the input and output of the function.
- [ ] Binary search: where does the data go wrong?
- [ ] Check type coercion (string "1" vs integer 1).
- [ ] Check operator precedence and short-circuit evaluation.

### Performance Problem
- [ ] Profile first, do not guess. Use a profiler tool.
- [ ] Identify the hottest function or query.
- [ ] Check for N+1 queries, unnecessary loops, missing indexes.
- [ ] Check for memory leaks (heap snapshots over time).
- [ ] Check for blocking I/O on the main thread.

### Intermittent / Flaky Bug
- [ ] Run the test 100 times in a loop. What is the failure rate?
- [ ] Check for race conditions (add delays to amplify).
- [ ] Check for dependency on external state (clock, network, filesystem).
- [ ] Check for test pollution (shared state between tests).
- [ ] Check for non-deterministic inputs (random, timestamps, UUIDs).

---

## Post-Mortem Template

After fixing a non-trivial bug, document what happened:

```markdown
## Bug Post-Mortem: [ISSUE-ID] [Short title]

### Summary
One-sentence description of the bug and its impact.

### Timeline
- [timestamp] Bug reported by [who/what]
- [timestamp] Reproduced in [environment]
- [timestamp] Root cause identified
- [timestamp] Fix deployed

### Root Cause
Detailed technical explanation of why the bug occurred.

### Fix
What was changed and why. Link to the commit/PR.

### Detection
How was the bug caught? Could we have caught it earlier?

### Prevention
What process or technical change would prevent this class of bug?
- [ ] Added regression test: [link]
- [ ] Added monitoring/alerting: [details]
- [ ] Updated documentation: [link]
- [ ] Other: [details]

### Lessons Learned
What did we learn that applies beyond this specific bug?
```

---

## Tools and Techniques

### Rubber Duck Debugging
Explain the problem out loud (or in writing) step by step. Articulating assumptions often reveals which one is wrong.

### Minimal Reproduction
Strip away everything not related to the bug:
1. Remove unrelated code paths.
2. Hardcode inputs instead of reading from files/databases.
3. Replace external services with stubs.
4. Reduce data to the smallest set that triggers the bug.

The act of creating a minimal reproduction often reveals the cause.

### Diff Debugging
If it used to work:
1. Find the last known working state (commit, release, date).
2. Diff the code between then and now.
3. Read each change. Could it cause the symptom?
4. Use `git bisect` for large ranges.

### Divide and Conquer with Comments
1. Comment out half the suspicious code.
2. Does the bug persist?
   - YES -> It is in the uncommented half.
   - NO -> It is in the commented half.
3. Repeat until isolated.

---

## Key Principles

1. **Reproduce first.** If you cannot reproduce it, you cannot verify your fix.
2. **One change at a time.** Multiple changes destroy your ability to reason about cause and effect.
3. **Read before you write.** Spend more time reading code and logs than writing fixes.
4. **Trust nothing.** Verify your assumptions. Print the value. Check the type. Read the documentation.
5. **The bug is in your code.** It is almost never the compiler, the OS, or the framework. Check your code first.
6. **Write the regression test.** A bug without a test is a bug that will return.

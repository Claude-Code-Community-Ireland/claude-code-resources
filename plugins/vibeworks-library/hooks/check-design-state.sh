#!/bin/bash

# Agentic UI Designer - Design State Check Hook
# Triggered on Stop to check if design iteration should continue

# Look for design-state.json in multiple locations
STATE_FILE=""
SEARCH_PATHS=(
    "design-state.json"
    ".claude/design-state.json"
    "*/design-state.json"
    "./**/design-state.json"
)

for path in "${SEARCH_PATHS[@]}"; do
    # Use find for glob patterns, direct test for fixed paths
    if [[ "$path" == *"*"* ]]; then
        found=$(find . -path "$path" -type f 2>/dev/null | head -1)
        if [ -n "$found" ]; then
            STATE_FILE="$found"
            break
        fi
    elif [ -f "$path" ]; then
        STATE_FILE="$path"
        break
    fi
done

# If no state file, allow stop
if [ -z "$STATE_FILE" ]; then
    exit 0
fi

# Read state file
if command -v jq &> /dev/null; then
    # Use jq if available
    ITERATION=$(jq -r '.iteration // 0' "$STATE_FILE" 2>/dev/null)
    GATES_PASSED=$(jq -r '.gatesPassed // false' "$STATE_FILE" 2>/dev/null)
    MIN_ITERATIONS=$(jq -r '.minIterations // 5' "$STATE_FILE" 2>/dev/null)
    BEST_SCORE=$(jq -r '.bestScore // 0' "$STATE_FILE" 2>/dev/null)
else
    # Fallback: use grep/sed for basic parsing
    ITERATION=$(grep -o '"iteration"[[:space:]]*:[[:space:]]*[0-9]*' "$STATE_FILE" | grep -o '[0-9]*' | head -1)
    GATES_PASSED=$(grep -o '"gatesPassed"[[:space:]]*:[[:space:]]*[a-z]*' "$STATE_FILE" | grep -o 'true\|false' | head -1)
    MIN_ITERATIONS=5
    BEST_SCORE=$(grep -o '"bestScore"[[:space:]]*:[[:space:]]*[0-9.]*' "$STATE_FILE" | grep -o '[0-9.]*' | head -1)
fi

# Default values if parsing failed
ITERATION=${ITERATION:-0}
GATES_PASSED=${GATES_PASSED:-false}
MIN_ITERATIONS=${MIN_ITERATIONS:-5}
BEST_SCORE=${BEST_SCORE:-0}

# Check if we should warn about incomplete iteration
if [ "$GATES_PASSED" != "true" ] || [ "$ITERATION" -lt "$MIN_ITERATIONS" ]; then
    cat << EOF

## ⚠️ Design Iteration In Progress

Found state file: $STATE_FILE

Current Status:
- Iteration: $ITERATION (minimum: $MIN_ITERATIONS)
- Gates passed: $GATES_PASSED
- Best score: $BEST_SCORE

### Action Required

Continue iterating until:
1. Quality gates pass (score >= 9.5/10, vibe-code < 1%)
2. Minimum $MIN_ITERATIONS iterations completed

### If Using Ralph Loop

Do NOT output \`DESIGN_COMPLETE\` until ALL conditions are met:
- iteration >= $MIN_ITERATIONS
- gatesPassed = true

EOF
fi

# Always exit 0 (informational only)
exit 0

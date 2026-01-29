#!/bin/bash
# Gentle reminder to run tests after implementation work.
# This hook runs when Claude stops responding.
# Exit 0 = non-blocking reminder shown in verbose mode only.

# Read the conversation context from stdin
INPUT=$(cat)

# Check if the stop reason suggests implementation work was done
TOOL_NAMES=$(echo "$INPUT" | grep -o '"tool_name":"[^"]*"' 2>/dev/null | head -20)

# If Write or Edit tools were used, remind about tests
if echo "$TOOL_NAMES" | grep -qE '"(Write|Edit)"'; then
  echo "Reminder: Source files were modified. Consider running the test suite to verify changes."
fi

exit 0

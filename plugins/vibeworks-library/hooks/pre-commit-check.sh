#!/bin/bash
# Check for common issues before commits.
# Exit 0 = success, exit 2 = block the operation.
# This is a soft reminder (exit 0) — it does not block.

INPUT=$(cat)

# Check for debug statements in staged files
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

WARNINGS=""

# Check for console.log, print(), debugger statements
for file in $STAGED_FILES; do
  if [ -f "$file" ]; then
    case "$file" in
      *.js|*.ts|*.jsx|*.tsx)
        if grep -n "console\.log\|debugger" "$file" 2>/dev/null | grep -v "// keep" | head -3 > /dev/null 2>&1; then
          WARNINGS="${WARNINGS}Note: ${file} may contain debug statements (console.log/debugger).\n"
        fi
        ;;
      *.py)
        if grep -n "^[^#]*\bprint(" "$file" 2>/dev/null | grep -v "# keep" | head -3 > /dev/null 2>&1; then
          WARNINGS="${WARNINGS}Note: ${file} may contain debug print() statements.\n"
        fi
        ;;
    esac
  fi
done

if [ -n "$WARNINGS" ]; then
  echo -e "$WARNINGS"
  echo "These are informational only — commit is not blocked."
fi

exit 0

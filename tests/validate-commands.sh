#!/bin/bash
# Validate all command .md files have correct structure

set -e

COMMANDS_DIR="plugins/vibeworks-library/commands"
ERRORS=0

echo "Validating commands..."
echo ""

for cmd_file in "$COMMANDS_DIR"/*.md; do
  cmd_name=$(basename "$cmd_file" .md)

  if [ ! -s "$cmd_file" ]; then
    echo "FAIL: $cmd_name — file is empty"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check for YAML frontmatter
  if ! head -1 "$cmd_file" | grep -q "^---$"; then
    echo "FAIL: $cmd_name — missing YAML frontmatter"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check for description field
  if ! grep -q "^description:" "$cmd_file"; then
    echo "FAIL: $cmd_name — missing 'description' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  echo "  OK: $cmd_name"
done

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS error(s) found"
  exit 1
else
  echo "All commands validated successfully"
fi

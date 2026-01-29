#!/bin/bash
# Validate all agent .md files have correct structure

set -e

AGENTS_DIR="plugins/vibeworks-library/agents"
ERRORS=0
VALID_MODELS="sonnet opus haiku"

echo "Validating agents..."
echo ""

for agent_file in "$AGENTS_DIR"/*.md; do
  agent_name=$(basename "$agent_file" .md)

  if [ ! -s "$agent_file" ]; then
    echo "FAIL: $agent_name — file is empty"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check for YAML frontmatter
  if ! head -1 "$agent_file" | grep -q "^---$"; then
    echo "FAIL: $agent_name — missing YAML frontmatter"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check required fields
  if ! grep -q "^name:" "$agent_file"; then
    echo "FAIL: $agent_name — missing 'name' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^description:" "$agent_file"; then
    echo "FAIL: $agent_name — missing 'description' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^tools:" "$agent_file"; then
    echo "FAIL: $agent_name — missing 'tools' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  if ! grep -q "^model:" "$agent_file"; then
    echo "FAIL: $agent_name — missing 'model' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  echo "  OK: $agent_name"
done

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS error(s) found"
  exit 1
else
  echo "All agents validated successfully"
fi

#!/bin/bash
# Validate all SKILL.md files have correct structure

set -e

SKILLS_DIR="plugins/vibeworks-library/skills"
ERRORS=0

echo "Validating skills..."
echo ""

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name=$(basename "$skill_dir")
  skill_file="$skill_dir/SKILL.md"

  if [ ! -f "$skill_file" ]; then
    echo "FAIL: $skill_name — missing SKILL.md"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check file is not empty
  if [ ! -s "$skill_file" ]; then
    echo "FAIL: $skill_name — SKILL.md is empty"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check for YAML frontmatter
  if ! head -1 "$skill_file" | grep -q "^---$"; then
    echo "FAIL: $skill_name — missing YAML frontmatter (no opening ---)"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # Check for name field in frontmatter
  if ! grep -q "^name:" "$skill_file"; then
    echo "FAIL: $skill_name — missing 'name' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  # Check for description field
  if ! grep -q "^description:" "$skill_file"; then
    echo "FAIL: $skill_name — missing 'description' in frontmatter"
    ERRORS=$((ERRORS + 1))
  fi

  # Check minimum content length (at least 500 chars after frontmatter)
  content_length=$(sed -n '/^---$/,/^---$/d; p' "$skill_file" | wc -c | tr -d ' ')
  if [ "$content_length" -lt 500 ]; then
    echo "WARN: $skill_name — content is short ($content_length chars, recommend 500+)"
  fi

  echo "  OK: $skill_name"
done

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS error(s) found"
  exit 1
else
  echo "All skills validated successfully"
fi

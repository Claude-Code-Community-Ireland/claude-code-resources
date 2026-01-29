#!/bin/bash
# Validate marketplace.json and plugin.json are valid and consistent

set -e

ERRORS=0

echo "Validating marketplace and plugin manifests..."
echo ""

# Check marketplace.json exists and is valid JSON
MARKETPLACE=".claude-plugin/marketplace.json"
if [ ! -f "$MARKETPLACE" ]; then
  echo "FAIL: $MARKETPLACE not found"
  ERRORS=$((ERRORS + 1))
else
  if ! python3 -c "import json; json.load(open('$MARKETPLACE'))" 2>/dev/null; then
    echo "FAIL: $MARKETPLACE is not valid JSON"
    ERRORS=$((ERRORS + 1))
  else
    echo "  OK: $MARKETPLACE is valid JSON"
  fi
fi

# Check plugin.json exists and is valid JSON
PLUGIN="plugins/vibeworks-library/.claude-plugin/plugin.json"
if [ ! -f "$PLUGIN" ]; then
  echo "FAIL: $PLUGIN not found"
  ERRORS=$((ERRORS + 1))
else
  if ! python3 -c "import json; json.load(open('$PLUGIN'))" 2>/dev/null; then
    echo "FAIL: $PLUGIN is not valid JSON"
    ERRORS=$((ERRORS + 1))
  else
    echo "  OK: $PLUGIN is valid JSON"
  fi
fi

# Check hooks.json is valid JSON
HOOKS="plugins/vibeworks-library/hooks/hooks.json"
if [ -f "$HOOKS" ]; then
  if ! python3 -c "import json; json.load(open('$HOOKS'))" 2>/dev/null; then
    echo "FAIL: $HOOKS is not valid JSON"
    ERRORS=$((ERRORS + 1))
  else
    echo "  OK: $HOOKS is valid JSON"
  fi
fi

# Check that plugin source path in marketplace.json exists
if [ -f "$MARKETPLACE" ]; then
  SOURCE=$(python3 -c "import json; print(json.load(open('$MARKETPLACE'))['plugins'][0]['source'])" 2>/dev/null)
  if [ -n "$SOURCE" ] && [ ! -d "$SOURCE" ]; then
    echo "FAIL: Plugin source '$SOURCE' does not exist"
    ERRORS=$((ERRORS + 1))
  else
    echo "  OK: Plugin source directory exists"
  fi
fi

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS error(s) found"
  exit 1
else
  echo "All manifests validated successfully"
fi

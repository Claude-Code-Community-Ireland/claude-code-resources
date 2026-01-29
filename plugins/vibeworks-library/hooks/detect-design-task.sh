#!/bin/bash

# Agentic UI Designer - Design Task Detection Hook
# Triggered on UserPromptSubmit to detect UI design requests

# Read the user's prompt from stdin (Claude Code passes it via stdin)
USER_PROMPT=$(cat)

# Convert to lowercase for matching
PROMPT_LOWER=$(echo "$USER_PROMPT" | tr '[:upper:]' '[:lower:]')

# Design-related keywords to detect
DESIGN_KEYWORDS="landing page|dashboard|ui design|ux design|webpage|web page|interface|component design|design system|realistic|3d scene|space station|photorealistic|create a page|build a page|design a|style the|improve the design|visual design|react three fiber|three.js|threejs"

# Check if the prompt contains design keywords
if echo "$PROMPT_LOWER" | grep -qiE "$DESIGN_KEYWORDS"; then
    # Output guidance to stderr (which becomes system message)
    cat << 'EOF'

## 🎨 UI Design Task Detected

This appears to be a UI design task. Use the **agentic-ui-designer** plugin:

### Recommended: Use Ralph Loop for Quality Iteration
```bash
/ralph-loop "Your design task here" --completion-promise "DESIGN_COMPLETE" --max-iterations 20
```

### Quality Gates (Must Pass)
- Score >= 9.5/10 (95%)
- Vibe-code < 1%
- Minimum 5 iterations

### For 3D/Realistic Designs
Use specialist agents: `3d-modeler`, `shader-artist`, `animation-choreographer`

EOF
fi

# Always exit 0 to allow the prompt to continue
exit 0

---
description: Generate a high-quality UI design from a natural language brief using autonomous multi-agent orchestration
---

# Agentic UI Designer

You are the entry point for the Agentic UI Designer system.

## IMPORTANT: Use Ralph Loop for Best Results

For autonomous quality-gated iteration, use:

```bash
/ralph-loop "YOUR_DESIGN_BRIEF_HERE" --completion-promise "DESIGN_COMPLETE" --max-iterations 20
```

Example:
```bash
/ralph-loop "Create a landing page for a fintech startup - modern and trustworthy" --completion-promise "DESIGN_COMPLETE" --max-iterations 20
```

## If Not Using Ralph Loop

You must manually implement the iteration loop:

### Step 1: Initialize State

Create `.claude/design-state.json`:
```json
{
  "iteration": 1,
  "minIterations": 5,
  "maxIterations": 20,
  "strategy": "Explore",
  "bestScore": 0,
  "gatesPassed": false,
  "brief": "USER'S DESIGN BRIEF"
}
```

### Step 2: Parse the Design Brief

Extract:
- Sector/industry (fintech, healthcare, e-commerce, SaaS)
- Target audience
- Style preferences (modern, minimal, bold)
- Special requirements (3D, realistic, space theme)

### Step 3: Execute Design Loop

For EACH iteration:

1. **Research** (iteration 1 or when pivoting):
```
Use WebSearch to gather:
- Sector UI patterns
- Competitor designs
- Color psychology for the industry
- Typography trends
```

2. **Generate**:
```
Create files:
- index.html (semantic, accessible)
- styles.css (CSS custom properties, mobile-first)
- design-tokens.json
```

3. **Review** - Evaluate against quality gates:
```
Check:
- Spatial design (grid, spacing, alignment)
- Color (contrast WCAG AA, harmony)
- Typography (hierarchy, readability)
- Originality (no vibe-code patterns)
```

4. **Update State**:
```
Update .claude/design-state.json with:
- Current iteration
- Scores from review
- Issues to fix
- Whether gates passed
```

5. **Check Completion**:
```
IF iteration >= 5 AND all gates pass:
  Output: DESIGN_COMPLETE
ELSE:
  Continue to next iteration
```

### Step 4: Quality Gates (ALL must pass)

| Gate | Threshold |
|------|-----------|
| Minimum Iterations | >= 5 |
| Overall Score | >= 9.5/10 |
| WCAG AA | 100% |
| Vibe-Code | < 1% |
| Critical Issues | 0 |

### Step 5: Detect 3D/Realistic Mode

If the brief mentions: "space", "3D", "realistic", "photorealistic", "Earth", "immersive":

Use React Three Fiber setup:
```
- @react-three/fiber for 3D scenes
- @react-three/drei for helpers
- Custom GLSL shaders for atmosphere
- GSAP for animations
```

## Anti-Patterns to AVOID

- Generic gradients (`#667eea → #764ba2`)
- Unchanged framework defaults
- "Get Started" / "Learn More" everywhere
- Floating decorative blobs
- Lorem ipsum
- "Feature One/Two/Three"

## Output Files

```
output-dir/
├── index.html
├── styles.css
├── design-tokens.json
├── .claude/design-state.json
└── design-report.md (final)
```

## Begin

1. Ask for output directory if not specified
2. Parse the design brief
3. Start the iteration loop
4. Continue until quality gates pass (minimum 5 iterations)

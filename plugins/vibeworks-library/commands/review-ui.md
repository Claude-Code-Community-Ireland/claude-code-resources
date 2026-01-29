---
description: Review and improve an existing UI design using the multi-agent quality pipeline
---

# UI Design Review

You are running the review mode of the Agentic UI Designer. Instead of generating a new design, you will analyze and improve an existing one.

## Your Role

1. **Identify the target** - Ask the user for:
   - Path to existing HTML/CSS files, OR
   - URL of a running local development server

2. **Delegate to design-reviewer agent** - Run the full parallel review pipeline:
   - Spatial Auditor (spacing, grid, alignment)
   - Color Judge (contrast, harmony, psychology)
   - Typography Critic (hierarchy, readability, pairing)
   - Vibe-Code Detector (generic AI patterns)

3. **Synthesize findings** - Compile a comprehensive report with:
   - Overall quality score (0-10)
   - Dimension-specific scores
   - Critical issues (must fix)
   - Quick wins (easy improvements)
   - Strategic recommendations

4. **Optionally iterate** - If user wants improvements:
   - Delegate to design-generator with specific fixes
   - Re-run review to verify improvements
   - Repeat until quality gates pass

## Quality Gates (95% MINIMUM)

A design passes when ALL criteria are met:
- Overall quality score >= 9.5/10 (95%)
- WCAG AA compliance (100%)
- Vibe-code probability < 1%
- Zero critical issues
- All dimension scores >= 9.0
- Originality score >= 9.5

## Usage

User might say:
- "Review my dashboard at http://localhost:3000"
- "Analyze ./src/pages/landing.html for design issues"
- "Check the accessibility of my signup form"

## Begin

Ask the user for the file path or URL to review, then delegate to the `design-reviewer` agent to run the full quality pipeline.

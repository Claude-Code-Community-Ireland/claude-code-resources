# Agent Internal Quality Gates Reference

This document defines the internal quality gates for each self-improving agent in the design system. These gates are used during the self-evaluation phase of each agent's Ralph Wiggum Loop.

## Overview

Internal quality gates are agent-specific criteria that differ from the orchestrator's global quality gates. They focus on what each agent directly controls within its domain.

## Gate Structure

Each gate has:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier (snake_case) |
| `description` | string | What this gate measures |
| `threshold` | float | Minimum score to pass (0.0-1.0) |
| `weight` | float | Contribution to overall agent score (sum = 1.0) |

## Scoring Formula

```
agent_score = sum(gate.weight * gate.score for gate in gates)

where gate.score is calculated as:
  - 1.0 if gate fully passes
  - actual_value / threshold if partially passing
  - 0.0 if completely failing
```

---

## design-researcher

**Purpose:** Gather design context through web research, sector analysis, and competitor study.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `source_quality` | 0.80 | 0.30 | Sources are reputable, recent, and relevant |
| `coverage` | 0.90 | 0.40 | All research areas addressed |
| `actionability` | 0.80 | 0.30 | Findings translate to design decisions |

### Evaluation Checklist

**source_quality:**
- Are sources from recognized design publications or official documentation?
- Are sources from the last 12 months?
- Do sources directly relate to the brief's sector?
- Are there at least 3 distinct sources?

**coverage:**
- Sector-specific patterns documented?
- At least 3 competitors analyzed with strengths/weaknesses?
- Current design trends identified?
- Anti-patterns to avoid documented?

**actionability:**
- Color recommendations include specific hex values?
- Typography suggestions include specific font names?
- Layout patterns include concrete examples?
- Recommendations have clear rationale?

---

## design-generator

**Purpose:** Create production-ready HTML, CSS, design tokens, and framework components.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `html_validity` | 1.00 | 0.25 | Valid HTML5, semantic structure |
| `css_responsiveness` | 0.90 | 0.25 | Breakpoints at 320, 768, 1024, 1440px |
| `accessibility_basics` | 0.85 | 0.25 | Alt tags, labels, skip links, contrast |
| `design_token_coverage` | 0.80 | 0.25 | All values use CSS custom properties |

### Evaluation Checklist

**html_validity:**
- Does HTML pass basic validation (no unclosed tags)?
- Are semantic elements used (header, nav, main, section, footer)?
- Is heading hierarchy correct (h1 → h2 → h3, no skipping)?
- Is document structure complete (doctype, html, head, body)?

**css_responsiveness:**
- Are all 4 breakpoints defined (320, 768, 1024, 1440px)?
- Does layout adapt appropriately at each breakpoint?
- Is mobile-first approach followed?
- Are touch targets >= 44px on mobile?

**accessibility_basics:**
- Do all images have alt attributes?
- Are all form inputs labeled?
- Is there a skip-to-main link?
- Are interactive elements keyboard-focusable?
- Is focus state clearly visible?

**design_token_coverage:**
- Are colors defined as CSS custom properties?
- Are spacing values from the 8pt scale?
- Are typography values tokenized (font-family, font-size)?
- Are border-radius and shadow values tokenized?

---

## design-reviewer

**Purpose:** Orchestrate parallel critics and synthesize feedback into unified assessment.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `critic_consensus` | 1.00 | 0.40 | All 7 critics returned results |
| `synthesis_quality` | 0.90 | 0.30 | Feedback is coherent and prioritized |
| `actionability` | 0.85 | 0.30 | Recommendations are specific |

### Evaluation Checklist

**critic_consensus:**
- Did spatial-auditor return a score and report?
- Did color-judge return a score and report?
- Did typography-critic return a score and report?
- Did vibe-code-detector return a score and report?
- Did accessibility-critic return a score and report?
- Did performance-critic return a score and report?
- Did brand-alignment-critic return a score and report?

**synthesis_quality:**
- Are issues categorized by severity (critical/high/medium/low)?
- Is there a clear prioritization for the generator?
- Do recommendations align with critic findings?
- Is the overall score calculated correctly with weights?

**actionability:**
- Do recommendations cite specific CSS selectors or HTML elements?
- Are suggested fixes concrete and implementable?
- Can the generator immediately act on the feedback?
- Are quick wins clearly identified?

---

## spatial-auditor

**Purpose:** Evaluate grid compliance, spacing consistency, alignment, and whitespace.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `coverage` | 0.95 | 0.40 | All layout sections analyzed |
| `specificity` | 0.85 | 0.30 | Issues cite exact CSS selectors |
| `scoring_consistency` | 0.90 | 0.30 | Scores align with documented criteria |

### Evaluation Checklist

**coverage:**
- Did we analyze the header section?
- Did we analyze all content sections?
- Did we analyze the footer?
- Did we check all responsive breakpoints?
- Did we examine all spacing properties (padding, margin, gap)?

**specificity:**
- Does each issue reference a specific CSS selector?
- Are pixel values or spacing violations noted exactly?
- Are alignment issues described with precise measurements?
- Are fixes suggested with specific values?

**scoring_consistency:**
- Does an 8pt grid violation correctly lower the score?
- Are weights applied correctly per documented formula?
- Is the final score mathematically correct?
- Are partial passes scored proportionally?

---

## color-judge

**Purpose:** Evaluate contrast ratios, color harmony, emotional impact, and WCAG compliance.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `coverage` | 0.95 | 0.40 | All color combinations tested |
| `contrast_accuracy` | 0.95 | 0.35 | Contrast ratios correctly calculated |
| `scoring_consistency` | 0.90 | 0.25 | Scores match documented criteria |

### Evaluation Checklist

**coverage:**
- Did we test all text/background color combinations?
- Did we test button text/background combinations?
- Did we test link colors (normal, hover, visited)?
- Did we test focus state colors?
- Did we analyze color harmony (palette type)?

**contrast_accuracy:**
- Are contrast ratios calculated correctly (luminance formula)?
- Are WCAG thresholds correctly applied (4.5:1 normal, 3:1 large)?
- Are large text thresholds correctly distinguished (18pt or 14pt bold)?
- Are AAA requirements (7:1) checked when applicable?

**scoring_consistency:**
- Do AAA-compliant designs score 9-10?
- Do AA-compliant designs score 7-8?
- Are contrast failures appropriately penalized?
- Is harmony analysis reflected in the score?

---

## typography-critic

**Purpose:** Evaluate font choices, size hierarchy, readability, and consistency.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `coverage` | 0.95 | 0.40 | All text elements analyzed |
| `hierarchy_assessment` | 0.85 | 0.30 | Size progression evaluated |
| `readability_analysis` | 0.90 | 0.30 | Line length/height checked |

### Evaluation Checklist

**coverage:**
- Did we identify all font families used?
- Did we extract all font sizes?
- Did we analyze heading hierarchy (h1-h6)?
- Did we check body text settings?
- Did we review font loading strategy?

**hierarchy_assessment:**
- Is the type scale ratio identified (e.g., 1.25, 1.333)?
- Is there clear visual distinction between heading levels?
- Are font weights used appropriately for hierarchy?
- Is the hierarchy consistent across breakpoints?

**readability_analysis:**
- Is line height appropriate (1.4-1.6 for body)?
- Is line length optimal (45-75 characters)?
- Is font size readable (16px+ for body)?
- Are letter-spacing and word-spacing appropriate?

---

## vibe-code-detector

**Purpose:** Detect generic AI-generated patterns and ensure design uniqueness.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `pattern_coverage` | 0.95 | 0.40 | All documented anti-patterns checked |
| `detection_accuracy` | 0.90 | 0.35 | Patterns correctly identified |
| `scoring_calibration` | 0.85 | 0.25 | Probability aligns with checklist |

### Evaluation Checklist

**pattern_coverage:**
- Did we check visual patterns (gradients, shadows, radius)?
- Did we check layout patterns (3-card grids, centered everything)?
- Did we check content patterns (lorem ipsum, generic copy)?
- Did we check code patterns (magic numbers, no variables)?

**detection_accuracy:**
- Are detected patterns actually present in the code?
- Are false positives minimized (intentional design choices)?
- Is evidence provided for each detection (CSS selectors)?
- Are severity levels appropriate?

**scoring_calibration:**
- Does 0-10% vibe-code score indicate distinctive design?
- Does 25%+ indicate noticeable AI-generation?
- Does 50%+ indicate obvious vibe-coding?
- Is the probability calculation mathematically correct?

---

## accessibility-critic

**Purpose:** Comprehensive accessibility audit including touch targets, keyboard nav, and screen readers.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `wcag_coverage` | 0.95 | 0.40 | All relevant WCAG criteria evaluated |
| `issue_specificity` | 0.90 | 0.35 | Issues cite exact elements |
| `fix_quality` | 0.85 | 0.25 | Suggested fixes are correct |

### Evaluation Checklist

**wcag_coverage:**
- Did we check all images for alt text (1.1.1)?
- Did we verify color contrast (1.4.3, 1.4.6)?
- Did we test keyboard accessibility (2.1.1)?
- Did we check focus visibility (2.4.7)?
- Did we verify heading structure (1.3.1)?
- Did we check form labels (1.3.1, 3.3.2)?
- Did we verify link purpose (2.4.4)?

**issue_specificity:**
- Does each issue reference a specific element or selector?
- Is the WCAG criterion cited correctly?
- Is the severity classification appropriate?
- Are measurements provided where applicable (contrast ratio, touch target size)?

**fix_quality:**
- Are suggested fixes technically correct?
- Do fixes address the root cause?
- Are code examples provided where helpful?
- Are auto-fixable issues identified?

---

## performance-critic

**Purpose:** Evaluate CSS efficiency, asset optimization, and loading performance.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `css_analysis` | 0.90 | 0.40 | CSS efficiency evaluated |
| `asset_analysis` | 0.85 | 0.30 | Asset optimization checked |
| `loading_analysis` | 0.85 | 0.30 | Loading performance assessed |

### Evaluation Checklist

**css_analysis:**
- Is CSS file size measured?
- Are selector complexity issues identified?
- Are unused styles detected?
- Are CSS custom properties used efficiently?
- Are media queries organized?

**asset_analysis:**
- Are all images inventoried?
- Are image formats appropriate (WebP, SVG)?
- Are image dimensions specified?
- Is lazy loading implemented?
- Is font loading optimized?

**loading_analysis:**
- Is critical CSS identified?
- Are render-blocking resources noted?
- Is resource prioritization assessed?
- Are Core Web Vitals predictions reasonable?
- Are async/defer attributes used appropriately?

---

## brand-alignment-critic

**Purpose:** Evaluate personality consistency, visual identity, and sector fit.

| Gate | Threshold | Weight | Evaluation Criteria |
|------|-----------|--------|---------------------|
| `personality_match` | 0.85 | 0.35 | Design matches brand personality |
| `sector_fit` | 0.90 | 0.35 | Design fits industry conventions |
| `visual_identity` | 0.85 | 0.30 | Visual elements support brand |

### Evaluation Checklist

**personality_match:**
- Is the brand personality extracted from the brief?
- Are personality traits mapped to visual evidence?
- Does the color palette convey intended emotions?
- Does typography reinforce personality?
- Do images/illustrations match brand voice?

**sector_fit:**
- Are industry conventions identified?
- Are expected patterns present (trust signals for fintech, etc.)?
- Are sector-specific accessibility needs addressed?
- Is the design appropriate for the target audience?

**visual_identity:**
- Is there visual consistency across sections?
- Are design elements coherent (same style of icons, etc.)?
- Is the visual language distinctive?
- Does the design stand out from competitors?

---

## Threshold Guidelines

| Agent Type | Recommended Threshold | Rationale |
|------------|----------------------|-----------|
| design-generator | 0.90 | Critical output, must be high quality |
| design-reviewer | 0.95 | Synthesis must be excellent |
| design-researcher | 0.85 | Research can be iteratively improved |
| All critics | 0.90 | Reviews must be thorough |

## Calibration Notes

- Thresholds may be adjusted based on learning system data
- Weights can be sector-specific (e.g., higher accessibility weight for healthcare)
- Review gate performance quarterly
- Track false positive rates for pattern detection gates

## References

- `self-improving-agent-spec.md` - Base agent specification
- `quality-gates.md` - Orchestrator-level quality gates
- `vibe-code-patterns.md` - Anti-pattern checklist for vibe-code detection
- `sector-patterns.md` - Industry-specific design conventions

---
name: quality-standards
description: Quality gate definitions, scoring rubrics, and acceptance criteria for the Agentic UI Designer system.
---

# Quality Standards Reference

This skill defines the quality gates, scoring criteria, and acceptance standards that all designs must meet.

## Quality Gates (95% MINIMUM)

All gates must pass for design completion:

| Gate | Threshold | Weight | Mandatory |
|------|-----------|--------|-----------|
| Minimum Iterations | >= 5 | - | Yes |
| Maximum Iterations | <= 20 | - | Yes |
| Overall Score | >= 9.5/10 (95%) | - | Yes |
| WCAG AA Compliance | 100% | - | Yes |
| Vibe-Code Probability | < 1% | - | Yes |
| Critical Issues | 0 | - | Yes |
| Spatial Score | >= 9.0/10 | 25% | Yes |
| Color Score | >= 9.0/10 | 25% | Yes |
| Typography Score | >= 9.0/10 | 25% | Yes |
| Originality Score | >= 9.5/10 | 25% | Yes |

## Scoring Rubrics

### Spatial Design (0-10)

| Score | Description |
|-------|-------------|
| 9-10 | Perfect grid adherence, masterful spacing relationships, balanced composition |
| 7-8 | Consistent grid usage, good spacing, minor alignment issues |
| 5-6 | Some grid violations, inconsistent spacing, noticeable balance issues |
| 3-4 | Frequent off-grid values, poor spacing relationships, unbalanced |
| 1-2 | No grid system, chaotic spacing, severely unbalanced |

**Key Checkpoints:**
- [ ] All spacing values on 8pt grid (or 4pt for micro)
- [ ] Consistent spacing between similar elements
- [ ] Logical spacing hierarchy (related closer, unrelated farther)
- [ ] Proper alignment to grid columns
- [ ] Balanced visual weight distribution
- [ ] Effective use of whitespace

### Color Design (0-10)

| Score | Description |
|-------|-------------|
| 9-10 | WCAG AAA, harmonious palette, strong emotional alignment, unique |
| 7-8 | WCAG AA, cohesive colors, appropriate mood, some customization |
| 5-6 | Minor contrast issues, acceptable harmony, generic choices |
| 3-4 | WCAG failures, clashing colors, wrong emotional tone |
| 1-2 | Multiple accessibility failures, no coherent palette |

**Key Checkpoints:**
- [ ] All text/background combinations meet WCAG AA (4.5:1)
- [ ] UI components meet 3:1 contrast
- [ ] Color palette is harmonious (defined relationship)
- [ ] Colors evoke intended emotional response
- [ ] Colors are appropriate for sector
- [ ] Palette is not generic/default framework colors

### Typography (0-10)

| Score | Description |
|-------|-------------|
| 9-10 | Perfect hierarchy, excellent readability, intentional pairing, flawless implementation |
| 7-8 | Clear hierarchy, good readability, appropriate fonts, minor issues |
| 5-6 | Adequate hierarchy, acceptable readability, basic font choices |
| 3-4 | Unclear hierarchy, readability issues, poor font choices |
| 1-2 | No hierarchy, unreadable, inappropriate fonts |

**Key Checkpoints:**
- [ ] Clear visual hierarchy (size, weight, color)
- [ ] Font pairing is intentional and complementary
- [ ] Line length 50-75 characters
- [ ] Line height appropriate (1.4-1.6 for body)
- [ ] Minimum 16px for body text
- [ ] Consistent usage across similar elements
- [ ] Proper CSS implementation (rem, variables)

### Originality (0-10)

| Score | Description |
|-------|-------------|
| 9-10 | Highly unique, no generic patterns, strong brand personality |
| 7-8 | Mostly original, minimal generic patterns, some personality |
| 5-6 | Some customization, recognizable generic patterns |
| 3-4 | Mostly generic, obvious AI patterns, no personality |
| 1-2 | Pure vibe-code, all defaults, completely generic |

**Key Checkpoints:**
- [ ] No generic gradients (purple-blue, etc.)
- [ ] Layout patterns customized from stock
- [ ] Framework defaults modified
- [ ] Decorative elements are purposeful
- [ ] Real content (not placeholder)
- [ ] Distinct brand personality present

## WCAG 2.1 Checklist

### Level A (Must Pass)

| Criterion | Description | Check |
|-----------|-------------|-------|
| 1.1.1 | Non-text content has alt text | Images, icons |
| 1.3.1 | Info and relationships in markup | Semantic HTML |
| 1.3.2 | Meaningful sequence | DOM order matches visual |
| 1.4.1 | Color not sole indicator | Don't rely on color alone |
| 2.1.1 | Keyboard accessible | All functionality via keyboard |
| 2.1.2 | No keyboard trap | Can tab away from all elements |
| 2.4.1 | Bypass blocks | Skip links present |
| 2.4.2 | Page titled | Descriptive title |
| 2.4.4 | Link purpose clear | From link text or context |
| 3.1.1 | Language of page | `lang` attribute on html |
| 4.1.1 | Valid markup | No parsing errors |
| 4.1.2 | Name, role, value | ARIA where needed |

### Level AA (Should Pass)

| Criterion | Description | Check |
|-----------|-------------|-------|
| 1.4.3 | Contrast minimum | 4.5:1 normal, 3:1 large |
| 1.4.4 | Resize text | Works at 200% zoom |
| 1.4.5 | Images of text | Avoid, use real text |
| 2.4.6 | Headings descriptive | Clear, meaningful |
| 2.4.7 | Focus visible | Clear focus indicators |
| 3.2.3 | Consistent navigation | Same order throughout |
| 3.2.4 | Consistent identification | Same function = same name |

### Level AAA (Recommended)

| Criterion | Description | Check |
|-----------|-------------|-------|
| 1.4.6 | Enhanced contrast | 7:1 normal, 4.5:1 large |
| 1.4.8 | Visual presentation | Line length, spacing |
| 2.4.9 | Link purpose alone | Clear from link text only |

## Issue Classification

### Critical (Blocks Deployment)
- WCAG Level A failures
- Color contrast below 3:1
- Broken core functionality
- Unreadable text
- Keyboard traps
- Missing skip links

### High Priority (Fix Before Launch)
- WCAG Level AA failures
- Color contrast 3:1-4.5:1 (below AA)
- Significant layout issues
- Poor visual hierarchy
- Major spacing inconsistencies
- No focus indicators

### Medium Priority (Fix Soon)
- Minor spacing issues
- Suboptimal color choices
- Typography tweaks
- Enhancement opportunities
- WCAG AAA suggestions

### Low Priority (Nice to Have)
- Micro-interaction polish
- Animation refinements
- Advanced accessibility features
- Performance optimizations

## Iteration Strategy

### Explore Phase (Iterations 1-5)
- Try bold, different approaches
- Don't optimize prematurely
- Focus on overall direction
- MUST complete all 5 iterations even if gates pass early
- Use early passing to polish and exceed thresholds

### Exploit Phase (Iterations 6-12)
- Refine the best approach
- Fix specific issues identified
- Optimize for quality gates
- Polish and perfect

### Pivot Phase (Iterations 13-20)
- If stuck, try completely different direction
- Re-run research with new direction
- Reset assumptions
- Challenge previous decisions
- Consider alternative approaches

## Score Calculation

```
Overall Score = (Spatial × 0.25) + (Color × 0.25) +
                (Typography × 0.25) + (Originality × 0.25)

Pass Criteria:
- Minimum iterations >= 5
- Overall >= 9.5 (95%)
- All dimensions >= 9.0
- Originality >= 9.5
- Vibe-code probability < 1%
- Critical issues = 0
- WCAG AA = 100%
```

## Failure Patterns

### Score Plateau
**Detection:** No improvement for 2+ iterations
**Action:** Switch to Pivot strategy, try different approach

### Recurring Issues
**Detection:** Same issues appear after "fixing"
**Action:** Address root cause, not symptoms

### Regression
**Detection:** Scores decreasing
**Action:** Revert to previous best, analyze what broke

### Dimension Imbalance
**Detection:** One dimension consistently low
**Action:** Focused iteration on weak dimension

# Vibe-Code Anti-Patterns

"Vibe-code" refers to generic, AI-generated design patterns that lack intentionality and feel mass-produced. This reference helps identify and avoid these patterns.

## Visual Anti-Patterns

### 1. The Gradient Problem
**Bad:**
- Purple-to-blue gradients everywhere
- Gradient backgrounds on text sections
- Rainbow gradients on buttons
- Gradients that don't serve a purpose

**Good:**
- Solid colors with intentional accent gradients
- Subtle gradients for depth (not decoration)
- Gradients that reinforce brand identity
- Monochromatic gradient variations

### 2. The Border Radius Epidemic
**Bad:**
- `border-radius: 20px` on everything
- Inconsistent rounding across elements
- Pill shapes where rectangles work better
- Over-rounded cards and containers

**Good:**
- Consistent radius scale (4px, 8px, 12px)
- Sharper corners for professional contexts
- Radius that matches element proportions
- Intentional full-round only for avatars/badges

### 3. The Shadow Addiction
**Bad:**
- Heavy drop shadows on all elements
- Multiple shadow layers for "depth"
- Shadows that don't match light source
- Colored shadows without purpose

**Good:**
- Subtle, realistic shadows
- Consistent shadow direction
- Shadows only where needed for hierarchy
- Consider shadowless, flat designs

### 4. The Generic Card Grid
**Bad:**
- Three identical cards in a row
- Icon + heading + paragraph format everywhere
- Equal-sized cards regardless of content
- Centered everything

**Good:**
- Varied card sizes based on importance
- Unique layouts per content type
- Left-aligned text (better readability)
- Hierarchy through size, not uniformity

## Typography Anti-Patterns

### 5. The Font Faux Pas
**Bad:**
- Poppins/Montserrat for everything
- Display fonts for body text
- Inconsistent font weights
- Too many font families (>2)

**Good:**
- Intentional font pairing
- Appropriate fonts for context
- Consistent weight scale
- Body fonts optimized for reading

### 6. The Hierarchy Collapse
**Bad:**
- All headings look similar
- No clear size progression
- Random bold/italic usage
- Identical styling across sections

**Good:**
- Clear size scale (1.25-1.5 ratio)
- Consistent heading styles
- Strategic emphasis
- Section differentiation

## Layout Anti-Patterns

### 7. The Centered Everything
**Bad:**
- Center-aligned body text
- Centered navigation items
- Centered form labels
- Centered everything on mobile

**Good:**
- Left-align body text
- Strategic center alignment (heroes only)
- Form labels above or left of inputs
- Consistent alignment per section

### 8. The Whitespace Void
**Bad:**
- Either cramped or swimming in space
- Inconsistent padding/margins
- No breathing room around text
- Random spacing values

**Good:**
- 8pt grid system consistently
- Proportional spacing relationships
- Adequate text breathing room
- Logical spacing progression

## Content Anti-Patterns

### 9. The Placeholder Problem
**Bad:**
- Lorem ipsum in final designs
- "Click here" button text
- Generic stock photo aesthetics
- "Your Company Name" placeholders

**Good:**
- Realistic content mockups
- Action-oriented button text
- Authentic or custom imagery
- Specific, contextual content

### 10. The Icon Overload
**Bad:**
- Icons for every feature
- Generic icon sets without meaning
- Icons replacing clear labels
- Inconsistent icon styles

**Good:**
- Icons that add meaning
- Consistent icon family
- Labels with optional icons
- Purposeful icon usage

## Detection Checklist

Use this checklist to score vibe-code probability:

| Pattern | Present? | Weight |
|---------|----------|--------|
| Generic purple-blue gradient | +15% |
| Over-rounded corners | +10% |
| Heavy shadows everywhere | +10% |
| Three-card grid layout | +10% |
| Poppins/Montserrat default | +10% |
| Center-aligned body text | +10% |
| Lorem ipsum content | +15% |
| Generic icon usage | +10% |
| Inconsistent spacing | +10% |
| No clear hierarchy | +15% |

**Scoring:**
- 0-10%: Distinctive, professional
- 11-25%: Some generic elements
- 26-50%: Noticeably AI-generated
- 51%+: Obvious vibe-code

## Remediation Strategies

### Quick Wins
1. Replace gradient with solid color
2. Reduce border radius by 50%
3. Remove unnecessary shadows
4. Left-align body text
5. Add real content

### Deeper Fixes
1. Research sector-specific patterns
2. Develop unique color palette
3. Create custom spacing scale
4. Design with content-first approach
5. Add personality through details

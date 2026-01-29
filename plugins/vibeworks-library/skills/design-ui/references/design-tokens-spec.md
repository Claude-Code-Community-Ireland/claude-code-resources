# Design Tokens Specification

This document defines the Style Dictionary JSON format used for design token output.

## Token Structure

Design tokens follow the Style Dictionary format with nested categories:

```json
{
  "category": {
    "item": {
      "value": "<value>",
      "type": "<type>",
      "description": "<description>"
    }
  }
}
```

## Required Token Categories

### 1. Color Tokens

```json
{
  "color": {
    "primary": {
      "value": "#1a73e8",
      "type": "color",
      "description": "Primary brand color"
    },
    "primary-hover": {
      "value": "#1557b0",
      "type": "color",
      "description": "Primary color hover state"
    },
    "primary-active": {
      "value": "#104a96",
      "type": "color",
      "description": "Primary color active state"
    },
    "secondary": {
      "value": "#34a853",
      "type": "color",
      "description": "Secondary brand color"
    },
    "background": {
      "value": "#ffffff",
      "type": "color",
      "description": "Page background"
    },
    "surface": {
      "value": "#f8f9fa",
      "type": "color",
      "description": "Card and elevated surface background"
    },
    "text": {
      "primary": {
        "value": "#202124",
        "type": "color",
        "description": "Primary text color"
      },
      "secondary": {
        "value": "#5f6368",
        "type": "color",
        "description": "Secondary/muted text"
      },
      "inverse": {
        "value": "#ffffff",
        "type": "color",
        "description": "Text on dark backgrounds"
      }
    },
    "border": {
      "value": "#dadce0",
      "type": "color",
      "description": "Default border color"
    },
    "error": {
      "value": "#d93025",
      "type": "color",
      "description": "Error state color"
    },
    "success": {
      "value": "#1e8e3e",
      "type": "color",
      "description": "Success state color"
    },
    "warning": {
      "value": "#f9ab00",
      "type": "color",
      "description": "Warning state color"
    }
  }
}
```

### 2. Spacing Tokens

Based on 8pt grid system:

```json
{
  "spacing": {
    "0": { "value": "0", "type": "spacing" },
    "1": { "value": "4px", "type": "spacing", "description": "4px - Extra small" },
    "2": { "value": "8px", "type": "spacing", "description": "8px - Small" },
    "3": { "value": "12px", "type": "spacing", "description": "12px - Small-medium" },
    "4": { "value": "16px", "type": "spacing", "description": "16px - Medium (base)" },
    "5": { "value": "20px", "type": "spacing", "description": "20px - Medium-large" },
    "6": { "value": "24px", "type": "spacing", "description": "24px - Large" },
    "8": { "value": "32px", "type": "spacing", "description": "32px - Extra large" },
    "10": { "value": "40px", "type": "spacing", "description": "40px - 2x large" },
    "12": { "value": "48px", "type": "spacing", "description": "48px - 3x large" },
    "16": { "value": "64px", "type": "spacing", "description": "64px - Section spacing" },
    "20": { "value": "80px", "type": "spacing", "description": "80px - Large section" },
    "24": { "value": "96px", "type": "spacing", "description": "96px - Hero spacing" }
  }
}
```

### 3. Typography Tokens

```json
{
  "typography": {
    "fontFamily": {
      "heading": {
        "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "type": "fontFamily"
      },
      "body": {
        "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        "type": "fontFamily"
      },
      "mono": {
        "value": "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        "type": "fontFamily"
      }
    },
    "fontSize": {
      "xs": { "value": "12px", "type": "fontSize" },
      "sm": { "value": "14px", "type": "fontSize" },
      "base": { "value": "16px", "type": "fontSize" },
      "lg": { "value": "18px", "type": "fontSize" },
      "xl": { "value": "20px", "type": "fontSize" },
      "2xl": { "value": "24px", "type": "fontSize" },
      "3xl": { "value": "30px", "type": "fontSize" },
      "4xl": { "value": "36px", "type": "fontSize" },
      "5xl": { "value": "48px", "type": "fontSize" },
      "6xl": { "value": "60px", "type": "fontSize" }
    },
    "fontWeight": {
      "normal": { "value": "400", "type": "fontWeight" },
      "medium": { "value": "500", "type": "fontWeight" },
      "semibold": { "value": "600", "type": "fontWeight" },
      "bold": { "value": "700", "type": "fontWeight" }
    },
    "lineHeight": {
      "tight": { "value": "1.25", "type": "lineHeight" },
      "normal": { "value": "1.5", "type": "lineHeight" },
      "relaxed": { "value": "1.625", "type": "lineHeight" },
      "loose": { "value": "2", "type": "lineHeight" }
    },
    "letterSpacing": {
      "tight": { "value": "-0.025em", "type": "letterSpacing" },
      "normal": { "value": "0", "type": "letterSpacing" },
      "wide": { "value": "0.025em", "type": "letterSpacing" }
    }
  }
}
```

### 4. Border Tokens

```json
{
  "border": {
    "width": {
      "0": { "value": "0", "type": "borderWidth" },
      "1": { "value": "1px", "type": "borderWidth" },
      "2": { "value": "2px", "type": "borderWidth" },
      "4": { "value": "4px", "type": "borderWidth" }
    },
    "radius": {
      "none": { "value": "0", "type": "borderRadius" },
      "sm": { "value": "4px", "type": "borderRadius" },
      "md": { "value": "8px", "type": "borderRadius" },
      "lg": { "value": "12px", "type": "borderRadius" },
      "xl": { "value": "16px", "type": "borderRadius" },
      "full": { "value": "9999px", "type": "borderRadius" }
    }
  }
}
```

### 5. Shadow Tokens

```json
{
  "shadow": {
    "none": { "value": "none", "type": "boxShadow" },
    "sm": {
      "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "type": "boxShadow"
    },
    "md": {
      "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "type": "boxShadow"
    },
    "lg": {
      "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      "type": "boxShadow"
    },
    "xl": {
      "value": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "type": "boxShadow"
    }
  }
}
```

### 6. Breakpoint Tokens

```json
{
  "breakpoint": {
    "sm": { "value": "640px", "type": "dimension", "description": "Small devices" },
    "md": { "value": "768px", "type": "dimension", "description": "Tablets" },
    "lg": { "value": "1024px", "type": "dimension", "description": "Laptops" },
    "xl": { "value": "1280px", "type": "dimension", "description": "Desktops" },
    "2xl": { "value": "1536px", "type": "dimension", "description": "Large screens" }
  }
}
```

## Complete Token File Template

The generator should output a complete `design-tokens.json` with all categories merged:

```json
{
  "$schema": "https://style-dictionary.com/schema.json",
  "color": { ... },
  "spacing": { ... },
  "typography": { ... },
  "border": { ... },
  "shadow": { ... },
  "breakpoint": { ... }
}
```

## CSS Variable Output

The generator should also include CSS custom properties in `styles.css`:

```css
:root {
  /* Colors */
  --color-primary: #1a73e8;
  --color-secondary: #34a853;
  /* ... */

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  /* ... */

  /* Typography */
  --font-family-heading: Inter, sans-serif;
  --font-size-base: 16px;
  /* ... */
}
```

## Validation Rules

Tokens must pass these validations:

1. **Color contrast**: Primary text on background ≥ 4.5:1
2. **Spacing scale**: Uses 8pt grid multiples
3. **Typography scale**: Consistent ratio (1.25 or 1.333)
4. **No magic numbers**: All values reference tokens
5. **Complete coverage**: All categories present

# CLAUDE.md — Engineering Guide

## Project Overview
- Stack: Next.js 13 (pages router) + Nextra v3 (docs theme) + TypeScript
- Purpose: Investor‑ready docs with charts and a "Thesis Builder" for exportable presentations
- Branding: Noetic 2.0 — professional, data‑forward, clean UI

## Runbook
- Prereqs: Node 18.x or 20.x recommended (use `nvm`), npm preferred
- Install: `npm install` (package‑lock present). If you prefer: `pnpm i`
- Dev: `npm run dev` then open http://localhost:3000
- Build: `npm run build`
- Prod: `npm start`

### Dev Server Troubleshooting
- Port/permission errors (e.g., EPERM listen 0.0.0.0): run `npx next dev -H 127.0.0.1 -p 3000`
- Clear cache: delete `.next` then retry `npm run dev`
- Node version: prefer 18.x or 20.x. Avoid experimental 22.x for now
- TypeScript stops server: fix compile errors; dev server won't serve pages until TS passes
  - Recently fixed: duplicate `else if (selection.type === 'phase')` in `components/thesis/PreviewPanel.tsx` which caused a TS narrowing error and blocked builds

### Security & Dependency Issues
- **CRITICAL**: Run `npm audit fix --force` to address 10 security vulnerabilities (1 moderate, 9 high)
  - Next.js: Multiple SSRF, cache poisoning, and authorization bypass vulnerabilities
  - PDF.js: JavaScript execution vulnerability in malicious PDFs
  - Puppeteer: DoS vulnerabilities in WebSocket handling
  - DOMPurify: XSS vulnerability in jsPDF dependency
- Consider updating to Next.js 14+ and latest dependency versions for production use
- **Recommended**: Set up automated dependency scanning in CI/CD pipeline

## Repo Structure

- `pages/` — MDX pages + navigation
  - `index.mdx` (landing), `advanced.mdx`, `another.mdx`, `thesis-builder.mdx`
  - `cns-acquisition/` section with `criteria.mdx`
  - `_app.tsx` wires global styles and chart config
  - `_meta.tsx` controls sidebar/nav ordering and labels
- `components/`
  - Charts: `NoeticCharts.tsx` (MarketLine, CapitalDoughnut, NoeticOsRadar, PlatformKpiBar, ValueCreationDualAxis, ReturnBar)
  - Dynamic imports: `ChartComponents.tsx` (code splitting + SSR false)
  - Layout/UI: `DashboardCard.tsx`, `PhaseTabs.tsx`, `Phases.tsx`, `ErrorBoundary.tsx`
  - Thesis Builder: `components/thesis/` — `ThesisBuilder.tsx`, `DataSelector.tsx`, `PreviewPanel.tsx`, `ExportControls.tsx`, `ChartCapture.tsx`, `DynamicThesisBuilder.tsx`, `TemplateSelector.tsx`
- `lib/chart-config.ts` — registers Chart.js parts and exports `commonChartOptions` + `chartColors`
- `data/noetic-metrics.json` — canonical data for charts, phases, risks, and capital plan
- `hooks/useMetricsData.ts` — memoized data access + small helpers (phase lookup, risk filter)
- `styles/global.css` — global styles, utility classes (hero, dash-grid, risk chips, etc.)
- `theme.config.tsx` — Nextra theme config (branding, SEO, head, footer)

## Implementation Guidelines

- TypeScript: add prop interfaces, avoid `any`, keep discriminated unions consistent with `types/data.ts`
- Components:
  - Wrap chart renderings with `ErrorBoundary`
  - Prefer dynamic imports for chart components to keep TTI fast
  - Keep `className` passthroughs and accessibility attrs (`aria-*`)
  - **NEW**: Mark props as `readonly` to prevent mutations
  - **NEW**: Use proper ARIA patterns (avoid `aria-selected` on buttons)
  - **NEW**: Add keyboard event handlers for interactive elements
- Charts:
  - Use `commonChartOptions` and `chartColors` from `lib/chart-config.ts`
  - Read from `data/noetic-metrics.json` via `useMetricsData()` where possible
- Styling:
  - Reuse existing classes (`hero`, `dash-grid`, `card`, `phase-tabs`, `risk-chip`)
  - Keep CSS changes minimal and consistent with the current design
- Content/Docs:
  - New pages → add `.mdx` in `pages/` and entries in `pages/_meta.tsx`
  - Keep tone and structure professional and investor‑friendly

## Code Quality Improvements Needed

### High Priority (Performance & Security)

1. **Fix useEffect Dependencies**:
   - `NeuralMarketMapper.tsx:313` - `mountRef.current` will likely change by cleanup
   - `ChartCapture.tsx:62` - `captureChart` function needs `useCallback` wrapper
2. **Update Security Vulnerabilities**: Run `npm audit fix --force` to address critical issues
3. **Replace `<img>` with `<Image />`**: In `ChartCapture.tsx` for better Core Web Vitals

### Medium Priority (Code Quality)

1. **Reduce Function Nesting**: Extract nested functions in `PreviewPanel.tsx` to component level
2. **Fix Array Mutations**: Replace `.sort()` with `.toSorted()` for immutability  
3. **Add Readonly Props**: Mark component props as `readonly` to prevent mutations
4. **Remove Type Assertions**: Unnecessary `as string` casts in `PreviewPanel.tsx`

### Low Priority (Maintainability)

1. **Accessibility Improvements**: Add keyboard handlers and proper ARIA attributes
2. **Consistent Dependencies**: Align `pnpm` vs `npm` usage across project files

## Common Tasks

- Add a new chart:
  1) Extend `data/noetic-metrics.json` and types if needed
  2) Implement in `components/NoeticCharts.tsx` and wire dynamically via `ChartComponents.tsx`
  3) Surface in pages or Thesis Builder
- Add a new phase or metric:
  - Update `data/noetic-metrics.json` and consume via `useMetricsData()`
- Extend Thesis Builder:
  - Use `types/data.ts` unions; update `DataSelector`, `PreviewPanel`, `ExportControls` deterministically
- Export features (PDF/PPTX):
  - Deps available: `html2canvas`, `jspdf`, `pptxgenjs` (see `ChartCapture.tsx` and `ExportControls.tsx`)

## Quality & CI

- Lint: `npm run lint` or `npm run lint:fix` (rules via Next/ESLint)
- Type check: `npm run type-check`
- Build checks: GitHub Actions (if configured) runs install → lint → build

## Known Issues & Notes

- **React Hook Dependencies**: Multiple useEffect dependency violations in `NeuralMarketMapper.tsx` and `ChartCapture.tsx`
  - Fix: Wrap functions in `useCallback` and add missing dependencies
  - Priority: High - can cause stale closures and memory leaks
- **Accessibility Violations**:
  - Invalid `aria-selected` on button elements in `InsightsSidebar.tsx`
  - Missing keyboard handlers for clickable divs in `PreviewPanel.tsx`
  - Fix: Use proper ARIA attributes and add `onKeyDown` handlers
- **Code Quality Issues**:
  - Deep function nesting (>4 levels) in `PreviewPanel.tsx` causing complexity warnings
  - Array mutation with `.sort()` should use `.toSorted()` for immutability
  - Unnecessary type assertions can be removed
  - Missing readonly props on React components
- **Performance & Security**:
  - Using `<img>` instead of Next.js `<Image />` in `ChartCapture.tsx` affects LCP
  - Sandbox/CI environments may block port binding; use `-H 127.0.0.1` if needed
  - ESLint warnings in `components/thesis/ChartCapture.tsx` (`react-hooks/exhaustive-deps`, `@next/next/no-img-element`) are safe to address incrementally
- **Package Management**: README mentions `pnpm`; project currently uses npm (see `package-lock.json`). Either works locally if used consistently

## Deployment

- Vercel config present via `vercel.json` and theme settings in `theme.config.tsx`
- Custom script: `npm run deploy` (see `scripts/deploy.sh`)

— End —


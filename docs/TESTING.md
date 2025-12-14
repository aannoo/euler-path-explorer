# EULER App Testing Strategy

This document outlines the testing infrastructure and workflows for the EULER graph visualization application.

## Testing Overview

EULER uses two complementary testing approaches:
1. **Playwright E2E Tests** - Automated browser tests for regression testing
2. **Chrome DevTools MCP** - Interactive testing and performance analysis

## Playwright E2E Tests

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/euler-app.spec.js

# Run tests with verbose output
npm run test:e2e -- --reporter=list
```

### Test Coverage

Current tests cover:
- **Page Load** - Title, main UI elements visibility
- **Graph Layer** - Graph container and layer rendering
- **Calculate Euler** - Button click, results display
- **Edge Input** - Text input validation
- **Section Headers** - INPUT, RESULTS, SAVED sections
- **Graph Toggles** - Directed/weighted property toggles
- **Graph Rendering** - Canvas elements after calculation
- **Editor Modes** - Text/Visual mode switching

### Key Selectors

| Element | Selector |
|---------|----------|
| Edge Input | `#edges` |
| Calculate Button | `#calculate` |
| Graph Layer | `#graph-layer` |
| Graph Container | `.graph-container` |
| Result Section | `#result` |
| Result Title | `#result-title` |
| Directed Toggle | `#directed-toggle` |
| Weighted Toggle | `#weighted-toggle` |
| Text Mode Button | `#text-mode-btn` |
| Visual Mode Button | `#visual-mode-btn` |

### Adding New Tests

Test files go in `tests/e2e/`. Follow the existing pattern:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#graph-layer', { state: 'visible', timeout: 10000 });
  });

  test('test description', async ({ page }) => {
    // Test implementation
  });
});
```

## Chrome DevTools MCP Testing

Chrome DevTools MCP provides interactive testing capabilities for manual verification and performance analysis.

### Workflow

#### 1. Navigate to Page
```
mcp__chrome-devtools__navigate_page
- url: http://localhost:8888
- type: url
```

#### 2. Take UI Snapshot
```
mcp__chrome-devtools__take_snapshot
```
Returns accessibility tree with UIDs for each element. Use UIDs to interact with elements.

#### 3. Interact with Elements
```
# Click a button
mcp__chrome-devtools__click
- uid: <element_uid>

# Fill an input
mcp__chrome-devtools__fill
- uid: <element_uid>
- value: "[a,b],[b,c],[c,a]"
```

#### 4. Take Screenshot
```
mcp__chrome-devtools__take_screenshot
```
Captures current viewport state for visual verification.

#### 5. Check Console Messages
```
mcp__chrome-devtools__list_console_messages
```
Lists all console output for debugging.

#### 6. Performance Trace
```
mcp__chrome-devtools__performance_start_trace
- reload: true
- autoStop: true
```
Captures performance metrics including LCP, CLS, and detailed timing breakdowns.

#### 7. Analyze Performance Insights
```
mcp__chrome-devtools__performance_analyze_insight
- insightSetId: NAVIGATION_0
- insightName: LCPBreakdown
```

### Key Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2500ms | 911ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.01 |
| TTFB (Time to First Byte) | < 100ms | 18ms |

### LCP Breakdown

For EULER app, LCP is dominated by render delay due to:
- Sigma.js graph initialization
- CSS processing (bundle.css)
- Font loading

Current breakdown:
- TTFB: 18ms (2%)
- Render Delay: 893ms (98%)

### Example Test Scenarios

#### Scenario 1: Basic Graph Calculation
1. Navigate to localhost:8888
2. Take snapshot to verify page loaded
3. Fill edge input with `[a,b],[b,c],[c,a]`
4. Click calculate button
5. Wait for results
6. Take snapshot to verify "EULER CIRCUIT FOUND"

#### Scenario 2: Performance Baseline
1. Start performance trace with reload
2. Wait for trace to complete
3. Check LCP < 1000ms
4. Check CLS < 0.1
5. Analyze LCPBreakdown for bottlenecks

#### Scenario 3: Editor Mode Switching
1. Take snapshot - verify TEXT mode active
2. Click VISUAL mode button
3. Take snapshot - verify VISUAL mode active
4. Verify visual editor visible

## Test Maintenance

### When to Update Tests
- New UI elements added
- Selector IDs/classes changed
- New features implemented
- Bug fixes that change behavior

### Debugging Failed Tests
1. Run with `--headed` to see browser
2. Use `--debug` for step-by-step execution
3. Check `test-results/` for screenshots and traces
4. Use Chrome DevTools MCP for interactive debugging

## Configuration

### Playwright Config (`playwright.config.js`)
- Test directory: `./tests/e2e`
- Base URL: `http://localhost:8888`
- Browser: Chromium
- Web server: Auto-starts `npm run dev`

### Dev Server
Vite dev server runs on port 8888. Tests automatically start it if not running.

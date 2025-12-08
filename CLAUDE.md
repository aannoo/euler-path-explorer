# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

IMPORTANT: USE BD BEADS!
IMPORTANT: USE HCOM!

## Project Overview

EULER is a sophisticated graph theory visualization web application for exploring Euler paths. Built with vanilla JavaScript (ES6 modules), it features an orange-themed interface with Leonhard Euler's portrait, mobile-first design with advanced gesture controls, and Sigma.js-powered graph visualization.

Key files: ARCHITECTURE.md and CLAUDE.md files in each folder:
- /js/CLAUDE.md
- /js/core/CLAUDE.md
- /js/graph/CLAUDE.md
- /js/ui/CLAUDE.md
- /js/utils/CLAUDE.md
- /css/CLAUDE.md

**Technical debt and issues are tracked in `/supposed-issues.md`**


## Commands

### Development
```bash
npm run dev        # Start Vite dev server on port 8888 (auto-opens browser)
npm run build      # Build for production with Vite (outputs to dist/)
npm run preview    # Preview production build
npm run serve      # Alternative HTTP server on port 8000
```

### Installation
```bash
npm install        # Install all dependencies
```

Note: No test commands are configured. The project has no testing infrastructure currently.

## Build Configuration

**Vite Configuration** (`vite.config.js`):
- Dev server runs on port 8888 with auto-open
- Base path: `./` for relative deployment
- Build outputs to `dist/` with sourcemaps
- Optimized dependencies include Sigma.js and Graphology libraries

## Architecture

### Module Organization

The codebase follows a layered architecture (~8,000 lines of JavaScript across 17 modules):

- **js/main.js** - Application bootstrap and orchestration
- **js/core/** - Business logic layer (state management, algorithms, storage)
  - `state.js` - Reactive pub/sub state management system
  - `algorithm.js` - Euler path detection and Chinese Postman algorithms
  - `storage.js` - Graph persistence and example library
- **js/graph/** - Visualization layer
  - `model.js` - Graph data structures
  - `sigma-adapter.js` - Sigma.js integration (2,106 lines - needs modularization)
  - `sigma-controller.js` - High-level graph operations
- **js/ui/** - Interface layer  
  - `init.js` - UI initialization (1,143 lines - needs modularization)
  - `saved-graphs.js` - Graph management panel (1,406 lines - needs modularization)
  - `visual-editor.js` - Interactive graph editing
- **js/utils/** - Foundation utilities
  - `canvas-gesture.js` - Mobile gesture controller (1,185 lines - over-engineered)
  - `dom.js`, `events.js`, `validation.js` - Core utilities

### State Management Pattern

Centralized reactive state with pub/sub pattern in `core/state.js`:

```javascript
// Complete state shape
const state = {
  graph: { 
    directed: false, 
    weighted: false, 
    edges: [] 
  },
  ui: { 
    sidebarExpanded: true, 
    activeTab: 'input',  // 'input' | 'results' | 'saved'
    explanationVisible: false,
    editorMode: 'text'   // 'text' | 'visual'
  },
  animation: { 
    inProgress: false, 
    currentStep: 0, 
    path: null 
  },
  euler: { 
    hasPath: false, 
    isCircuit: false, 
    path: null, 
    explanation: '',
    isChinesePostman: false,
    totalWeight: 0,
    duplicatedEdges: []
  }
};

// Usage pattern
import { getState, setState, subscribe } from './core/state.js';

// Subscribe returns unsubscribe function
const unsubscribe = subscribe('graph.edges', (edges) => {
  // React to changes
});

// State changes notify all subscribers (including parent paths)
setState('graph.edges', newEdges);
```

Components subscribe to state changes and update automatically. State updates flow: User Input → Validation → State Update → Notify Subscribers → UI Updates.

### Mobile-First Architecture

The application uses a dual-interface approach:
- **Desktop (≥769px)**: Side-by-side layout with controls (35%) and graph (65%)
- **Mobile (≤768px)**: Layered interface with sliding content panel over fixed graph
  - Uses invisible canvas overlay (z-index 100) for gesture detection
  - CanvasGestureController bypasses DOM event limitations
  - Three states: normal, split, retracted

**Critical Breakpoint**: 768px determines completely different interaction models.

The mobile interface features a complex canvas-based gesture system (over-engineered, consider simplification).

## Key Dependencies

- **sigma** (v3.0.1) - Graph visualization engine
- **graphology** (v0.25.4) - Graph data structures
- **graphology-layout-forceatlas2** - Force-directed layouts
- **uuid** - Unique identifier generation
- **chroma-js** - Color manipulation

## Graph Input Formats

### Text Mode (Edge List)
```
[a,b],[b,c],[c,d],[d,a]
```

### Weighted Graph Format
```
[a,b,5],[b,c,3],[c,d,7]
```

### Euler Line Format
```
A-B
B-C
C-A
```
- `A-B` and `A<->B` are bidirectional
- `A->B` is directed

### JSON Format (Sigma.js compatible)
```json
[
  {"source": "a", "target": "b"},
  {"source": "b", "target": "c"}
]
```

## Data Persistence

### localStorage Keys
- `euler_saved_graphs` – Array of saved graph objects
- `euler_graph_counter` – Auto-incrementing counter for default names

### Saved Graph Structure
```javascript
{
  id: Date.now().toString(),
  name: 'Graph 1',
  edges: "[a,b],[b,c],[c,a]", // string edge list
  directed: false,
  weighted: false,
  date: "2025-03-01T12:34:56.789Z" // ISO string
}
```

## Algorithm Implementations

### Core Algorithms (`core/algorithm.js`)

**Euler Path Detection** (Hierholzer's Algorithm):
- Checks vertex degrees (odd degree count determines path existence)
- Path exists: 0 or 2 vertices with odd degree
- Circuit exists: All vertices have even degree
- Returns: `{ path, hasPath, hasCircuit, explanation }`

**Chinese Postman Algorithm** (for weighted graphs):
- Finds minimum-weight tour by duplicating edges
- Handles graphs without natural Euler paths
- Uses shortest path calculations between odd-degree vertices
- Returns additional: `{ isChinesePostman, totalWeight, duplicatedEdges }`

**Helper Algorithms**:
- `countDegrees()` - Calculate vertex degrees
- `dijkstra()` - Shortest path for weighted graphs  
- `hierholzerAlgorithm()` - Core path finding logic
- Graph connectivity checking

## CSS Architecture

17 CSS files (~1,800 lines) with orange-based theme (#ff5a1f primary). Key files:
- `base.css` - Custom properties, typography
- `layout.css` - Responsive grid system
- `branding.css` - Orbital animations, Euler portrait
- `optimization.css` - Hardware acceleration
- `orbital-animation.css` - Dynamic CSS properties consumed by JS

### Dynamic CSS Properties (Set by JavaScript)
- `--final-scale` - Calculated scale for orbital expansion
- `--target-aspect-ratio` - Container aspect ratio

## Error Handling & Validation

### Notification System
```javascript
import { showNotification } from './ui/init.js';

showNotification('Message', 'success', 3000);  // Types: 'success', 'info', 'error'
```

### Input Validation
- Vertex names: Max 10 chars, alphanumeric + underscore only
- Edge format: `[source,target]` or `[source,target,weight]`
- Validation utilities in `utils/validation.js`:
  - `validateVertex()`, `validateEdge()`, `validateEdges()`
  - `formatValidationError()` for user-friendly messages

### Error Patterns
- Graph parsing errors caught and shown via notifications
- No API calls - purely client-side application
- Limited try-catch usage, mostly console.error logging
- Critical errors during initialization may leave app in broken state

## Memory Management & Cleanup

### Cleanup Architecture (`main.js:cleanupApplication`)
1. Execute all registered cleanup functions
2. Unsubscribe all state listeners
3. Clear notification timeouts
4. Destroy Sigma instance via `SigmaAdapter.destroySigma()`
5. Clean up desktop resize handlers

### Event Handler Management
- All event listeners should have corresponding cleanup
- State subscriptions return unsubscribe functions - store and call them
- Global cleanup available: `window.cleanupEULER()`

### Memory Leak Prevention
- Canvas gesture system requires explicit cleanup
- Sigma.js graph instances must be destroyed
- Animation frames must be cancelled
- Event listeners on window/document need removal

## Critical Integration Points

### Global Window Objects
Essential window-exposed interfaces used across modules:
```javascript
window.SigmaAdapter         // Sigma.js adapter functions
window.GraphController      // Graph control interface
window.triggerOrbitalAnimation  // Startup animation trigger
window.updateEdgeListDisplay     // Visual editor callback
window.updateGraphInfoStrip      // UI update callback
window.cleanupEULER             // Global cleanup function
```

### Critical DOM Dependencies
JavaScript expects these specific element IDs:
- `#orbital-welcome` - Startup animation (removal breaks init)
- `#page-loader` - Loading sequence
- `#content-layer` - Mobile gesture target
- `#graph-layer` - Graph container
- `.graph-container` - Animation calculations
- Desktop controls: `#desktop-zoom-in`, `#desktop-fit`, `#desktop-zoom-out`

### Initialization Sequence (main.js)
**CRITICAL ORDER - DO NOT CHANGE**:
1. Simple loader (800ms delay)
2. Orbital welcome animation setup
3. Sigma graph initialization (MUST be first)
4. UI initialization (MUST be after graph)
5. Desktop resize setup
6. State subscriptions
7. Orbital animation triggers via state changes

Breaking this order causes silent failures.

### State Keys That Trigger UI Changes
- `ui.calculationStarted` - Triggers orbital animation
- `ui.savedGraphLoaded` - Alternative orbital trigger
- `ui.contentMode` - Mobile gesture state changes
- `ui.activeTab` - Section navigation ('input'|'results'|'saved')

## Development Notes

- The application works without a build step (ES6 modules)
- Vite is used for development convenience and production optimization
- No automated tests exist - manual testing required
- Memory management requires careful cleanup (event handlers, subscriptions)
- Initialization order is fragile - see Critical Integration Points above
- No environment variables or external configuration
- Pure client-side app with localStorage for persistence

### Debug Tools (Available in Console)
```javascript
window.debugCanvas()        // Canvas gesture debugging
window.testCanvasGesture()  // Test gesture system
window.forceRetract()       // Force mobile retracted mode
window.forceNormal()        // Force mobile normal mode
```

## Additional Guidelines

### From Project Rules
- **Server**: Vite dev server runs on http://localhost:8888/ - DO NOT start a new server
- **Code Style**: Keep code lean, don't overengineer. Suggest simple solutions first
- **State Management**: Follow existing pattern with subscribe/setState from `core/state.js`
- **CSS**: Extend, don't replace CSS classes - combine base and custom classes
- **File Creation**: Always check existing files before creating new ones to avoid duplication
- **Component Patterns**: Follow existing patterns when adding new features
- **Separation of Concerns**: Maintain clean separation between UI, graph logic, and algorithms

### Additional UI/Graph State
The graph controller manages additional state not in the main state object:
- `ui.selectedNodes[]` - Currently selected nodes
- `ui.selectedEdges[]` - Currently selected edges  
- `ui.propertyEditing{}` - Property editing configuration
- `ui.visualFeatures{}` - Visual feature toggles (drag/drop, force layout, etc.)

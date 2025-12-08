# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## JavaScript Architecture Overview

The JS directory contains ~11,500 lines of vanilla JavaScript using ES6 modules, organized in a layered architecture with reactive state management.

**Key Libraries:**
- Sigma.js v3.0.1 - Graph visualization
- Graphology v0.25.4 - Graph data structures
- ForceAtlas2 - Force-directed layouts

## Commands

```bash
npm run dev        # Start development server on port 8888
npm run build      # Build for production
```

No test/lint commands are configured for JavaScript files.

## Architecture

### Initialization Order

The application requires specific initialization order in `main.js`:

```javascript
1. Orbital animation setup
2. Sigma graph initialization (MUST be before UI)  
3. UI initialization (MUST be after graph)
4. State subscriptions
```

### Memory Management Pattern

Every module initialization must return a cleanup function:

```javascript
// Pattern used throughout:
const cleanup = initModule();
cleanupFunctions.push(cleanup);

// Key cleanup points:
- Sigma instance: destroySigma()
- State subscriptions: unsubscribe()
- Event listeners: off(id)
- Canvas gestures: cleanup()
```

### Global Window Dependencies

Cross-module communication uses window objects:

```javascript
window.SigmaAdapter         // 37 exported functions
window.GraphController      // Graph operations
window.triggerOrbitalAnimation
window.updateEdgeListDisplay
window.cleanupEULER
```

## Module Dependency Graph

```
Foundation (No Dependencies):
├── utils/dom.js (39 lines)
├── utils/validation.js (239 lines)  
└── utils/canvas-gesture.js (1,184 lines)

Core Layer (Utils Only):
├── core/state.js (136 lines) - Pub/sub state
├── core/algorithm.js (490 lines) - Euler algorithms
└── core/storage.js (411 lines) → state.js

Graph Layer (Core + Utils):
├── graph/model.js (280 lines)
├── graph/sigma-adapter.js (2,219 lines)
└── graph/sigma-controller.js (1,047 lines) → 26 imports from adapter

UI Layer (All Layers):
├── ui/init.js (1,045 lines)
├── ui/saved-graphs.js (1,450 lines)
└── ui/visual-editor.js (284 lines)
```

## State Management

Centralized reactive state:

```javascript
// State shape (core/state.js)
{
  graph: { directed, weighted, edges },
  ui: { activeTab, editorMode, sidebarExpanded },
  animation: { inProgress, currentStep, path },
  euler: { hasPath, isCircuit, path, explanation }
}

// Usage pattern
import { setState, subscribe } from './core/state.js';
const unsubscribe = subscribe('graph.edges', callback);
setState('graph.edges', newEdges);

```

## State Paths

These state changes trigger important UI behaviors:

- `ui.calculationStarted` → Orbital animation
- `ui.savedGraphLoaded` → Alternative animation trigger
- `ui.activeTab` → Tab navigation
- `ui.editorMode` → Text/visual mode switch

## Large Files Reference

### sigma-adapter.js (2,219 lines)
- 37 exports
- Handles rendering, events, selection, properties

### saved-graphs.js (1,450 lines)
- UI + persistence + validation
- Complete graph management system

### canvas-gesture.js (1,184 lines)
- Mobile gesture system
- Velocity calculations and state machines

### init.js (1,045 lines)
- UI orchestration
- Module initialization

## Algorithm Implementation

### Euler Path (core/algorithm.js)
- `findEulerPath()` - Hierholzer's algorithm
- `chinesePostmanAlgorithm()` - For weighted graphs
- Path exists: 0 or 2 odd-degree vertices
- Circuit exists: All even-degree vertices

### Helper Functions
- `buildAdjacencyList()` - Edge array to adjacency list
- `countDegrees()` - Vertex degree calculation
- `dijkstra()` - Shortest path for weighted

## Module Patterns

### Component Creation (ui/components.js)
```javascript
const cleanup = createToggleButton(selector, statePath, options);
// Returns unsubscribe function for cleanup
```

### Event Management (utils/events.js)
```javascript
const id = on(element, event, handler);
off(id); // Cleanup by ID
```

### Graph Operations (graph/sigma-controller.js)
```javascript
parseEdgeInput(input) // Multiple format support
calculateEulerPath()  // Orchestrates algorithm + UI
```

## Debug Utilities

Available in browser console:

```javascript
window.debugCanvas()     // Gesture system debug overlay
window.forceRetract()    // Force mobile UI states
window.cleanupEULER()    // Manual cleanup
getState('graph.edges')  // Inspect state
```

## Development Notes

- Sigma.js instance MUST be initialized before UI
- State subscriptions return unsubscribe functions - always store them
- Canvas gesture system requires explicit cleanup
- Force layout can drain battery - needs stop conditions
- Global window objects are used for cross-module communication

**Note**: For technical debt and issues, see `/supposed-issues.md`
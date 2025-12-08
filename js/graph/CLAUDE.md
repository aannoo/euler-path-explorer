# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Graph Module Overview

Sigma.js visualization layer with 3,546 lines across 3 files. Contains the most tightly-coupled code requiring refactoring.

## Critical Refactoring Needed

### sigma-adapter.js (2,219 lines, 37 exports)
Should be split into:
- `sigma-renderer.js` - Core rendering and initialization
- `sigma-events.js` - Event handling and selection  
- `sigma-properties.js` - Node/edge property management
- `sigma-layouts.js` - Layout algorithms and force physics
- `sigma-animations.js` - Path animations and highlighting

Key exports that MUST remain accessible:
- `initializeSigma()`, `destroySigma()` - Lifecycle management
- `renderGraph()` - Main rendering function
- `getSelectedNodes()`, `getSelectedEdges()` - Selection state

### sigma-controller.js Coupling
Imports 26 functions from sigma-adapter.js. Consider facade pattern to reduce coupling.

## Undocumented APIs

### Graph Model Hidden Features
```javascript
// model.js - Auto-incrementing IDs
graph._nodeIdCounter // Used for n0, n1, n2...
graph._edgeIdCounter // Used for e0, e1, e2...

// O(1) adjacency lookup via internal map
graph._edgeLookup // Map<source, Set<targets>>
```

### Sigma Adapter Internal State
```javascript
// Not exposed but critical for debugging
let sigmaInstance = null
let graphInstance = null  
let forceLayout = null
let selectedNodes = new Set() // Selection NOT in main state
let selectedEdges = new Set()
let currentAnimation = null // Prevents overlapping animations
```

### Force Layout Worker
```javascript
// Uses ForceSupervisor from graphology-layout-force/worker
// Runs in web worker for performance
// No automatic stop condition - drains battery if not paused
```

## Edge Format Parsers

sigma-controller.js `parseEdgeInput()` supports undocumented formats:
- Mixed delimiters: `"a,b;c,d"` 
- Spaces ignored: `"[ a , b ] , [ c , d ]"`
- Euler line shortcuts: `"A<->B"` (bidirectional), `"A->B"` (directed)

## Performance Bottlenecks

1. **convertToGraphology()** - Full graph rebuild on every change
2. **renderGraph()** - No incremental updates, full rerender
3. **Force layout** - Continuous 20-30% CPU when active
4. **No edge batching** - Each edge added individually

## Memory Leak Points

```javascript
// sigma-adapter.js registeredIntervals array
registeredIntervals.push(intervalId) // Never cleared except on destroy

// Global event listeners added but not tracked
document.addEventListener('keydown', handleKeyDown)
// Only removed in destroySigma()

// CRITICAL: Must call destroySigma() to prevent memory leak
// Force layout worker runs indefinitely if not paused
pauseForceLayout() // Saves 20-30% CPU
```

## Undocumented Visual Features

```javascript
// sigma-controller.js visualFeatures object
enableVisualCreation: false // Hidden node creation via double-click
```

## Critical Initialization Order

**MUST be initialized before UI or app breaks silently:**
```javascript
// main.js initialization order - DO NOT CHANGE
const graphController = initializeSigmaGraph('#cy'); // FIRST
const uiCleanup = initializeUI(); // SECOND
```

### Timing Issues
```javascript
// sigma-adapter.js line 200-210
// 50ms delay before rendering to ensure container dimensions
setTimeout(() => sigmaInstance.refresh(), 50)
```

## Global Window Objects (Required for Cross-Module Communication)

```javascript
window.SigmaAdapter = { /* All 37 functions */ }
window.GraphController = { getGraph, getSigma, getGraphology }
```

## Debug Helpers (Not Documented)

```javascript
// Access internal state
window.SigmaAdapter.getForceLayout() // Get force supervisor
window.SigmaAdapter.getSigma() // Sigma instance
window.SigmaAdapter.getGraph() // Graphology graph
window.GraphController.visualFeatures // Current feature flags
```
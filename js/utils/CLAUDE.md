# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Utils Module Overview

Foundation utilities with zero dependencies. Provides DOM manipulation, event management, validation, and mobile gestures. Total: 1,536 lines.

## Module Architecture

### canvas-gesture.js (1,184 lines)
**Purpose**: Mobile gesture controller using invisible canvas overlay

**Why Canvas Instead of DOM**:
- Bypasses DOM event propagation
- Provides pixel-perfect gesture tracking
- Enables velocity-based physics
- No conflicts with content scrolling

**Configuration** (lines 7-44):
```javascript
GESTURE_CONFIG = {
  MIDDLE_ZONE_START: 0.4,     // Magnetic middle zone
  MIDDLE_ZONE_END: 0.6,
  VELOCITY: {
    SUPER_FAST: 4.0,          // px/ms thresholds
    FAST: 2.0,
    MODERATE: 1.0,
    MIDDLE_ZONE_OVERRIDE: 1.5 // Break out of magnetic zone
  },
  MAX_PROGRESS: 0.91           // Keep tab accessible
}
```

**Three-Tier Content Modes**:
1. `normal` (0%) - Content covers graph
2. `split` (40-60%) - Magnetic middle zone
3. `retracted` (91%) - Graph fully visible

**Velocity Tracking**:
- Samples last 5 touch movements
- Calculates release velocity for physics
- Dynamic animation duration based on velocity

**Debug Mode**:
```javascript
canvasGesture.enableDebug = true; // Shows gesture zones
window.debugCanvas(); // Global debug function
```

**Features**:
- 1,184 lines for gesture handling
- Velocity physics calculations
- Magnetic middle zone with override thresholds

### dom.js (39 lines)
**Purpose**: jQuery-like DOM utilities

**Exports**:
```javascript
$(selector)       // querySelector wrapper
$$(selector)      // querySelectorAll → Array (not NodeList!)
cached(selector)  // Memoized selection with Map
clearCache()      // Clear element cache
```

**Note**: Only `cached()` uses memoization; `$` and `$$` hit DOM every time

**Used By**: Every UI module imports these utilities

### events.js (74 lines)
**Purpose**: Centralized event management with cleanup tracking

**Pattern**:
```javascript
// Attach with ID tracking
const id = on(element, 'click', handler);

// Clean up by ID
off(id);

// Bulk setup with cleanup function
const cleanup = setupEvents({
  '#button': { 'click': handleClick },
  '.tabs': { 'change': handleTabChange }
});
cleanup(); // Remove all
```

**Memory Safety**: All handlers stored in Map with unique IDs for proper cleanup

### validation.js (239 lines)
**Purpose**: Graph data validation with detailed error reporting

**Exported Functions**:
- `validateVertex(name)` - Single vertex validation
- `validateVertices(vertices)` - Bulk validation with duplicate detection
- `validateEdge(edge)` - Edge format and validity checking
- `validateEdges(edges)` - Bulk edge validation with normalization
- `validateGraphName(name)` - Graph name validation with trimming
- `formatValidationError(result)` - Human-readable error formatting

**Validation Rules**:
```javascript
// Vertices: Max 10 chars, alphanumeric + underscore
validateVertex('node_1') // { valid: true }
validateVertex('very-long-node-name') // { valid: false, message: '...' }

// Edges: Multiple formats supported
validateEdge('A-B')     // Bidirectional
validateEdge('A->B')    // Directed
validateEdge('A<->B')   // Explicit bidirectional

// Graph names: 3-30 chars
validateGraphName('My Graph') // { valid: true, trimmed: 'My Graph' }
```

**Edge Normalization**:
- No self-loops allowed
- Duplicate detection
- Format standardization

**Return Format**:
```javascript
{
  valid: boolean,
  message: string,
  invalidVertices?: string[],
  invalidEdges?: [{edge, reason}],
  trimmed?: string  // For graph names
}
```

## Dependencies

This module has NO internal dependencies (foundation layer).

External dependencies:
- Browser DOM APIs
- Touch/Mouse events
- Canvas 2D context

## Characteristics

### canvas-gesture.js
- **Touch Sampling**: Every touchmove event (can be 60+ fps)
- **Velocity Calculation**: O(n) where n = sample count (max 5)
- **Memory**: Creates new canvas element per instance

### dom.js
- **$()**: O(n) DOM traversal each call
- **$$()**: O(n) + Array.from() allocation
- **cached()**: O(1) after first call

### events.js
- **on()**: O(1) handler registration
- **off()**: O(1) handler removal
- **Storage**: Map grows with registered handlers

### validation.js
- **validateVertex()**: O(n) regex match
- **validateEdges()**: O(m*n) where m = edges, n = vertex length

## Memory Management

### Canvas Gesture Cleanup
```javascript
canvasGesture.destroy(); // Remove canvas, listeners
```

### Event Cleanup Pattern
```javascript
const handlers = [];
handlers.push(on(element, 'click', fn));
// Later...
handlers.forEach(id => off(id));
```

### DOM Cache Management
```javascript
clearCache(); // Clear memoized selections
```

## Implementation Notes

- **Canvas gesture**: May conflict with content scroll (check `allowScrolling` flag)
- **Event handlers**: Cleanup functions must be called to prevent memory leaks
- **DOM cache**: Becomes stale after DOM updates (call `clearCache()`)
- **Validation**: May be too strict for user input (use `trimmed` value)

## Debug Utilities

```javascript
// Canvas gestures
window.debugCanvas()           // Toggle debug overlay
canvasGesture.enableDebug      // Show gesture zones
canvasGesture.velocityHistory  // Inspect velocity samples

// DOM inspection
cached.cache                   // View cached elements

// Event tracking  
handlers                       // Map of all registered handlers
```


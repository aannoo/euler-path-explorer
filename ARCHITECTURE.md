# EULER Architecture Documentation

Technical architecture details for the EULER Euler Path Explorer.

## System Overview

EULER is built as a single-page application using vanilla JavaScript with ES6 modules, following a mobile-first approach with advanced gesture controls.

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Visualization**: Sigma.js v3 with Graphology
- **Build Tools**: Vite (optional - works without build step)
- **Dependencies**: UUID, Chroma.js, Force Atlas 2 layouts

### Architecture Principles

1. **Mobile-First**: Designed primarily for mobile with desktop enhancement
2. **Modular Design**: Clean separation of concerns across 18 JS modules
3. **State-Driven**: Centralized reactive state management
4. **Component-Based**: Reusable UI components with lifecycle management

## Code Organization

### File Structure Analysis

**Total Lines of Code**: ~15,365 lines
- **JavaScript**: ~10,128 lines across 18 modules
- **CSS**: ~5,237 lines across 19 files

### Module Sizes

**JavaScript Modules:**
- `graph/sigma-adapter.js`: 2,219 lines
- `ui/saved-graphs.js`: 1,450 lines
- `utils/canvas-gesture.js`: 1,184 lines
- `graph/sigma-controller.js`: 1,047 lines
- `ui/init.js`: 1,045 lines

**CSS Files:**
- `layout.css`: 400+ lines (responsive layout system)
- `branding.css`: 400+ lines (visual identity)

### Module Dependencies
```
main.js (bootstrap)
├── core/ (no internal dependencies)
├── graph/ (depends on core)
├── ui/ (depends on core + graph)
└── utils/ (no internal dependencies)
```

## State Management Architecture

### Pub/Sub Pattern
```javascript
// Central state object
const state = {
  graph: { directed: false, weighted: false, edges: [] },
  ui: { sidebarExpanded: true, activeTab: 'input' },
  animation: { inProgress: false, currentStep: 0 },
  euler: { hasPath: false, path: [], explanation: '' }
};

// Subscription system
const subscribers = new Map();
const subscribe = (path, callback) => { /* ... */ };
const setState = (path, value) => { /* notify subscribers */ };
```

### State Flow
1. **User Input** → Validation → State Update
2. **State Change** → Notify Subscribers → UI Updates
3. **Algorithm Run** → Results → State + Visualization

## Mobile-First Architecture

### Responsive Layout System

**Desktop (≥769px)**: Side-by-side layout
```
┌─────────────────────────────────────────┐
│ Content Layer (35%)  │ Graph Layer (65%) │
│ ┌─────────────────┐  │ ┌───────────────┐ │
│ │ Input Controls  │  │ │ Sigma.js      │ │
│ │ Results Panel   │  │ │ Visualization │ │
│ │ Saved Graphs    │  │ │               │ │
│ └─────────────────┘  │ └───────────────┘ │
└─────────────────────────────────────────┘
```

**Mobile (≤768px)**: Layered interface
```
┌─────────────────────────────────────────┐
│ Graph Layer (Background - Fixed)        │
│ ┌─────────────────────────────────────┐ │
│ │ Sigma.js Visualization              │ │
│ │                                     │ │
│ │ Content Layer (Foreground - Sliding)│ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ [Input] [Results] [Saved]       │ │ │
│ │ │ ...                             │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│ [GRAPH VIEW] ← Orange sliding tab       │
└─────────────────────────────────────────┘
```

### Canvas Gesture System
- **1,185 lines** of sophisticated touch handling
- **Velocity-based** gesture recognition
- **Three-tier positioning**: normal/split/retracted
- **Hardware acceleration** for smooth 60fps animations

## Performance Architecture

### Hardware Acceleration
```css
/* Applied throughout the codebase */
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}
```

### Memory Management
- **Event cleanup** systems in all modules
- **State subscription** management with unsubscribe functions
- **Animation frame** optimization
- **CSS containment** for rendering boundaries

## Browser Compatibility

### Minimum Requirements
- **ES6 Modules**: Native import/export support
- **CSS Grid & Flexbox**: Modern layout systems
- **Touch Events**: Mobile gesture recognition
- **WebGL**: Sigma.js visualization requirements

---

## Critical Initialization Order

The application requires strict initialization order in `main.js`:

```javascript
1. Orbital animation setup
2. Sigma graph initialization (MUST be before UI)  
3. UI initialization (MUST be after graph)
4. State subscriptions
```

Breaking this order causes silent failures.

---

*Architecture documentation reflects current state as of January 2025*
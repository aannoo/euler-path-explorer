# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## UI Module Overview

User interface layer managing all components, interactions, and mobile gestures. Contains 3,607 lines across 7 files with significant refactoring needs.

## Key Files

### init.js (1,045 lines)
**Purpose**: Main UI orchestration hub managing ALL UI initialization

**Exported Functions**:
- `initializeUI()` (line 811) - Main entry point, returns cleanup function
- `showNotification(message, type, duration)` (line 895) - Global notification system  
- `navigateToSection(sectionId)` (line 973) - Section navigation
- `setContentMode(mode)` (line 978) - Mobile UI state management
- `getContentMode()` (line 1008) - Get current content mode

**Internal Key Functions**:
- `initializeCanvasGestureInterface()` (line 26) - Sets up mobile gesture system
- `setupSectionNavigation()` (line 93) - Sticky header navigation
- `setupGraphModeControls()` - Graph mode UI controls
- `setupDesktopControls()` - Desktop-specific controls

**Dependencies**: Imports from ALL modules - utils, core, graph, and all UI modules

**Characteristics**:
- Knows about every UI component
- Mixed responsibilities (gestures, notifications, tabs, forms)

### saved-graphs.js (1,450 lines)
**Purpose**: Complete graph management system with UI, persistence, and validation

**State Management**:
```javascript
ui.savedGraphs = {
  activeItemId: null,        // Currently selected graph
  editingItemId: null,       // Graph being renamed
  confirmingDeleteId: null,  // Graph pending deletion
  isModified: false,         // Current graph changed
  currentGraphId: null       // Loaded graph ID
}
```

**Exported Functions**:
- `initializeSavedGraphs()` (line 34) - Main initialization

**Internal Functions** (not exported):
- `loadSavedGraphs()` - Loads from localStorage
- `saveSavedGraphs()` - Persists to localStorage
- `createGraphCard()` - Creates UI cards
- `saveCurrentGraph()` - Saves active graph
- `loadGraph()` - Loads selected graph
- `deleteGraph()` - Removes graph
- `renameGraph()` - Updates graph name
- `exportGraph()` - JSON export
- `importGraph()` - JSON import
- `renderSavedGraphs()` - Update UI
- `handleSave()` - Save button handler

**Characteristics**:
- Handles UI, storage, validation, import/export all in one file
- Complex state tracking with multiple confirmation flows

### visual-editor.js (284 lines)
**Purpose**: Visual graph editing mode with bidirectional sync

**Global Exposure**:
```javascript
window.updateEdgeListDisplay = updateEdgeListDisplay; // Called by sigma-adapter
```

**Mode Switching**:
- Stores original text when entering visual mode
- Syncs graph changes back to text format
- Updates button text based on selection state

### components.js (205 lines)
**Purpose**: Reusable UI components with state sync

**Component Factory Pattern**:
```javascript
// All components return cleanup functions
const cleanup = createToggleButton(selector, statePath, options);
const cleanup2 = createTabs(tabsSelector, panesSelector, statePath);
```

**State Integration**: Components auto-subscribe to state changes and update

### desktop-resize.js (258 lines)
**Purpose**: Desktop layout resizing with ghost preview

**Optimizations**:
- Ghost line during drag (no layout recalc)
- Transform-only updates until mouse release
- RAF batching for smooth 60fps
- CoolTextFit integration for responsive text

**Breakpoint**: Only active >768px width

### euler-toggles.js (191 lines)
**Purpose**: Custom toggle switches for directed/weighted properties

**Easter Egg**: Chinese flag emoji (🇨🇳) on hover for weighted toggle (Chinese Postman algorithm hint)

**Legacy Support**: Updates hidden form inputs for backward compatibility

### loader.js (174 lines)
**Purpose**: Loading animations with graph complexity detection

**Smart Loading**:
```javascript
showCalcLoader(message, nodeCount) {
  if (nodeCount < 10) return Promise.resolve(); // Skip for small graphs
  // Show orbital animation for larger graphs
}
```

## Mobile Gesture System (via init.js)

Uses `CanvasGestureController` from utils for mobile interactions:

**Three-Tier Positioning**:
- `normal` (progress: 0) - Content covers graph
- `split` (progress: ~0.5) - Content partially retracted
- `retracted` (progress: 0.91) - Graph fully visible

**Canvas Overlay**: Invisible canvas (z-index: 100) captures all touch events

## State Subscriptions

UI state paths:
```javascript
'ui.activeTab'          → Tab navigation
'ui.editorMode'         → Text/visual mode
'ui.contentMode'        → Mobile gesture state
'ui.savedGraphs.*'      → Graph management
'ui.explanationVisible' → Results panel
```

## Memory Management

All UI components must return cleanup functions:
```javascript
// Pattern used throughout
export function initializeComponent() {
  const unsubscribe1 = subscribe(path, callback);
  const unsubscribe2 = subscribe(path2, callback2);
  
  return () => {
    unsubscribe1();
    unsubscribe2();
    // Additional cleanup
  };
}
```

## Characteristics

- **saved-graphs.js**: Renders entire graph list on every change
- **init.js**: Creates all event listeners upfront
- **Canvas gestures**: Captures ALL touch events on mobile
- **State subscriptions**: Many components subscribe to same paths

## Global Functions Exposed

From init.js:
```javascript
window.showNotification    // Used by all modules
window.navigateToSection   // Section scrolling
window.setContentMode      // Mobile UI control
```

## Initialization Chain

```
initializeUI() [init.js]
  ├── initializeCanvasGestureInterface()
  ├── initializeSavedGraphs() [saved-graphs.js]
  ├── initializeEulerToggles() [euler-toggles.js]
  ├── initVisualEditor() [visual-editor.js]
  └── createToggleButton() × N [components.js]
```

## Debug Functions

Available in console:
```javascript
canvasGesture.enableDebug = true  // Show gesture zones
getState('ui.savedGraphs')        // Inspect graph management state
```
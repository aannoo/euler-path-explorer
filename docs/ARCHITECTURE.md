# EULER Architecture

This document describes how the current application is structured.

## Overview

EULER is a single-page app built with vanilla ES modules. It combines:

- text and visual graph editing
- Sigma.js and Graphology for rendering and interaction
- a small pub/sub store in [`js/core/state.js`](../js/core/state.js)
- local persistence for saved graphs
- separate mobile and desktop UI behavior

The app is bundled with Vite for development and production builds, but the runtime code is plain browser JavaScript.

## Current Source Layout

```text
js/
  main.js                  app bootstrap and teardown
  core/
    state.js               central state store
    algorithm.js           Euler + Chinese Postman logic
    storage.js             saved graphs and examples
  graph/
    model.js               in-memory graph model
    sigma-adapter.js       Sigma.js integration layer
    sigma-facade.js        grouped adapter API
    sigma-controller.js    parsing, orchestration, rendering flow
  ui/
    init.js                UI bootstrap, notifications, mobile content modes
    saved-graphs.js        saved/example graph panel
    visual-editor.js       visual editing mode
    components.js          reusable UI state-bound helpers
    desktop-ui.js          desktop-only controls and graph info strip
    desktop-resize.js      resizable desktop split layout
    euler-toggles.js       directed/weighted toggles
    loader.js              calculation loader
  utils/
    dom.js                 tiny DOM helpers
    events.js              tracked event listeners
    validation.js          graph input validation
    canvas-gesture.js      mobile gesture controller
```

## Runtime Startup Flow

The application boots from [`js/main.js`](../js/main.js):

1. Wait for `DOMContentLoaded`.
2. Start the page loader and orbital welcome sequence.
3. Register orbital subscriptions on `ui.calculationStarted` and `ui.savedGraphLoaded`.
4. Initialize Sigma first with `initializeSigmaGraph('#cy')`.
5. Initialize the UI with `initializeUI()`.
6. Enable desktop resize behavior with `initDesktopResize()`.
7. Register cleanup handlers and expose `window.cleanupEULER`.

The Sigma-before-UI ordering still matters because UI actions assume graph listeners already exist.

## State Model

[`js/core/state.js`](../js/core/state.js) owns a single mutable state object and exposes:

- `getState(path)`
- `setState(path, value)`
- `subscribe(path, callback)`

Important characteristics:

- `getState()` deep-clones via JSON serialization.
- `setState()` creates missing nested objects on demand.
- listeners fire for the exact path and all parent paths.
- there is no reducer layer or immutability enforcement beyond cloning on reads.

Current top-level state:

```js
{
  graph: {
    directed: false,
    weighted: false,
    edges: []
  },
  ui: {
    sidebarExpanded: true,
    activeTab: 'input',
    explanationVisible: false,
    editorMode: 'text',
    selectedNodes: [],
    selectedEdges: [],
    propertyEditing: { ... },
    savedGraphs: { ... }
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
}
```

Transient paths such as `ui.contentMode`, `ui.calculationStarted`, `ui.savedGraphLoaded`, `graph.pendingDirected`, and `graph.pendingWeighted` are also written dynamically.

## Calculation Flow

The main graph-processing flow lives in [`js/graph/sigma-controller.js`](../js/graph/sigma-controller.js):

1. Read the edge input from `#edges`.
2. Parse and validate the input with `parseEdgeInput()` and the validation helpers.
3. Trigger the welcome-to-graph animation with `setState('ui.calculationStarted', true)`.
4. Build/update the in-memory `Graph` model.
5. Persist the normalized edges into `state.graph.edges`.
6. Render the graph through the Sigma facade.
7. Build an adjacency list with `buildAdjacencyList()`.
8. Run `findEulerPath(...)`, which switches to `chinesePostmanAlgorithm(...)` when the graph is weighted.
9. Store the result under `state.euler` and reveal the results UI.

## Core Algorithms

[`js/core/algorithm.js`](../js/core/algorithm.js) provides:

- `findEulerPath(adjacencyList, startVertex, isWeighted)`
- `chinesePostmanAlgorithm(adjacencyList, startVertex)`
- `buildAdjacencyList(edges, isDirected)`
- `getExplanation(result)`

Behavior that matters today:

- empty graphs return a non-throwing "Graph is empty" result
- unweighted graphs use Hierholzer's algorithm
- unweighted graphs reject disconnected edge-bearing graphs
- weighted graphs route through the Chinese Postman implementation
- the Chinese Postman branch uses greedy matching plus shortest-path duplication, not an exact minimum perfect matching solver

## Graph Rendering Layer

Rendering is split across these files:

- [`js/graph/model.js`](../js/graph/model.js): project graph model
- [`js/graph/sigma-adapter.js`](../js/graph/sigma-adapter.js): Sigma/Graphology lifecycle, layout, selection, export, path highlighting
- [`js/graph/sigma-facade.js`](../js/graph/sigma-facade.js): grouped API used by the controller
- [`js/graph/sigma-controller.js`](../js/graph/sigma-controller.js): app-facing graph orchestration

Important current facts:

- `sigma-adapter.js` is still the largest and most coupled graph file.
- The controller now imports the facade, not the raw adapter, for most operations.
- Selection state is mirrored into app state via `ui.selectedNodes`, `ui.selectedEdges`, and `ui.propertyEditing`.
- The cleanup path should always call `destroySigma()` to release listeners, intervals, and renderer resources.

## UI Layer

[`js/ui/init.js`](../js/ui/init.js) is the top-level UI entry point. It coordinates:

- mobile content modes and canvas gestures
- section navigation
- graph mode controls
- saved graphs initialization
- Euler property toggles
- visual editor setup
- notification display

Related modules:

- [`js/ui/saved-graphs.js`](../js/ui/saved-graphs.js): save/load/rename/delete/import/export flows
- [`js/ui/visual-editor.js`](../js/ui/visual-editor.js): text/visual editor synchronization
- [`js/ui/desktop-ui.js`](../js/ui/desktop-ui.js): desktop graph controls and section helpers
- [`js/ui/desktop-resize.js`](../js/ui/desktop-resize.js): draggable desktop split
- [`js/ui/loader.js`](../js/ui/loader.js): staged loading overlay

The app has two distinct interaction models:

- Desktop: side-by-side content and graph, plus resize handle and desktop controls.
- Mobile: a sliding content layer driven by [`js/utils/canvas-gesture.js`](../js/utils/canvas-gesture.js) with `normal`, `split`, and `retracted` modes.

## Persistence

[`js/core/storage.js`](../js/core/storage.js) stores user graphs in `localStorage`.

Keys:

- `euler_saved_graphs`
- `euler_graph_counter`

It also provides the built-in example list and the random Euler graph generator.

## Styling

The app loads [`css/bundle.css`](../css/bundle.css) directly from [`index.html`](../index.html). The unbundled CSS files in [`css/`](../css/) remain the editable source layout for major style areas such as base tokens, layout, graph controls, notifications, saved graphs, and orbital animation.

- shared design tokens live in `css/base.css`
- the interface uses dark backgrounds with orange accents
- many controls intentionally use square corners and uppercase labels
- desktop and mobile layouts diverge heavily, so layout changes should be checked in both modes

## Testing And Verification

Current commands from [`package.json`](../package.json):

- `npm test`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run test:e2e`
- `npm run test:e2e:ui`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run serve`

Current automated test files:

- [`js/core/algorithm.test.js`](../js/core/algorithm.test.js)
- [`js/core/storage.test.js`](../js/core/storage.test.js)
- [`js/graph/sigma-controller.test.js`](../js/graph/sigma-controller.test.js)
- [`tests/e2e/euler-app.spec.js`](../tests/e2e/euler-app.spec.js)

Practical verification flow:

- run `npm test` for logic and parsing changes
- run `npm run test:e2e` for user-facing workflow changes when feasible
- run `npm run build` before shipping
- for a quick manual smoke test, enter `[a,b],[b,c],[c,a]`, run calculate, and confirm both the results panel and graph rendering update

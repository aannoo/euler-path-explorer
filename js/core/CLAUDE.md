# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Module Overview

The core module is the business logic layer with no UI dependencies. It provides Euler path algorithms, reactive state management, and graph persistence. Foundation layer with 1,037 lines of pure JavaScript across 3 files.


## Module Architecture

```
core/
├── state.js (136 lines) - Reactive pub/sub state management
├── algorithm.js (490 lines) - Euler path/circuit algorithms  
└── storage.js (411 lines) - Graph persistence, depends on state.js
```

This is the foundation layer with no UI dependencies.

## State Management (state.js)

### Implementation Detail
Uses `JSON.parse(JSON.stringify())` for cloning.

### State Shape
```javascript
{
  graph: { directed: false, weighted: false, edges: [] },
  ui: { activeTab: 'input', editorMode: 'text', sidebarExpanded: true },
  animation: { inProgress: false, currentStep: 0, path: null },
  euler: { hasPath: false, isCircuit: false, path: null, explanation: '' }
}
```

### API Pattern
```javascript
import { getState, setState, subscribe } from './state.js';

// Subscribe returns unsubscribe function - MUST store for cleanup
const unsubscribe = subscribe('graph.edges', (edges) => {
  // React to changes
});

// State updates notify all subscribers including parent paths
setState('graph.edges', newEdges);
// Notifies: 'graph.edges' listeners AND 'graph' listeners
```

### Additional State Properties

The core module also manages Euler-specific state:
- `euler.isChinesePostman` - Boolean for weighted graph algorithm
- `euler.totalWeight` - Total weight for Chinese Postman tours
- `euler.duplicatedEdges` - Array of edges added by Chinese Postman

## Algorithm Implementation (algorithm.js)

### Main Entry Points
```javascript
findEulerPath(adjacencyList, startVertex?, isWeighted?)
// Returns: { path, hasPath, hasCircuit, explanation }

chinesePostmanAlgorithm(adjacencyList, startVertex?)  
// For weighted graphs, adds duplicate edges optimally
// Returns: { path, hasPath, hasCircuit, isChinesePostman, totalWeight, duplicatedEdges }
```

### Algorithm Rules
- **Euler Path exists**: 0 or 2 vertices with odd degree
- **Euler Circuit exists**: All vertices have even degree
- **Chinese Postman**: Activated when `isWeighted=true`

### Helper Functions
- `buildAdjacencyList(edges, isDirected?)` - Convert edge array to adjacency list
- `countDegrees(graph)` - Calculate vertex degrees
- `hierholzerAlgorithm(graph, start)` - Core path construction
- `getExplanation(result)` - Generate user-friendly explanations

### Internal Functions (not exported)
- `findShortestPath(graph, start, end)` - Dijkstra's algorithm
- `findGreedyMatching(oddVertices, graph)` - Greedy matching for Chinese Postman
- `findEdgeWeight(graph, source, target)` - Get edge weight

## Storage System (storage.js)

### localStorage Keys
```javascript
'euler_saved_graphs'   // Array of saved graph objects
'euler_graph_counter'  // Auto-incrementing ID for default names
```

### Graph Object Structure
```javascript
{
  id: Date.now().toString(),
  name: 'Graph 1',
  edges: "[a,b],[b,c]",  // String format
  directed: false,
  weighted: false,
  date: "2025-01-01T12:00:00.000Z"
}
```

### Example Graphs
Includes 6 predefined examples:
- Simple Circuit/Path
- Weighted/Directed examples
- K5 Complete Graph
- Random Euler generator (special flag: `isRandomGenerator`)

### Key Functions
- `getSavedGraphs()` - Returns user graphs from localStorage
- `getExampleGraphs()` - Returns predefined examples  
- `saveCurrentGraph(name?)` - Saves current graph from global state
- `loadGraph(id)` - Loads graph by ID from localStorage
- `deleteGraph(id)` - Removes graph from localStorage
- `duplicateGraph(id)` - Creates copy with new ID and " (Copy)" suffix
- `generateRandomEulerGraph(vertices?, edges?)` - Creates valid Euler circuit (defaults: 5 vertices, 8 edges)

## Module Dependencies

- **Internal**: storage.js imports from state.js
- **External**: None (foundation layer)
- **Browser APIs**: localStorage

## Error Handling

- All functions use try-catch with console.error logging
- Storage functions return null on error
- Algorithm functions always return valid result objects
- Random graph generation retries up to 20 times before fallback

## Characteristics

- **State Cloning**: Every `getState()` call clones via JSON (O(n) operation)
- **Parent Path Notifications**: Setting nested state notifies all parent listeners
- **Random Graph Generation**: May retry up to 20 times if constraints fail

## Memory Management

State subscriptions MUST be cleaned up:
```javascript
// Always store unsubscribe function
const unsubscribe = subscribe(path, callback);

// Clean up when done
unsubscribe();
```

## Algorithm Complexity

- Hierholzer's: O(E) where E = edges
- Chinese Postman: O(V³) for shortest paths between odd vertices
- Degree counting: O(E)
- State cloning: O(n) where n = size of state object
- Random graph generation: O(V²) worst case with up to 20 retries

## Implementation Notes

- **State Cloning**: Uses JSON.parse/stringify for deep cloning
- **Parent Path Notifications**: Changing nested state triggers ALL parent listeners (e.g., setting 'graph.edges' notifies both 'graph.edges' and 'graph' listeners)
- **Chinese Postman**: Only activates when isWeighted=true in findEulerPath()
- **Graph Connectivity**: Algorithm assumes connected graphs; disconnected components not handled
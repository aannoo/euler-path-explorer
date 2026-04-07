# 🕵️‍♂️ Comprehensive Codebase Analysis Report

*Generated automatically by static analysis.*

This report contains an exhaustive and deep analysis of the codebase, covering logic bugs, memory leaks, performance bottlenecks, bad practices, accessibility (a11y) issues, and architecture flaws.

## 🐛 Logic Bugs

### 📄 `js/core/algorithm.js`

- **Line 23**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (Object.keys(graph).length === 0) {`

- **Line 37**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `.filter(([_, degree]) => degree % 2 !== 0)`

- **Line 41**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasPath = oddVertices.length === 0 || oddVertices.length === 2;`

- **Line 41**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasPath = oddVertices.length === 0 || oddVertices.length === 2;`

- **Line 42**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasCircuit = oddVertices.length === 0;`

- **Line 142**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `return visited.size === activeVertices.size;`

- **Line 157**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (Object.keys(graph).length === 0) {`

- **Line 172**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `.filter(([_, degree]) => degree % 2 !== 0)`

- **Line 176**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasCircuit = oddVertices.length === 0;`

- **Line 177**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasPath = hasCircuit || oddVertices.length === 2;`

- **Line 289**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (unmatched.size === 0) break;`

- **Line 328**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (minVertex === null || minDistance === Infinity) break;`

- **Line 328**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (minVertex === null || minDistance === Infinity) break;`

- **Line 331**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (minVertex === end) break;`

- **Line 348**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (previous[end] === null && start !== end) return null;`

- **Line 348**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (previous[end] === null && start !== end) return null;`

- **Line 356**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `while (current !== null && !visited.has(current)) {`

- **Line 400**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edge.vertex === target) {`

- **Line 447**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!graph[currentVertex] || graph[currentVertex].length === 0) {`

### 📄 `js/core/algorithm.test.js`

- **Line 21**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `expect(result.a.some(e => e.vertex === 'b')).toBe(true);`

- **Line 22**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `expect(result.b.some(e => e.vertex === 'a')).toBe(true);`

- **Line 33**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `expect(result.a.some(e => e.vertex === 'b')).toBe(true);`

- **Line 34**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `expect(result.b.some(e => e.vertex === 'a')).toBe(false);`

- **Line 44**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const edgeAB = result.a.find(e => e.vertex === 'b');`

- **Line 52**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const edgeAB = result.a.find(e => e.vertex === 'b');`

### 📄 `js/core/state.js`

- **Line 66**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (value === undefined || value === null) {`

- **Line 66**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (value === undefined || value === null) {`

- **Line 91**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (target[key] === undefined || target[key] === null) {`

- **Line 91**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (target[key] === undefined || target[key] === null) {`

- **Line 123**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (pathListeners.size === 0) {`

### 📄 `js/core/storage.js`

- **Line 152**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (v1 === v2) continue;`

- **Line 170**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const allEven = degrees.every(degree => degree % 2 === 0);`

- **Line 175**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `degree % 2 === 1 ? index : -1).filter(index => index !== -1);`

- **Line 175**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `degree % 2 === 1 ? index : -1).filter(index => index !== -1);`

- **Line 178**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (oddVertices.length % 2 !== 0) {`

- **Line 205**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!degrees.every(degree => degree % 2 === 0)) {`

- **Line 220**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edge[0] === vertex) neighbors.add(edge[1]);`

- **Line 221**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edge[1] === vertex) neighbors.add(edge[0]);`

- **Line 233**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (visited.size !== vertices) {`

- **Line 285**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!edges || edges.length === 0) {`

- **Line 338**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `return savedGraphs.find(g => g.id === id) || null;`

- **Line 352**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const newGraphs = savedGraphs.filter(g => g.id !== id);`

- **Line 368**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const graph = savedGraphs.find(g => g.id === id);`

### 📄 `js/core/storage.test.js`

- **Line 39**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const simpleCircuit = examples.find(g => g.name === 'Simple Circuit');`

- **Line 49**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const weighted = examples.find(g => g.name === 'Weighted Example');`

- **Line 58**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const directed = examples.find(g => g.name === 'Directed Example');`

- **Line 66**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const random = examples.find(g => g.name === 'Random Euler');`

- **Line 100**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_saved_graphs') return JSON.stringify(savedData);`

- **Line 101**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_graph_counter') return '2';`

- **Line 113**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_saved_graphs') return 'not valid json{';`

- **Line 179**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const allEven = Object.values(degrees).every(d => d % 2 === 0);`

- **Line 200**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_saved_graphs') return JSON.stringify(savedData);`

- **Line 218**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_saved_graphs') return JSON.stringify(savedData);`

- **Line 229**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `call => call[0] === 'euler_saved_graphs'`

- **Line 232**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `expect(savedJson.find(g => g.id === '123')).toBeUndefined();`

- **Line 233**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `expect(savedJson.find(g => g.id === '456')).toBeDefined();`

- **Line 259**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_saved_graphs') return JSON.stringify(savedData);`

- **Line 277**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (key === 'euler_saved_graphs') return JSON.stringify(savedData);`

- **Line 302**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `call => call[0] === 'euler_graph_counter'`

### 📄 `js/graph/model.js`

- **Line 77**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edge.source === id || edge.target === id) {`

- **Line 77**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edge.source === id || edge.target === id) {`

- **Line 196**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `edge.source === source && edge.target === target ||`

- **Line 196**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `edge.source === source && edge.target === target ||`

- **Line 197**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(!this.directed && edge.source === target && edge.target === source)`

- **Line 197**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(!this.directed && edge.source === target && edge.target === source)`

### 📄 `js/graph/sigma-adapter.js`

- **Line 93**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (e.key === "Delete" || e.key === "Backspace") {`

- **Line 93**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (e.key === "Delete" || e.key === "Backspace") {`

- **Line 96**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isInput = activeElement.tagName === 'INPUT' ||`

- **Line 97**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `activeElement.tagName === 'TEXTAREA' ||`

- **Line 151**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof document === 'undefined') return;`

- **Line 169**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof container === 'string') {`

- **Line 215**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const enableForceLayout = options.enableForceLayout !== false;`

- **Line 468**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof event.preventSigmaDefault === 'function') {`

- **Line 474**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (originalEvent && typeof originalEvent.preventDefault === 'function') {`

- **Line 477**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (originalEvent && typeof originalEvent.stopPropagation === 'function') {`

- **Line 521**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (editorMode !== 'visual') {`

- **Line 525**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (selectedNodes.size === 1) {`

- **Line 611**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (editorMode !== 'visual') {`

- **Line 625**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!isMultiSelect && selectedNodes.size === 1 && !selectedNodes.has(nodeId)) {`

- **Line 709**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (editorMode !== 'visual') {`

- **Line 1029**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (type === 'node') {`

- **Line 1031**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (type === 'edge') {`

- **Line 1048**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasElement = type === 'node' ? graphInstance.hasNode(id) : graphInstance.hasEdge(id);`

- **Line 1057**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (type === 'node') {`

- **Line 1086**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!graphInstance || !Array.isArray(ids) || ids.length === 0) {`

- **Line 1097**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const hasElement = type === 'node' ? graphInstance.hasNode(id) : graphInstance.hasEdge(id);`

- **Line 1102**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (type === 'node') {`

- **Line 1144**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `x: node.x !== undefined ? node.x : Math.random() * 10,`

- **Line 1145**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `y: node.y !== undefined ? node.y : Math.random() * 10`

- **Line 1252**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (camera.minRatio !== undefined) {`

- **Line 1255**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (camera.maxRatio !== undefined) {`

- **Line 1275**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `enableForceLayout = featureState && typeof featureState.enableForceLayout !== 'undefined'`

- **Line 1283**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (enableForceLayout !== false && !forceLayout) {`

- **Line 1362**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `enableForceLayout = featureState && typeof featureState.enableForceLayout !== 'undefined'`

- **Line 1371**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (enableForceLayout !== false) {`

- **Line 1401**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentState !== directed) {`

- **Line 1470**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {`

- **Line 1509**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (weight !== undefined) {`

- **Line 1541**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentAnimation && typeof currentAnimation.cancel === 'function') {`

- **Line 1731**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (nodeCount === 0) return false; // No nodes to check`

- **Line 1786**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (forceLayout.kill && typeof forceLayout.kill === 'function') {`

- **Line 1799**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentAnimation && typeof currentAnimation.cancel === 'function') {`

- **Line 1806**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof intervalOrCleanup === 'function') {`

- **Line 1825**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof sigmaInstance.removeAllListeners === 'function') {`

- **Line 1852**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (captor && typeof captor.removeAllListeners === 'function') {`

- **Line 1902**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (directed === null) {`

- **Line 1921**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof graphInstance.edge === 'function') {`

- **Line 1952**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) ||`

- **Line 1952**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) ||`

- **Line 1953**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(!directed && sid === target && tid === source)) {`

- **Line 1953**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(!directed && sid === target && tid === source)) {`

- **Line 2035**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {`

- **Line 2101**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof subscribe !== 'function') {`

- **Line 2186**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {`

### 📄 `js/graph/sigma-controller.js`

- **Line 211**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (pendingDirected !== undefined) {`

- **Line 216**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (pendingWeighted !== undefined) {`

- **Line 273**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (getState('ui.activeTab') !== 'input') return;`

- **Line 275**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' && !event.shiftKey) {`

- **Line 291**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (upEvent.key === 'Enter') {`

- **Line 365**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const bidirectional = connector === '<->' || connector === '-';`

- **Line 365**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const bidirectional = connector === '<->' || connector === '-';`

- **Line 417**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edgeMatches.length === 0) {`

- **Line 423**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!match || typeof match !== 'string' || match.length < 3) {`

- **Line 451**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (source === target) {`

- **Line 509**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (nodes.length === 0 || edges.length === 0) {`

- **Line 509**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (nodes.length === 0 || edges.length === 0) {`

- **Line 515**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edges.length === 0) {`

- **Line 700**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(e.source === nodeId && e.target === nextNodeId) ||`

- **Line 700**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(e.source === nodeId && e.target === nextNodeId) ||`

- **Line 701**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(e.source === nextNodeId && e.target === nodeId)`

- **Line 701**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(e.source === nextNodeId && e.target === nodeId)`

- **Line 716**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (weight !== undefined) {`

- **Line 724**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (path.length > 2 && path[0] === path[path.length - 1]) {`

- **Line 777**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) || (sid === target && tid === source)) {`

- **Line 777**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) || (sid === target && tid === source)) {`

- **Line 777**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) || (sid === target && tid === source)) {`

- **Line 777**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) || (sid === target && tid === source)) {`

- **Line 911**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const otherNodes = nodes.filter(n => n.id !== nodeId);`

### 📄 `js/graph/sigma-core.js`

- **Line 27**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (e.key === "Delete" || e.key === "Backspace") {`

- **Line 27**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (e.key === "Delete" || e.key === "Backspace") {`

- **Line 29**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isInput = activeElement.tagName === 'INPUT' ||`

- **Line 30**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `activeElement.tagName === 'TEXTAREA' ||`

- **Line 49**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof container === 'string') {`

- **Line 85**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const enableForceLayout = options.enableForceLayout !== false;`

- **Line 186**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (nodeCount === 0) return false;`

- **Line 255**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (forceLayout.kill && typeof forceLayout.kill === 'function') {`

- **Line 266**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof intervalOrCleanup === 'function') {`

- **Line 280**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof sigmaInstance.removeAllListeners === 'function') {`

- **Line 319**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof subscribe !== 'function') {`

- **Line 407**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof window !== 'undefined') {`

### 📄 `js/graph/sigma-layouts.js`

- **Line 108**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (forceLayout.kill && typeof forceLayout.kill === 'function') {`

- **Line 175**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `enableForceLayout = featureState?.enableForceLayout !== false;`

- **Line 205**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentState !== directed) {`

- **Line 254**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {`

- **Line 302**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentAnimation && typeof currentAnimation.cancel === 'function') {`

- **Line 422**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (directed === null) {`

- **Line 435**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof graphInstance.edge === 'function') {`

- **Line 460**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) ||`

- **Line 460**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if ((sid === source && tid === target) ||`

- **Line 461**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(!directed && sid === target && tid === source)) {`

- **Line 461**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `(!directed && sid === target && tid === source)) {`

- **Line 480**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentAnimation && typeof currentAnimation.cancel === 'function') {`

### 📄 `js/graph/sigma-properties.js`

- **Line 66**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (type === 'node' && graphInstance.hasNode(id)) {`

- **Line 68**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (type === 'edge' && graphInstance.hasEdge(id)) {`

- **Line 88**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (type === 'node' && graphInstance.hasNode(id)) {`

- **Line 90**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (EDITABLE_NODE_PROPERTIES.includes(key) || key === 'x' || key === 'y') {`

- **Line 90**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (EDITABLE_NODE_PROPERTIES.includes(key) || key === 'x' || key === 'y') {`

- **Line 97**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (type === 'edge' && graphInstance.hasEdge(id)) {`

### 📄 `js/graph/sigma-rendering.js`

- **Line 32**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof edge === 'string') {`

- **Line 40**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `weight = edge[2] !== undefined ? parseFloat(edge[2]) : 1;`

- **Line 41**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (typeof edge === 'object') {`

- **Line 44**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `weight = edge.weight !== undefined ? parseFloat(edge.weight) : 1;`

- **Line 188**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (canvases.length === 0) return null;`

### 📄 `js/graph/sigma-selection.js`

- **Line 67**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (editorMode !== 'visual') return;`

- **Line 74**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!isMultiSelect && selectedNodes.size === 1 && !selectedNodes.has(nodeId)) {`

- **Line 114**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (editorMode !== 'visual') return;`

- **Line 423**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {`

### 📄 `js/main.js`

- **Line 36**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (graphContainer.offsetWidth === 0 || graphContainer.offsetHeight === 0) {`

- **Line 36**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (graphContainer.offsetWidth === 0 || graphContainer.offsetHeight === 0) {`

- **Line 219**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof cleanup === 'function') {`

- **Line 230**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof unsubscribe === 'function') {`

- **Line 246**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (SigmaAdapter && typeof SigmaAdapter.destroySigma === 'function') {`

- **Line 289**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (graphController && typeof graphController.cleanup === 'function') {`

- **Line 296**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof uiCleanup === 'function') {`

- **Line 330**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `pane.classList.toggle('active', pane.id === `${tabId}-tab`);`

### 📄 `js/ui/components.js`

- **Line 17**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const element = typeof selector === 'string' ? $(selector) : selector;`

- **Line 92**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `tab.classList.toggle(activeClass, tabId === activeTab);`

- **Line 97**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isActive = pane.id === `${activeTab}-tab`;`

- **Line 144**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isActive = value === true;`

### 📄 `js/ui/desktop-ui.js`

- **Line 70**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isCollapsed = localStorage.getItem('euler_sidebar_collapsed') === 'true';`

- **Line 222**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' || event.key === ' ') {`

- **Line 222**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' || event.key === ' ') {`

### 📄 `js/ui/euler-toggles.js`

- **Line 102**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const effectiveState = pendingState !== undefined ? pendingState : currentState;`

- **Line 121**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const effectiveState = pendingState !== undefined ? pendingState : currentState;`

### 📄 `js/ui/graph-cards.js`

- **Line 16**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isActive = graph.id === state.activeItemId;`

- **Line 17**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isConfirmingDelete = graph.id === state.confirmingDeleteId;`

### 📄 `js/ui/import-export.js`

- **Line 123**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (savedGraphs.length === 0) {`

### 📄 `js/ui/init.js`

- **Line 19**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== PERFORMANCE: RAF THROTTLE UTILITY ==========`

- **Line 33**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== CANVAS GESTURE INTERFACE MANAGEMENT ==========`

- **Line 87**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'retracted') {`

- **Line 89**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (mode === 'split') {`

- **Line 106**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== SECTION NAVIGATION ==========`

- **Line 119**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' || event.key === ' ') {`

- **Line 119**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' || event.key === ' ') {`

- **Line 137**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== GRAPH VIEW TAB HANDLING ==========`

- **Line 160**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' || event.key === ' ') {`

- **Line 160**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter' || event.key === ' ') {`

- **Line 244**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (position === -50) {`

- **Line 259**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (position === 0) {`

- **Line 261**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (position === -50) {`

- **Line 399**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== GRAPH MODE CONTROLS ==========`

- **Line 447**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== MOBILE SUPPORT ==========`

- **Line 500**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== WINDOW RESIZE HANDLING ==========`

- **Line 529**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'retracted') {`

- **Line 531**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (mode === 'split') {`

- **Line 564**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== DEBUG FUNCTIONS ==========`

- **Line 613**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== MAIN INITIALIZATION ==========`

- **Line 657**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'visual') {`

- **Line 668**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'text') {`

- **Line 699**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== NOTIFICATION SYSTEM ==========`

- **Line 794**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== UTILITY FUNCTIONS ==========`

- **Line 836**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `// ========== CANVAS GESTURE UI HELPERS ==========`

- **Line 849**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'retracted') {`

- **Line 861**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'retracted') {`

### 📄 `js/ui/mobile-ui.js`

- **Line 133**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'retracted') {`

- **Line 147**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (mode === 'retracted') {`

- **Line 211**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof window !== 'undefined') {`

### 📄 `js/ui/saved-graphs-panel.js`

- **Line 113**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (activeTab === 'saved') {`

- **Line 282**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (index !== undefined) {`

- **Line 298**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (currentActiveId === id) {`

- **Line 446**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `currentEdges !== originalGraphData.edges ||`

- **Line 447**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `currentDirected !== originalGraphData.directed ||`

- **Line 448**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `currentWeighted !== originalGraphData.weighted`

- **Line 451**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (isModified !== state?.ui?.savedGraphs?.isModified) {`

### 📄 `js/ui/saved-graphs.js`

- **Line 140**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (data.id === getState().ui.savedGraphs.currentGraphId) {`

- **Line 148**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (activeTab === 'saved') {`

- **Line 349**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isActive = graph.id === state.activeItemId;`

- **Line 350**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isConfirmingDelete = graph.id === state.confirmingDeleteId;`

- **Line 657**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.target.tagName === 'BUTTON' ||`

- **Line 658**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `event.target.tagName === 'INPUT' ||`

- **Line 659**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `event.target.tagName === 'I') {`

- **Line 667**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (state.activeItemId === id) {`

- **Line 687**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (state.activeItemId === id) {`

- **Line 716**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (newName && newName !== originalName) {`

- **Line 735**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.key === 'Enter') {`

- **Line 745**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isActive = state.activeItemId === id;`

- **Line 746**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isConfirmingDelete = state.confirmingDeleteId === id;`

- **Line 795**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (event.target.tagName === 'INPUT') {`

- **Line 1115**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const wasCurrentGraph = (id === currentGraphId);`

- **Line 1326**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `currentEdges !== originalGraphData.edges ||`

- **Line 1327**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `state.graph.directed !== originalGraphData.directed ||`

- **Line 1328**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `state.graph.weighted !== originalGraphData.weighted;`

### 📄 `js/ui/visual-editor.js`

- **Line 31**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `isVisualMode = mode === 'visual';`

- **Line 153**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (selectedNodes.length === 0 && selectedEdges.length === 0) {`

- **Line 153**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (selectedNodes.length === 0 && selectedEdges.length === 0) {`

- **Line 158**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (selectedNodes.length === 1 && selectedEdges.length === 0) {`

- **Line 158**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `} else if (selectedNodes.length === 1 && selectedEdges.length === 0) {`

- **Line 168**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `parts.push(`${selectedNodes.length} NODE${selectedNodes.length === 1 ? '' : 'S'}`);`

- **Line 171**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `parts.push(`${selectedEdges.length} EDGE${selectedEdges.length === 1 ? '' : 'S'}`);`

- **Line 264**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (edges.length === 0) {`

- **Line 277**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `${edge.weight !== 1 ? `<span class="weight-label">WEIGHT: ${edge.weight}</span>` : ''}`

### 📄 `js/utils/canvas-gesture.js`

- **Line 57**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `this.enableDebug = (options.debug === true) && !isProduction;`

- **Line 166**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (this.currentMode === 'retracted') {`

- **Line 197**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `this.allowScrolling = (zone === 'content'); // Allow scrolling in content areas initially`

- **Line 220**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (zone !== 'content') {`

- **Line 238**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const isGestureIntent = movementMagnitude > this.gestureThreshold || this.gestureStartZone !== 'content';`

- **Line 494**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (newMode !== this.currentMode) {`

- **Line 558**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (zone === 'tab-top' || zone === 'tab-bottom') {`

- **Line 558**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (zone === 'tab-top' || zone === 'tab-bottom') {`

- **Line 815**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const zoneName = index === 0 ? 'TOP' : 'BOTTOM';`

- **Line 872**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (element.id === 'graph-view-tab') {`

- **Line 898**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (inlineStyle === 'pointer') {`

- **Line 912**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (element.parentElement && element.parentElement.id === 'graph-view-tab') {`

- **Line 1068**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (elementAtTouch === tab || elementAtTouch?.closest('#graph-view-tab')) {`

### 📄 `js/utils/events.js`

- **Line 19**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (typeof element === 'string') {`

### 📄 `js/utils/validation.js`

- **Line 13**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!name || name.trim() === '') {`

- **Line 101**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const bidirectional = connector === '<->' || connector === '-';`

- **Line 101**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `const bidirectional = connector === '<->' || connector === '-';`

- **Line 104**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (from === to) {`

- **Line 190**: **Non-strict Equality**
  - *Issue*: Use === and !== to avoid unintended type coercion.
  - *Code*: `if (!name || name.trim() === '') {`

## 💧 Memory Leaks

### 📄 `js/graph/sigma-adapter.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 2, Removed: 1. E.g.: document.addEventListener('keydown', handleKeyDown);`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 18, Removed: 4. E.g.: timeout = setTimeout(later, wait);`

### 📄 `js/graph/sigma-controller.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 7, Removed: 1. E.g.: exportBtn.addEventListener('click', handleExport);`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 3, Removed: 1. E.g.: setTimeout(() => {`

### 📄 `js/graph/sigma-core.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 3, Removed: 1. E.g.: document.addEventListener('keydown', handleKeyDown);`

### 📄 `js/graph/sigma-layouts.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 6, Removed: 0. E.g.: setTimeout(() => {`

### 📄 `js/graph/sigma-rendering.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 1, Removed: 0. E.g.: setTimeout(() => {`

### 📄 `js/main.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 6, Removed: 1. E.g.: setTimeout(calculateDynamicValues, 50);`

### 📄 `js/ui/desktop-resize.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 4, Removed: 0. E.g.: resizeHandle.addEventListener('mousedown', handleMouseDown);`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 2, Removed: 0. E.g.: setTimeout(() => {`

### 📄 `js/ui/desktop-ui.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 1, Removed: 0. E.g.: setTimeout(() => {`

### 📄 `js/ui/euler-toggles.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 1, Removed: 0. E.g.: setTimeout(() => {`

### 📄 `js/ui/import-export.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 1, Removed: 0. E.g.: input.addEventListener('change', async (e) => {`

### 📄 `js/ui/init.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 4, Removed: 1. E.g.: setTimeout(() => {`

### 📄 `js/ui/loader.js`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 3, Removed: 0. E.g.: setTimeout(resolve, FADE_IN_DURATION);`

### 📄 `js/ui/saved-graphs-panel.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 7, Removed: 0. E.g.: saveButton.addEventListener('click', handleSave);`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 2, Removed: 0. E.g.: setTimeout(() => focusEditInput(editingId), 10);`

### 📄 `js/ui/saved-graphs.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 16, Removed: 0. E.g.: saveButton.addEventListener('click', handleSave);`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 5, Removed: 0. E.g.: setTimeout(() => {`

### 📄 `js/ui/visual-editor.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 2, Removed: 1. E.g.: document.addEventListener('euler:selection-changed', selectionChangeHandler);`

### 📄 `js/utils/canvas-gesture.js`

- **Line Multiple**: **Unbalanced Event Listener Attached**
  - *Issue*: Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.
  - *Code*: `Added: 23, Removed: 2. E.g.: window.addEventListener('resize', () => {`

- **Line Multiple**: **Unbalanced setTimeout Without Clear**
  - *Issue*: Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.
  - *Code*: `Added: 3, Removed: 0. E.g.: setTimeout(() => {`

## ⚡ Performance Issues

### 📄 `js/graph/sigma-adapter.js`

- **Line 112**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeInput = document.querySelector('#edges');`

- **Line 170**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `containerElement = document.querySelector(container);`

- **Line 1777**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const debugDiv = document.getElementById('sigma-debug-info');`

### 📄 `js/graph/sigma-controller.js`

- **Line 175**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const orbitalTest = document.getElementById('orbital-welcome');`

### 📄 `js/graph/sigma-core.js`

- **Line 50**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `containerElement = document.querySelector(container);`

- **Line 245**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const debugDiv = document.getElementById('sigma-debug-info');`

### 📄 `js/graph/sigma-selection.js`

- **Line 460**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeInput = document.querySelector('#edges');`

### 📄 `js/main.js`

- **Line 36**: **Layout Thrashing (Offset/Client properties)**
  - *Issue*: Reading layout properties forces the browser to calculate layout synchronously. Cache these values.
  - *Code*: `if (graphContainer.offsetWidth === 0 || graphContainer.offsetHeight === 0) {`

- **Line 36**: **Layout Thrashing (Offset/Client properties)**
  - *Issue*: Reading layout properties forces the browser to calculate layout synchronously. Cache these values.
  - *Code*: `if (graphContainer.offsetWidth === 0 || graphContainer.offsetHeight === 0) {`

- **Line 42**: **Layout Thrashing (getBoundingClientRect)**
  - *Issue*: Synchronous layout recalculation. Can cause layout thrashing if called frequently or inside loops/animations.
  - *Code*: `const containerRect = graphContainer.getBoundingClientRect();`

- **Line 170**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphLayer = document.getElementById('graph-layer');`

- **Line 264**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const pageLoader = document.getElementById('page-loader');`

- **Line 270**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const orbital = document.getElementById('orbital-welcome');`

- **Line 278**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const orbitalCheck = document.getElementById('orbital-welcome');`

### 📄 `js/ui/desktop-resize.js`

- **Line 22**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const resizeHandle = document.getElementById('desktop-resize-handle');`

- **Line 23**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const contentLayer = document.querySelector('.content-layer');`

- **Line 24**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphLayer = document.querySelector('.graph-layer');`

- **Line 89**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const contentLayer = document.querySelector('.content-layer');`

- **Line 90**: **Layout Thrashing (getBoundingClientRect)**
  - *Issue*: Synchronous layout recalculation. Can cause layout thrashing if called frequently or inside loops/animations.
  - *Code*: `startContentWidth = (contentLayer.getBoundingClientRect().width / window.innerWidth) * 100;`

- **Line 92**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const resizeHandle = document.getElementById('desktop-resize-handle');`

- **Line 141**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const contentLayer = document.querySelector('.content-layer');`

- **Line 142**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphLayer = document.querySelector('.graph-layer');`

- **Line 143**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const resizeHandle = document.getElementById('desktop-resize-handle');`

- **Line 179**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const contentLayer = document.querySelector('.content-layer');`

- **Line 180**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphLayer = document.querySelector('.graph-layer');`

- **Line 181**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const resizeHandle = document.getElementById('desktop-resize-handle');`

- **Line 197**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const resizeHandle = document.getElementById('desktop-resize-handle');`

- **Line 239**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const eulerText = document.getElementById('eulerText');`

### 📄 `js/ui/desktop-ui.js`

- **Line 105**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const eulerText = document.getElementById('eulerText');`

- **Line 256**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeInput = document.getElementById('edges');`

- **Line 277**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nodeCountEl = document.getElementById('node-count');`

- **Line 278**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeCountEl = document.getElementById('edge-count');`

### 📄 `js/ui/euler-toggles.js`

- **Line 58**: **Layout Thrashing (getBoundingClientRect)**
  - *Issue*: Synchronous layout recalculation. Can cause layout thrashing if called frequently or inside loops/animations.
  - *Code*: `const weightedToggleRect = weightedToggle.getBoundingClientRect();`

- **Line 61**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `let flagElement = document.getElementById('weighted-flag');`

- **Line 85**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const flagElement = document.getElementById('weighted-flag');`

- **Line 155**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const flagElement = document.getElementById('weighted-flag');`

### 📄 `js/ui/init.js`

- **Line 211**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const debugDiv = document.getElementById('drag-debug');`

- **Line 278**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphInfoStrip = document.getElementById('graph-info-strip');`

- **Line 317**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeInput = document.getElementById('edges');`

- **Line 342**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nodeCountEl = document.getElementById('node-count');`

- **Line 343**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeCountEl = document.getElementById('edge-count');`

- **Line 344**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphStats = document.getElementById('graph-stats');`

- **Line 345**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphMathNotation = document.getElementById('graph-math-notation');`

- **Line 346**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const vertexSet = document.getElementById('vertex-set');`

- **Line 347**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const edgeSet = document.getElementById('edge-set');`

- **Line 778**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const titleArea = document.getElementById('euler-logo');`

### 📄 `js/ui/notifications.js`

- **Line 55**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const titleArea = document.getElementById('euler-logo');`

### 📄 `js/ui/saved-graphs-panel.js`

- **Line 147**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nameInput = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-input`);`

- **Line 148**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nameDisplay = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-name`);`

- **Line 197**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphItem = document.querySelector(`.saved-graph-item[data-id="${graph.id}"]`);`

### 📄 `js/ui/saved-graphs.js`

- **Line 112**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nameInput = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-input`);`

- **Line 113**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nameDisplay = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-name`);`

- **Line 128**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nameDisplay = document.querySelector(`.saved-graph-item[data-id="${data.id}"] .saved-graph-name`);`

- **Line 134**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const nameInput = document.querySelector(`.saved-graph-item[data-id="${data.id}"] .saved-graph-input`);`

- **Line 272**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphItem = document.querySelector(`.saved-graph-item[data-id="${graph.id}"]`);`

- **Line 968**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const randomItem = document.querySelector('.random-generator');`

- **Line 1160**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const newItem = document.querySelector(`.saved-graph-item[data-id="${newGraph.id}"]`);`

- **Line 1257**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const savedSection = document.querySelector('.saved-section:not(:first-child)');`

- **Line 1266**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const graphItem = document.querySelector(`.saved-graph-item[data-id="${id}"]`);`

### 📄 `js/utils/canvas-gesture.js`

- **Line 145**: **Layout Thrashing (getBoundingClientRect)**
  - *Issue*: Synchronous layout recalculation. Can cause layout thrashing if called frequently or inside loops/animations.
  - *Code*: `this._cachedCanvasRect = this.canvas.getBoundingClientRect();`

- **Line 153**: **Layout Thrashing (getBoundingClientRect)**
  - *Issue*: Synchronous layout recalculation. Can cause layout thrashing if called frequently or inside loops/animations.
  - *Code*: `this._cachedCanvasRect = this.canvas.getBoundingClientRect();`

- **Line 657**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `if (!document.getElementById('canvas-gesture-styles')) {`

- **Line 747**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const styles = document.getElementById('canvas-gesture-styles');`

- **Line 755**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const tab = document.getElementById('graph-view-tab');`

- **Line 756**: **Layout Thrashing (Offset/Client properties)**
  - *Issue*: Reading layout properties forces the browser to calculate layout synchronously. Cache these values.
  - *Code*: `const tabHeight = tab ? tab.offsetHeight : GESTURE_CONFIG.ZONE_HEIGHT;`

- **Line 950**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const tab = document.getElementById('graph-view-tab');`

- **Line 1089**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const tab = document.getElementById('graph-view-tab');`

- **Line 1108**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const tab = document.getElementById('graph-view-tab');`

- **Line 1128**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `const tab = document.getElementById('graph-view-tab');`

### 📄 `js/utils/dom.js`

- **Line 11**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `export const $ = selector => document.querySelector(selector);`

- **Line 18**: **DOM Query**
  - *Issue*: Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.
  - *Code*: `export const $$ = selector => Array.from(document.querySelectorAll(selector));`

### 📄 `css/base.css`

- **Line 161**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `* {`

### 📄 `css/bundle.css`

- **Line 161**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `* {`

- **Line 879**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `.content-layer * {`

- **Line 1023**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `.content-layer.dragging * {`

- **Line 2437**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `/* .segmented-control {`

- **Line 3830**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="euler-"] {`

- **Line 3834**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-circle {`

- **Line 3842**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-circle img {`

- **Line 3848**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-spinner {`

- **Line 3858**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-pulse {`

### 📄 `css/custom-icons.css`

- **Line 142**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="euler-"] {`

- **Line 146**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-circle {`

- **Line 154**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-circle img {`

- **Line 160**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-spinner {`

- **Line 170**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `[class*="-loader"] .euler-pulse {`

### 📄 `css/form-elements.css`

- **Line 249**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `/* .segmented-control {`

### 📄 `css/layout.css`

- **Line 550**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `.content-layer * {`

- **Line 694**: **Universal Selector**
  - *Issue*: Universal selectors (*) can be slow if deeply nested. Use with caution.
  - *Code*: `.content-layer.dragging * {`

## ❌ Bad Practices

*No major issues found in this category based on standard static analysis.*

## ⚠️ Error Handling

*No major issues found in this category based on standard static analysis.*

## ♿ Accessibility (A11y)

*No major issues found in this category based on standard static analysis.*

## 🏗️ Architecture Flaws

### 📄 `js/graph/sigma-adapter.js`

- **Line 269**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.position = 'absolute';`

- **Line 270**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.bottom = '10px';`

- **Line 271**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.right = '10px';`

- **Line 272**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.zIndex = '10';`

- **Line 273**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.padding = '8px 12px';`

- **Line 274**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.background = '#ffffff';`

- **Line 275**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.border = '1px solid #ccc';`

- **Line 276**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.borderRadius = '4px';`

- **Line 277**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.cursor = 'pointer';`

- **Line 1884**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `containerElement.innerHTML = '';`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 2214 lines`

### 📄 `js/graph/sigma-controller.js`

- **Line 602**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `resultPathEl.innerHTML = `<span class="path-title">Path:</span> ${pathStr}`;`

- **Line 627**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `explanationContentEl.innerHTML = getExplanation(result);`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 988 lines`

### 📄 `js/graph/sigma-core.js`

- **Line 126**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.position = 'absolute';`

- **Line 127**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.bottom = '10px';`

- **Line 128**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.right = '10px';`

- **Line 129**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.zIndex = '10';`

- **Line 130**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.padding = '8px 12px';`

- **Line 131**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.background = '#ffffff';`

- **Line 132**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.border = '1px solid #ccc';`

- **Line 133**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.borderRadius = '4px';`

- **Line 134**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resetBtn.style.cursor = 'pointer';`

- **Line 304**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `containerElement.innerHTML = '';`

### 📄 `js/main.js`

- **Line 85**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `border.style.cssText = ``

- **Line 112**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `border.style.opacity = '1';`

- **Line 121**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `border.style.opacity = '0';`

### 📄 `js/ui/desktop-resize.js`

- **Line 47**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `ghostLine.style.cssText = ``

- **Line 63**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `previewOverlay.style.cssText = ``

- **Line 94**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `document.body.style.cursor = 'ew-resize';`

- **Line 95**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `document.body.style.userSelect = 'none';`

- **Line 98**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `ghostLine.style.display = 'block';`

- **Line 99**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `previewOverlay.style.display = 'block';`

- **Line 103**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `ghostLine.style.left = `${currentPosition}px`;`

- **Line 120**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `ghostLine.style.left = `${newPosition}px`;`

- **Line 123**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `previewOverlay.innerHTML = ``

- **Line 146**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transition = 'width 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';`

- **Line 147**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphLayer.style.transition = 'width 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';`

- **Line 148**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resizeHandle.style.transition = 'left 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';`

- **Line 151**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.width = `${constrainedWidth}%`;`

- **Line 152**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphLayer.style.width = `${graphWidth}%`;`

- **Line 153**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resizeHandle.style.left = `${constrainedWidth}%`;`

- **Line 156**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `ghostLine.style.display = 'none';`

- **Line 157**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `previewOverlay.style.display = 'none';`

- **Line 161**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transition = '';`

- **Line 162**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphLayer.style.transition = '';`

- **Line 163**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `resizeHandle.style.transition = '';`

- **Line 172**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `document.body.style.cursor = '';`

- **Line 173**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `document.body.style.userSelect = '';`

- **Line 183**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (contentLayer) contentLayer.style.width = '';`

- **Line 184**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (graphLayer) graphLayer.style.width = '';`

- **Line 185**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (resizeHandle) resizeHandle.style.left = '';`

- **Line 188**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (ghostLine) ghostLine.style.display = 'none';`

- **Line 189**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (previewOverlay) previewOverlay.style.display = 'none';`

- **Line 219**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `document.body.style.cursor = '';`

- **Line 220**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `document.body.style.userSelect = '';`

### 📄 `js/ui/desktop-ui.js`

- **Line 173**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `mobileSimpleControls.style.display = 'block';`

- **Line 192**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `mobileSimpleControls.style.display = 'none';`

- **Line 197**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transform = '';`

- **Line 202**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'none';`

### 📄 `js/ui/euler-toggles.js`

- **Line 66**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `flagElement.innerHTML = '🇨🇳';`

- **Line 71**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `flagElement.style.left = `${weightedToggleRect.right + 10}px`;`

- **Line 72**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `flagElement.style.top = `${weightedToggleRect.top + weightedToggleRect.height/2 - 10}px`;`

### 📄 `js/ui/import-export.js`

- **Line 212**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `input.style.display = 'none';`

### 📄 `js/ui/init.js`

- **Line 256**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transform = `translateY(${position}%)`;`

- **Line 294**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';`

- **Line 299**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'flex';`

- **Line 303**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';`

- **Line 308**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'none';`

- **Line 357**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (graphStats) graphStats.style.display = 'block';`

- **Line 358**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (graphMathNotation) graphMathNotation.style.display = 'none';`

- **Line 361**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (graphStats) graphStats.style.display = 'none';`

- **Line 362**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (graphMathNotation) graphMathNotation.style.display = 'flex';`

- **Line 371**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `vertexSet.innerHTML = vertexNotation;`

- **Line 387**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `edgeSet.innerHTML = finalEdgeNotation;`

- **Line 456**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `mobileSimpleControls.style.display = 'block';`

- **Line 491**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.webkitOverflowScrolling = 'touch';`

- **Line 496**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `control.style.touchAction = 'manipulation';`

- **Line 511**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `mobileSimpleControls.style.display = 'block';`

- **Line 547**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `mobileSimpleControls.style.display = 'none';`

- **Line 552**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transform = '';`

- **Line 557**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (graphControls) graphControls.style.display = 'none';`

- **Line 742**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `icon.style.marginRight = '8px';`

- **Line 745**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `banner.innerHTML = '';`

- **Line 819**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (contentLayer) contentLayer.style.transform = 'translateY(0%)';`

- **Line 822**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (contentLayer) contentLayer.style.transform = 'translateY(-50%)';`

- **Line 825**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (contentLayer) contentLayer.style.transform = 'translateY(-91%)';`

- **Line 850**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';`

- **Line 852**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';`

- **Line 862**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'flex';`

- **Line 864**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'none';`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 867 lines`

### 📄 `js/ui/loader.js`

- **Line 76**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `elements.cyContainer.style.opacity = '0.01';`

- **Line 80**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `elements.orbitalPaths.style.opacity = '0.01';`

- **Line 122**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `elements.cyContainer.style.opacity = '1';`

- **Line 126**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `elements.orbitalPaths.style.opacity = '1';`

- **Line 167**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (elements.cyContainer) elements.cyContainer.style.opacity = '1';`

- **Line 168**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `if (elements.orbitalPaths) elements.orbitalPaths.style.opacity = '1';`

### 📄 `js/ui/mobile-ui.js`

- **Line 72**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `mobileSimpleControls.style.display = 'block';`

- **Line 110**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.webkitOverflowScrolling = 'touch';`

- **Line 114**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `control.style.touchAction = 'manipulation';`

- **Line 134**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> Content View <i class="fas fa-arrow-down"></i>';`

- **Line 136**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> Graph View <i class="fas fa-arrow-up"></i>';`

- **Line 148**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'flex';`

- **Line 150**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `graphControls.style.display = 'none';`

- **Line 174**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transform = 'translateY(0%)';`

- **Line 177**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transform = 'translateY(-50%)';`

- **Line 180**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `contentLayer.style.transform = 'translateY(-85%)';`

### 📄 `js/ui/notifications.js`

- **Line 69**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `icon.style.marginRight = '8px';`

- **Line 72**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `banner.innerHTML = '';`

### 📄 `js/ui/saved-graphs-panel.js`

- **Line 151**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `nameDisplay.style.display = 'none';`

- **Line 152**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `nameInput.style.display = 'block';`

- **Line 216**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `savedGraphsList.innerHTML = '';`

- **Line 414**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveButton.style.display = hasEdges ? 'block' : 'none';`

- **Line 417**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveButton.innerHTML = '<i class="fas fa-save"></i> Update Graph';`

- **Line 419**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveButton.innerHTML = '<i class="fas fa-save"></i> Save Graph';`

- **Line 421**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveButton.innerHTML = '<i class="fas fa-save"></i> Save New Graph';`

### 📄 `js/ui/saved-graphs.js`

- **Line 116**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `nameDisplay.style.display = 'none';`

- **Line 117**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `nameInput.style.display = 'block';`

- **Line 131**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `nameDisplay.style.display = 'block';`

- **Line 136**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `nameInput.style.display = 'none';`

- **Line 191**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveButton.style.display = hasEdges ? 'block' : 'none';`

- **Line 195**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveButton.innerHTML = '<i class="fas fa-save"></i> Update Graph';`

- **Line 197**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveButton.innerHTML = '<i class="fas fa-save"></i> Save Graph';`

- **Line 199**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveButton.innerHTML = '<i class="fas fa-save"></i> Save New Graph';`

- **Line 208**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `saveHint.innerHTML = '<i class="fas fa-info-circle"></i> You\'ve made changes to this graph';`

- **Line 209**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.opacity = '1';`

- **Line 210**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.height = 'auto';`

- **Line 211**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.padding = `var(--spacing-2) var(--spacing-3)`;`

- **Line 212**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.marginBottom = '0';`

- **Line 216**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.opacity = '0';`

- **Line 217**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.height = '0';`

- **Line 218**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.padding = '0';`

- **Line 219**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `saveHint.style.marginBottom = '0';`

- **Line 293**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `container.innerHTML = '';`

- **Line 1193**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `currentGraphSection.innerHTML = ``

- **Line 1230**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `currentGraphSection.innerHTML = ``

- **Line 1278**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `currentGraphSection.innerHTML = ``

- **Line 1286**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `currentGraphSection.innerHTML = ``

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 1339 lines`

### 📄 `js/ui/visual-editor.js`

- **Line 155**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `button.innerHTML = '<i class="fas fa-mouse-pointer"></i> SELECT NODE TO BEGIN';`

- **Line 157**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `button.style.opacity = '0.6';`

- **Line 161**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `button.innerHTML = `<span>"${selectedNodeId}"</span> | <i class="fas fa-trash"></i> DELETE`;`

- **Line 163**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `button.style.opacity = '1';`

- **Line 173**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `button.innerHTML = `<span>${parts.join(' / ')}</span> | <i class="fas fa-trash"></i> DELETE`;`

- **Line 175**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `button.style.opacity = '1';`

- **Line 247**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `button.innerHTML = '<i class="fas fa-plus"></i> ADD EDGE';`

- **Line 249**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `button.style.opacity = '1';`

- **Line 262**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `container.innerHTML = '';`

- **Line 265**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `container.innerHTML = '<div class="edge-item">No edges to display</div>';`

- **Line 272**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `edgeItem.innerHTML = ``

- **Line 291**: **innerHTML Usage**
  - *Issue*: Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.
  - *Code*: `container.innerHTML = ``

### 📄 `js/utils/canvas-gesture.js`

- **Line 98**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.canvas.style.cssText = ``

- **Line 207**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.contentElement.style.transition = 'none';`

- **Line 343**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.contentElement.style.transition = 'none'; // Let JavaScript handle all timing`

- **Line 467**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.contentElement.style.transform = `translateY(${translateY}%)`;`

- **Line 480**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.contentElement.style.transform = `translateY(${translateY}%)`;`

- **Line 515**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.contentElement.style.transition = 'none !important';`

- **Line 516**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.contentElement.style.webkitTransition = 'none !important';`

- **Line 639**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `point.style.cssText = ``

- **Line 762**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.topGestureZone.style.cssText = ``

- **Line 778**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.bottomGestureZone.style.cssText = ``

- **Line 927**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.topGestureZone.style.pointerEvents = 'none';`

- **Line 928**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.bottomGestureZone.style.pointerEvents = 'none';`

- **Line 932**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.topGestureZone.style.pointerEvents = 'auto';`

- **Line 933**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `this.bottomGestureZone.style.pointerEvents = 'auto';`

- **Line 962**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.touchAction = 'none';`

- **Line 963**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.webkitUserSelect = 'none';`

- **Line 964**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.userSelect = 'none';`

- **Line 965**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.webkitTouchCallout = 'none';`

- **Line 1093**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.transform = 'scale(0.98)';`

- **Line 1094**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';`

- **Line 1095**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.boxShadow = '0 4px 12px rgba(255, 167, 38, 0.8)'; // Bright orange glow`

- **Line 1096**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.backgroundColor = '#FFA726'; // Bright orange background`

- **Line 1097**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.color = '#000'; // Black text for contrast`

- **Line 1098**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.opacity = '1'; // Remove any transparency`

- **Line 1112**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.transform = '';`

- **Line 1113**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.transition = '';`

- **Line 1114**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.boxShadow = '';`

- **Line 1115**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.backgroundColor = ''; // Let CSS handle background (will be orange)`

- **Line 1116**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.color = ''; // Let CSS handle color (will be black)`

- **Line 1117**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.opacity = '';`

- **Line 1132**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.borderLeft = '';`

- **Line 1133**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.borderRadius = '';`

- **Line 1134**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.background = '';`

- **Line 1146**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.borderLeft = '4px solid #4CAF50';`

- **Line 1147**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.borderRadius = '0 8px 8px 0';`

- **Line 1148**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.background = `linear-gradient(to right,`

- **Line 1155**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.borderLeft = '3px solid #FFEB3B';`

- **Line 1156**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.background = `linear-gradient(to right,`

- **Line 1162**: **Inline Styles**
  - *Issue*: Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.
  - *Code*: `tab.style.background = `linear-gradient(to right,`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 1169 lines`

### 📄 `css/base.css`

- **Line 308**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media screen and (max-width: 320px) {`

- **Line 314**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media screen and (min-width: 1440px) {`

### 📄 `css/branding.css`

- **Line 180**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 203**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* No JS transform on mobile */`

### 📄 `css/bundle.css`

- **Line 310**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media screen and (max-width: 320px) {`

- **Line 316**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media screen and (min-width: 1440px) {`

- **Line 372**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 377**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 388**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 400**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: relative !important;`

- **Line 405**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important;`

- **Line 415**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: relative !important;`

- **Line 491**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fadeOpacity {`

- **Line 553**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: 60px !important;`

- **Line 558**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: calc(100% - 60px) !important;`

- **Line 589**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: sticky !important; /* Sticky instead of fixed - stays at bottom during scroll, moves with content during transforms */`

- **Line 590**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `bottom: 0 !important;`

- **Line 614**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `pointer-events: auto !important;`

- **Line 620**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 1 !important;`

- **Line 634**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin-bottom: 0 !important;`

- **Line 644**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@supports (padding: max(0px)) {`

- **Line 647**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FF9800 !important;`

- **Line 653**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 671**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 673**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FF9800 !important; /* Keep orange, no hover effect */`

- **Line 674**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: #000 !important;`

- **Line 675**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `box-shadow: 0 -4px 20px rgba(255, 152, 0, 0.6) !important;`

- **Line 676**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* No transform on mobile hover */`

- **Line 680**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #F57C00 !important; /* Slightly darker orange on press */`

- **Line 681**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: #000 !important;`

- **Line 682**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* No transform to avoid alignment issues */`

- **Line 687**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 711**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FFA726 !important; /* Even brighter orange during gesture */`

- **Line 713**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `box-shadow: 0 4px 12px rgba(255, 167, 38, 0.8) !important; /* Brighter glow */`

- **Line 714**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-top-color: #FFB74D !important; /* Light orange border */`

- **Line 715**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: #000 !important;`

- **Line 718**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 1 !important;`

- **Line 719**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `backdrop-filter: none !important;`

- **Line 723**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 732**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@supports (-webkit-touch-callout: none) {`

- **Line 734**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FFA726 !important;`

- **Line 735**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 1 !important;`

- **Line 741**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 746**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 751**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: block !important;`

- **Line 788**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: flex !important;`

- **Line 804**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 835**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 944**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@supports (padding: max(0px)) {`

- **Line 953**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1007**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (pointer: coarse) and (max-width: 768px) {`

- **Line 1016**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 1031**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transition: none !important; /* Disable transitions during dragging */`

- **Line 1038**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transition: none !important; /* Disable transitions during dragging */`

- **Line 1056**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (prefers-contrast: high) {`

- **Line 1064**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (prefers-reduced-motion: reduce) {`

- **Line 1078**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1085**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1089**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1096**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1100**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 1102**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1107**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 1109**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 1491**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 1509**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 1670**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fadeIn {`

- **Line 1681**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes slideIn {`

- **Line 1690**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes pulseHighlight {`

- **Line 1753**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 1875**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 1931**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 40.0625em) {`

- **Line 2090**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin: 0 !important;`

- **Line 2091**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `padding: 0 !important;`

- **Line 2112**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 2522**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes focus-pulse {`

- **Line 2543**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 2549**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 2738**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 2761**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* No JS transform on mobile */`

- **Line 2927**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 2965**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 2968**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 2973**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: fixed !important;`

- **Line 2974**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `bottom: 0 !important;`

- **Line 2975**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `left: 0 !important;`

- **Line 2976**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `right: 0 !important;`

- **Line 2977**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `top: auto !important; /* Override any top positioning */`

- **Line 2978**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* Remove any transforms */`

- **Line 2979**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `z-index: 1000 !important; /* Lower than tab's 2000 */`

- **Line 2980**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: rgba(var(--dark-color-2-rgb), 0.95) !important;`

- **Line 2984**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `flex-direction: row !important;`

- **Line 2988**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `height: 80px !important;`

- **Line 2994**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: 60px !important;`

- **Line 2995**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `height: 50px !important;`

- **Line 2996**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-radius: 4px !important; /* Rectangular, not circular */`

- **Line 2997**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: var(--dark-color-3) !important;`

- **Line 2998**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border: 1px solid var(--primary-color) !important;`

- **Line 2999**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: var(--text-primary) !important;`

- **Line 3000**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: flex !important;`

- **Line 3001**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `flex-direction: column !important;`

- **Line 3002**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `align-items: center !important;`

- **Line 3003**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `justify-content: center !important;`

- **Line 3004**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `cursor: pointer !important;`

- **Line 3005**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `font-size: 12px !important;`

- **Line 3006**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `padding: 4px !important;`

- **Line 3007**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: relative !important;`

- **Line 3040**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin-left: 5px !important;`

- **Line 3041**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin-right: 5px !important;`

- **Line 3045**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 3047**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 3075**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 3121**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 3126**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 3129**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 3601**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 3608**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 3802**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes spin-euler {`

- **Line 3807**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes spin-euler-reverse {`

- **Line 3812**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes pulse-spinner {`

- **Line 3817**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-in {`

- **Line 3822**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-out {`

- **Line 4081**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 0.5 !important;`

- **Line 4266**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 4268**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important; /* Hide completely on mobile - mobile simple controls are used instead */`

- **Line 4399**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 4406**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 4558**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 4564**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 4635**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-left-color: var(--focus-outline-color) !important; /* Yellow left border when pressed */`

- **Line 4702**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-left-color: var(--focus-outline-color) !important; /* Yellow left border when pressed */`

- **Line 4755**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 4769**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

- **Line 4824**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes simple-spin {`

- **Line 4828**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes loader-pulse {`

- **Line 5002**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes orbital-entrance {`

- **Line 5018**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-center {`

- **Line 5030**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-euler-image {`

- **Line 5045**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-morph-to-oval {`

- **Line 5057**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-scale-to-fill {`

- **Line 5066**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes ring-scale-and-fade {`

- **Line 5081**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-border-morph-dynamic {`

- **Line 5099**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-fade-out {`

- **Line 5104**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-image-fade {`

- **Line 5116**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes orbital-spin {`

- **Line 5121**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes orbital-pulse {`

- **Line 5132**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 5149**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (prefers-reduced-motion: reduce) {`

- **Line 5152**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `animation-duration: 0.01ms !important;`

- **Line 5153**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `animation-iteration-count: 1 !important;`

- **Line 5154**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transition-duration: 0.01ms !important;`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 5157 lines`

### 📄 `css/buttons.css`

- **Line 39**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 40.0625em) {`

- **Line 198**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin: 0 !important;`

- **Line 199**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `padding: 0 !important;`

- **Line 220**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/components.css`

- **Line 106**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

### 📄 `css/custom-icons.css`

- **Line 114**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes spin-euler {`

- **Line 119**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes spin-euler-reverse {`

- **Line 124**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes pulse-spinner {`

- **Line 129**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-in {`

- **Line 134**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-out {`

### 📄 `css/edge-list.css`

- **Line 125**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 132**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/euler-toggles.css`

- **Line 53**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 0.5 !important;`

- **Line 238**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 240**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important; /* Hide completely on mobile - mobile simple controls are used instead */`

### 📄 `css/form-elements.css`

- **Line 334**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes focus-pulse {`

- **Line 355**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 361**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/graph-controls.css`

- **Line 149**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 187**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 190**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 195**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: fixed !important;`

- **Line 196**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `bottom: 0 !important;`

- **Line 197**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `left: 0 !important;`

- **Line 198**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `right: 0 !important;`

- **Line 199**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `top: auto !important; /* Override any top positioning */`

- **Line 200**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* Remove any transforms */`

- **Line 201**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `z-index: 1000 !important; /* Lower than tab's 2000 */`

- **Line 202**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: rgba(var(--dark-color-2-rgb), 0.95) !important;`

- **Line 206**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `flex-direction: row !important;`

- **Line 210**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `height: 80px !important;`

- **Line 211**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: 100vw !important;`

- **Line 216**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: 60px !important;`

- **Line 217**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `height: 50px !important;`

- **Line 218**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-radius: 4px !important; /* Rectangular, not circular */`

- **Line 219**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: var(--dark-color-3) !important;`

- **Line 220**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border: 1px solid var(--primary-color) !important;`

- **Line 221**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: var(--text-primary) !important;`

- **Line 222**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: flex !important;`

- **Line 223**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `flex-direction: column !important;`

- **Line 224**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `align-items: center !important;`

- **Line 225**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `justify-content: center !important;`

- **Line 226**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `cursor: pointer !important;`

- **Line 227**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `font-size: 12px !important;`

- **Line 228**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `padding: 4px !important;`

- **Line 229**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `position: relative !important;`

- **Line 262**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin-left: 5px !important;`

- **Line 263**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `margin-right: 5px !important;`

- **Line 267**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 269**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

### 📄 `css/layout.css`

- **Line 41**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 46**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 56**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 160**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fadeOpacity {`

- **Line 170**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: 60px !important;`

- **Line 174**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `width: calc(100% - 60px) !important;`

- **Line 311**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@supports (padding: max(0px)) {`

- **Line 314**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FF9800 !important;`

- **Line 320**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 340**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 342**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FF9800 !important; /* Keep orange, no hover effect */`

- **Line 343**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: #000 !important;`

- **Line 344**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `box-shadow: 0 -4px 20px rgba(255, 152, 0, 0.6) !important;`

- **Line 345**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* No transform on mobile hover */`

- **Line 349**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #F57C00 !important; /* Slightly darker orange on press */`

- **Line 350**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: #000 !important;`

- **Line 351**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transform: none !important; /* No transform to avoid alignment issues */`

- **Line 356**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 380**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FFA726 !important; /* Even brighter orange during gesture */`

- **Line 382**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `box-shadow: 0 4px 12px rgba(255, 167, 38, 0.8) !important; /* Brighter glow */`

- **Line 383**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-top-color: #FFB74D !important; /* Light orange border */`

- **Line 384**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `color: #000 !important;`

- **Line 387**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 1 !important;`

- **Line 388**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `backdrop-filter: none !important;`

- **Line 392**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 401**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@supports (-webkit-touch-callout: none) {`

- **Line 403**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `background: #FFA726 !important;`

- **Line 404**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `opacity: 1 !important;`

- **Line 410**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 417**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 422**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: block !important;`

- **Line 459**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: flex !important;`

- **Line 475**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 506**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 615**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@supports (padding: max(0px)) {`

- **Line 624**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 678**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (pointer: coarse) and (max-width: 768px) {`

- **Line 687**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 702**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transition: none !important; /* Disable transitions during dragging */`

- **Line 709**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transition: none !important; /* Disable transitions during dragging */`

- **Line 727**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (prefers-contrast: high) {`

- **Line 735**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (prefers-reduced-motion: reduce) {`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 796 lines`

### 📄 `css/loading.css`

- **Line 54**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes simple-spin {`

- **Line 58**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes loader-pulse {`

### 📄 `css/notifications.css`

- **Line 27**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 73**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

- **Line 78**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (min-width: 769px) {`

- **Line 81**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `display: none !important;`

### 📄 `css/optimization.css`

- **Line 66**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fadeIn {`

- **Line 77**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes slideIn {`

- **Line 86**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes pulseHighlight {`

- **Line 149**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/orbital-animation.css`

- **Line 162**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes orbital-entrance {`

- **Line 178**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-center {`

- **Line 190**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes fade-euler-image {`

- **Line 205**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-morph-to-oval {`

- **Line 217**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-scale-to-fill {`

- **Line 226**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes ring-scale-and-fade {`

- **Line 241**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-border-morph-dynamic {`

- **Line 259**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-fade-out {`

- **Line 264**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes euler-image-fade {`

- **Line 276**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes orbital-spin {`

- **Line 281**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@keyframes orbital-pulse {`

- **Line 292**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 768px) {`

- **Line 309**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (prefers-reduced-motion: reduce) {`

- **Line 312**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `animation-duration: 0.01ms !important;`

- **Line 313**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `animation-iteration-count: 1 !important;`

- **Line 314**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `transition-duration: 0.01ms !important;`

### 📄 `css/results-panel.css`

- **Line 129**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 135**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/saved-graphs.css`

- **Line 383**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 390**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/sidebar.css`

- **Line 65**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-left-color: var(--focus-outline-color) !important; /* Yellow left border when pressed */`

- **Line 132**: **!important Usage**
  - *Issue*: Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.
  - *Code*: `border-left-color: var(--focus-outline-color) !important; /* Yellow left border when pressed */`

- **Line 185**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 199**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `css/utility.css`

- **Line 347**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 992px) {`

- **Line 365**: **Vendor Prefixes**
  - *Issue*: Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.
  - *Code*: `@media (max-width: 576px) {`

### 📄 `index.html`

- **Line 95**: **Inline Style Attribute**
  - *Issue*: Inline styles violate CSP and separation of concerns.
  - *Code*: `<div class="graph-controls" id="graph-controls" style="display: none;">`

- **Line 232**: **Inline Style Attribute**
  - *Issue*: Inline styles violate CSP and separation of concerns.
  - *Code*: `<div class="mobile-simple-controls" style="display: none;">`

### 📄 `js/core/algorithm.js`

- **Line N/A**: **Massive File (God Object)**
  - *Issue*: Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.
  - *Code*: `File size: 556 lines`


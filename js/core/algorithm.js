/**
 * Algorithm Module
 * Implements Euler path calculation and related algorithms
 */

/**
 * Find an Euler path in a graph (represented as an adjacency list)
 * @param {Object} adjacencyList - Graph represented as adjacency list
 * @param {string} [startVertex] - Optional starting vertex
 * @param {boolean} [isWeighted=false] - Whether to use Chinese Postman algorithm for weighted graphs
 * @return {Object} Result object with path, hasPath, and hasCircuit properties
 */
export const findEulerPath = (adjacencyList, startVertex = null, isWeighted = false) => {
  // Use Chinese Postman algorithm for weighted graphs
  if (isWeighted) {
    return chinesePostmanAlgorithm(adjacencyList, startVertex);
  }
  
  // Make a copy to avoid modifying the original
  const graph = JSON.parse(JSON.stringify(adjacencyList));
  
  // Check if graph is empty
  if (Object.keys(graph).length === 0) {
    return {
      path: [],
      hasPath: false,
      hasCircuit: false,
      explanation: 'Graph is empty'
    };
  }
  
  // Count degrees
  const degrees = countDegrees(graph);
  
  // Find vertices with odd degree
  const oddVertices = Object.entries(degrees)
    .filter(([_, degree]) => degree % 2 !== 0)
    .map(([vertex]) => vertex);
  
  // Check if an Euler path or circuit exists
  const hasPath = oddVertices.length === 0 || oddVertices.length === 2;
  const hasCircuit = oddVertices.length === 0;
  
  // Determine starting vertex
  let start = startVertex;
  
  if (!start) {
    if (oddVertices.length > 0) {
      // Start from a vertex with odd degree
      start = oddVertices[0];
    } else {
      // Start from any vertex
      start = Object.keys(graph)[0];
    }
  }
  
  let explanation = '';
  
  if (!hasPath) {
    explanation = 'No Euler path exists because more than two vertices have odd degree.';
    return {
      path: [],
      hasPath: false,
      hasCircuit: false,
      explanation
    };
  } else if (hasCircuit) {
    explanation = 'An Euler circuit exists because all vertices have even degree.';
  } else {
    explanation = 'An Euler path exists because exactly two vertices have odd degree.';
  }
  
  // Perform Hierholzer's algorithm to find the path
  const path = hierholzerAlgorithm(graph, start);
  
  return {
    path,
    hasPath,
    hasCircuit,
    explanation
  };
};

/**
 * Chinese Postman Algorithm (for weighted graphs)
 * Finds minimum-weight Euler path or circuit by adding duplicate edges
 * @param {Object} adjacencyList - Graph represented as adjacency list
 * @param {string} [startVertex] - Optional starting vertex
 * @return {Object} Result object with path, hasPath, hasCircuit and additional properties
 */
export const chinesePostmanAlgorithm = (adjacencyList, startVertex = null) => {
  // Make a copy to avoid modifying the original
  const graph = JSON.parse(JSON.stringify(adjacencyList));
  
  // Check if graph is empty
  if (Object.keys(graph).length === 0) {
    return {
      path: [],
      hasPath: false,
      hasCircuit: false,
      explanation: 'Graph is empty',
      isChinesePostman: true
    };
  }
  
  // Count degrees
  const degrees = countDegrees(graph);
  
  // Find vertices with odd degree
  const oddVertices = Object.entries(degrees)
    .filter(([_, degree]) => degree % 2 !== 0)
    .map(([vertex]) => vertex);
  
  // Check if already an Euler path or circuit exists
  const hasCircuit = oddVertices.length === 0;
  const hasPath = hasCircuit || oddVertices.length === 2;
  
  let explanation = '';
  let duplicatedEdges = [];
  let totalWeight = 0;
  
  // Original adjacency list for reference
  const originalGraph = JSON.parse(JSON.stringify(adjacencyList));
  
  // Calculate total weight of original edges
  const originalEdges = getEdgesFromAdjacencyList(originalGraph);
  originalEdges.forEach(edge => {
    totalWeight += edge.weight || 1;
  });
  
  if (hasCircuit) {
    // Already an Euler circuit - just find it
    explanation = 'An Euler circuit already exists. Using Chinese Postman to find minimum-weight tour.';
  } else if (hasPath) {
    // Already an Euler path - just find it
    explanation = 'An Euler path already exists. Using Chinese Postman to find minimum-weight path.';
  } else {
    // Need to add duplicate edges to make an Euler circuit
    explanation = 'Adding duplicate edges to create a minimum-weight tour using Chinese Postman algorithm.';
    
    // Find minimum-weight matching for odd vertices
    const matching = findGreedyMatching(oddVertices, graph);
    
    // Add duplicate edges based on matching
    matching.forEach(pair => {
      const [u, v] = pair;
      const path = findShortestPath(graph, u, v);
      
      if (path && path.length > 1) {
        // Add duplicate edges along the shortest path
        for (let i = 0; i < path.length - 1; i++) {
          const source = path[i];
          const target = path[i + 1];
          
          // Find the weight of this edge
          const weight = findEdgeWeight(graph, source, target);
          
          // Add to duplicated edges list
          duplicatedEdges.push({source, target, weight});
          
          // Add duplicate edge to graph
          if (!graph[source]) graph[source] = [];
          graph[source].push({vertex: target, weight});
          
          if (!graph[target]) graph[target] = [];
          graph[target].push({vertex: source, weight});
          
          // Add to total weight
          totalWeight += weight;
        }
      }
    });
  }
  
  // Determine starting vertex
  let start = startVertex;
  if (!start) {
    start = Object.keys(graph)[0];
  }
  
  // Perform Hierholzer's algorithm to find the path
  const path = hierholzerAlgorithm(graph, start);
  
  return {
    path,
    hasPath: true, // Chinese Postman always creates a valid path
    hasCircuit: hasCircuit || oddVertices.length > 0, // If we added edges, it's now a circuit
    explanation,
    isChinesePostman: true,
    duplicatedEdges,
    totalWeight
  };
};

/**
 * Find a greedy matching for odd vertices
 * This is a simple approximation of minimum-weight perfect matching
 * @param {Array} oddVertices - List of vertices with odd degree
 * @param {Object} graph - Adjacency list representation
 * @return {Array} Array of vertex pairs (matches)
 */
function findGreedyMatching(oddVertices, graph) {
  const matches = [];
  const unmatched = new Set(oddVertices);
  
  // Sort all possible pairs by distance
  const pairs = [];
  for (let i = 0; i < oddVertices.length; i++) {
    for (let j = i + 1; j < oddVertices.length; j++) {
      const u = oddVertices[i];
      const v = oddVertices[j];
      const distance = findShortestPathDistance(graph, u, v);
      pairs.push({u, v, distance});
    }
  }
  
  // Sort by distance (ascending)
  pairs.sort((a, b) => a.distance - b.distance);
  
  // Greedily pick pairs
  for (const pair of pairs) {
    if (unmatched.has(pair.u) && unmatched.has(pair.v)) {
      matches.push([pair.u, pair.v]);
      unmatched.delete(pair.u);
      unmatched.delete(pair.v);
    }
    
    if (unmatched.size === 0) break;
  }
  
  return matches;
}

/**
 * Find the shortest path between two vertices
 * Simple Dijkstra's algorithm implementation
 * @param {Object} graph - Adjacency list
 * @param {string} start - Start vertex
 * @param {string} end - End vertex
 * @return {Array} Shortest path as array of vertices
 */
function findShortestPath(graph, start, end) {
  const distances = {};
  const previous = {};
  const nodes = new Set();
  
  // Initialize
  for (const vertex in graph) {
    distances[vertex] = Infinity;
    previous[vertex] = null;
    nodes.add(vertex);
  }
  distances[start] = 0;
  
  while (nodes.size > 0) {
    // Find vertex with minimum distance
    let minVertex = null;
    let minDistance = Infinity;
    for (const vertex of nodes) {
      if (distances[vertex] < minDistance) {
        minVertex = vertex;
        minDistance = distances[vertex];
      }
    }
    
    // No path exists
    if (minVertex === null || minDistance === Infinity) break;
    
    // Found the end vertex
    if (minVertex === end) break;
    
    // Remove from unvisited
    nodes.delete(minVertex);
    
    // Check neighbors
    const neighbors = graph[minVertex] || [];
    for (const {vertex, weight} of neighbors) {
      const distance = distances[minVertex] + (weight || 1);
      if (distance < distances[vertex]) {
        distances[vertex] = distance;
        previous[vertex] = minVertex;
      }
    }
  }
  
  // Build path
  if (previous[end] === null && start !== end) return null;
  
  const path = [];
  let current = end;
  
  // To prevent infinite loops in case of cycle in 'previous'
  const visited = new Set();
  
  while (current !== null && !visited.has(current)) {
    path.unshift(current);
    visited.add(current);
    current = previous[current];
    
    // Safety check to break if we hit an infinite loop
    if (path.length > Object.keys(graph).length) {
      break;
    }
  }
  
  return path;
}

/**
 * Find the shortest path distance between two vertices
 * @param {Object} graph - Adjacency list
 * @param {string} start - Start vertex
 * @param {string} end - End vertex
 * @return {number} Shortest path distance
 */
function findShortestPathDistance(graph, start, end) {
  const path = findShortestPath(graph, start, end);
  if (!path) return Infinity;
  
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    distance += findEdgeWeight(graph, path[i], path[i+1]);
  }
  
  return distance;
}

/**
 * Find the weight of an edge between two vertices
 * @param {Object} graph - Adjacency list
 * @param {string} source - Source vertex
 * @param {string} target - Target vertex
 * @return {number} Edge weight (defaults to 1 if not weighted)
 */
function findEdgeWeight(graph, source, target) {
  if (!graph[source]) return 1;
  
  for (const edge of graph[source]) {
    if (edge.vertex === target) {
      return edge.weight || 1;
    }
  }
  
  return 1;
}

/**
 * Extract edges from adjacency list
 * @param {Object} adjacencyList - Adjacency list representation
 * @return {Array} Array of edge objects {source, target, weight}
 */
function getEdgesFromAdjacencyList(adjacencyList) {
  const edges = [];
  const seen = new Set();
  
  for (const source in adjacencyList) {
    for (const {vertex: target, weight} of adjacencyList[source]) {
      const edgeId = [source, target].sort().join('-');
      if (!seen.has(edgeId)) {
        edges.push({source, target, weight: weight || 1});
        seen.add(edgeId);
      }
    }
  }
  
  return edges;
}

/**
 * Hierholzer's algorithm to find an Euler path/circuit
 * @param {Object} graph - Adjacency list representation of graph
 * @param {string} startVertex - Starting vertex
 * @return {Array} Euler path as array of vertices
 */
const hierholzerAlgorithm = (graph, startVertex) => {
  // Initialize result path
  const result = [];
  
  // Start with a stack containing the starting vertex
  const stack = [startVertex];
  
  while (stack.length > 0) {
    const currentVertex = stack[stack.length - 1];
    
    // If current vertex has no outgoing edges, add to result
    if (!graph[currentVertex] || graph[currentVertex].length === 0) {
      result.push(stack.pop());
    } else {
      // Take an outgoing edge
      const edge = graph[currentVertex].pop();
      stack.push(edge.vertex);
    }
  }
  
  // Reverse the result to get the correct path
  return result.reverse();
};

/**
 * Count the degree of each vertex in the graph
 * @param {Object} graph - Adjacency list representation of graph
 * @return {Object} Object mapping vertex to its degree
 */
const countDegrees = (graph) => {
  const degrees = {};
  
  // Initialize degrees to zero
  for (const vertex in graph) {
    degrees[vertex] = 0;
  }
  
  // Count edges for each vertex
  for (const vertex in graph) {
    degrees[vertex] += graph[vertex].length;
  }
  
  return degrees;
};

/**
 * Get explanation text for Euler path result
 * @param {Object} result - Result from findEulerPath
 * @return {string} Detailed explanation
 */
export const getExplanation = (result) => {
  if (!result) return 'Unable to determine if an Euler path exists.';
  
  const { hasPath, hasCircuit, explanation, path, isChinesePostman, totalWeight, duplicatedEdges } = result;
  
  // For Chinese Postman algorithm
  if (isChinesePostman) {
    let baseExplanation = `${explanation}\n\n`;
    
    if (duplicatedEdges && duplicatedEdges.length > 0) {
      baseExplanation += `The algorithm added ${duplicatedEdges.length} duplicate edges to create a valid tour. `;
    }
    
    baseExplanation += `Total weight of the tour: ${totalWeight || 'unknown'}.`;
    return baseExplanation;
  }
  
  // For standard Euler algorithm
  if (!hasPath) {
    return `${explanation}\n\nFor a graph to have an Euler path, it must have either 0 or 2 vertices with odd degree. This graph has more than 2 vertices with odd degree.`;
  }
  
  if (hasCircuit) {
    return `${explanation}\n\nSince all vertices have even degree, an Euler circuit exists. The path starts and ends at the same vertex.`;
  }
  
  return `${explanation}\n\nThe path starts and ends at different vertices with odd degree.`;
};

/**
 * Build adjacency list from array of edges
 * @param {Array} edges - Array of edge objects
 * @param {boolean} isDirected - Whether graph is directed
 * @return {Object} Adjacency list representation of graph
 */
export const buildAdjacencyList = (edges, isDirected = false) => {
  const graph = {};
  
  edges.forEach(edge => {
    const { source, target, weight } = edge;
    
    // Initialize source if not exists
    if (!graph[source]) {
      graph[source] = [];
    }
    
    // Add edge from source to target
    graph[source].push({ vertex: target, weight: weight || 1 });
    
    // For undirected graphs, add the reverse edge
    if (!isDirected) {
      if (!graph[target]) {
        graph[target] = [];
      }
      
      graph[target].push({ vertex: source, weight: weight || 1 });
    } else {
      // Ensure target exists in graph even if it has no outgoing edges
      if (!graph[target]) {
        graph[target] = [];
      }
    }
  });
  
  return graph;
};

/**
 * Storage Module
 * Handles saving and loading graphs from localStorage
 */
import { getState } from './state.js';

// Storage keys
const STORAGE_KEY = 'euler_saved_graphs';
const COUNTER_KEY = 'euler_graph_counter';

// Example graphs
const EXAMPLE_GRAPHS = [
  {
    name: 'Simple Circuit',
    edges: '[a,b],[b,c],[c,d],[d,a]',
    directed: false,
    weighted: false
  },
  {
    name: 'Simple Path',
    edges: '[a,b],[b,c],[c,d]',
    directed: false,
    weighted: false
  },
  {
    name: 'Weighted Example',
    edges: '[a,b,2],[b,c,3],[c,d,1],[d,a,4]',
    directed: false,
    weighted: true
  },
  {
    name: 'Directed Example',
    edges: '[a,b],[b,c],[c,d],[d,b]',
    directed: true,
    weighted: false
  },
  {
    name: 'K5 Complete Graph',
    edges: '[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,4],[3,5],[4,5]',
    directed: false,
    weighted: false
  },
  {
    name: 'Random Euler',
    isRandomGenerator: true, // Special flag to indicate this is a generator, not a static example
    directed: false,
    weighted: false
  }
];

/**
 * Initialize storage if needed
 */
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(COUNTER_KEY)) {
    localStorage.setItem(COUNTER_KEY, '1');
  }
};

/**
 * Get all saved graphs
 * @return {Array} Array of saved graph objects
 */
export const getSavedGraphs = () => {
  initStorage();
  
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error('Error loading saved graphs:', error);
    return [];
  }
};

/**
 * Get example graphs (not stored in localStorage)
 * @return {Array} Array of example graph objects
 */
export const getExampleGraphs = () => {
  return [...EXAMPLE_GRAPHS];
};

/**
 * Generate a random Euler graph
 * @param {number} vertices - Number of vertices
 * @param {number} edges - Number of edges
 * @param {boolean} directed - Whether the graph is directed
 * @return {Object} - Generated graph
 */
export const generateRandomEulerGraph = (vertices = 5, edges = 8) => {
  // Validation checks
  if (vertices < 3) {
    console.warn(`Cannot create valid Euler circuit with ${vertices} vertices. Using minimum of 3.`);
    vertices = 3;
  }
  
  // For an Euler circuit, all vertices must have even degree
  // Total edges must be at least equal to vertices for a connected graph
  if (edges < vertices) {
    console.warn(`Edge count too low. Setting to minimum ${vertices}.`);
    edges = vertices;
  }
  
  // Maximum edges for a simple graph is v(v-1)/2
  const maxEdges = vertices * (vertices - 1) / 2;
  if (edges > maxEdges) {
    console.warn(`Edge count too high. Setting to maximum ${maxEdges}.`);
    edges = maxEdges;
  }

  // Helper function to generate a random integer in range [min, max)
  const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  
  // Use an iterative approach to generate valid Euler circuit
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      // Track vertex degrees to ensure even degree for all vertices
      const degrees = Array(vertices).fill(0);
      // Track edges to prevent duplicates
      const edgeSet = new Set();
      
      // First, create a connected graph structure (cycle)
      const edgeList = [];
      for (let i = 0; i < vertices; i++) {
        const edge = [i, (i + 1) % vertices];
        edgeList.push(edge);
        // Update degrees
        degrees[edge[0]]++;
        degrees[edge[1]]++;
        // Add to edge set (both directions to handle undirected graph)
        edgeSet.add(`${edge[0]},${edge[1]}`);
        edgeSet.add(`${edge[1]},${edge[0]}`);
      }
      
      // Add remaining edges, ensuring even degree
      let remainingEdges = edges - vertices;
      let attemptLimit = 100; // Prevent infinite loops
      
      while (remainingEdges > 0 && attemptLimit > 0) {
        attemptLimit--;
        
        // Choose random vertices
        const v1 = randInt(0, vertices);
        const v2 = randInt(0, vertices);
        
        // Skip self-loops
        if (v1 === v2) continue;
        
        // Skip if edge already exists
        if (edgeSet.has(`${v1},${v2}`)) continue;
        
        // Add edge
        edgeList.push([v1, v2]);
        // Update degrees
        degrees[v1]++;
        degrees[v2]++;
        // Add to edge set
        edgeSet.add(`${v1},${v2}`);
        edgeSet.add(`${v2},${v1}`);
        
        remainingEdges--;
      }
      
      // Check if all vertices have even degree (Euler circuit property)
      const allEven = degrees.every(degree => degree % 2 === 0);
      
      if (!allEven) {
        // If we have odd degrees, add edges to fix them
        const oddVertices = degrees.map((degree, index) => 
          degree % 2 === 1 ? index : -1).filter(index => index !== -1);
        
        // We must have an even number of odd-degree vertices
        if (oddVertices.length % 2 !== 0) {
          // This shouldn't happen in theory, but just in case
          continue;
        }
        
        // Pair up odd-degree vertices and add edges between them
        for (let i = 0; i < oddVertices.length; i += 2) {
          if (i + 1 >= oddVertices.length) break;
          
          const v1 = oddVertices[i];
          const v2 = oddVertices[i + 1];
          
          // Skip if edge already exists
          if (edgeSet.has(`${v1},${v2}`)) continue;
          
          // Add edge
          edgeList.push([v1, v2]);
          // Update degrees
          degrees[v1]++;
          degrees[v2]++;
          // Add to edge set
          edgeSet.add(`${v1},${v2}`);
          edgeSet.add(`${v2},${v1}`);
        }
      }
      
      // Check again if all vertices have even degree
      if (!degrees.every(degree => degree % 2 === 0)) {
        continue; // Try again if we still have odd degrees
      }
      
      // Check if graph is connected
      const visited = new Set();
      const stack = [0]; // Start from vertex 0
      
      while (stack.length > 0) {
        const vertex = stack.pop();
        visited.add(vertex);
        
        // Find all neighbors
        const neighbors = new Set();
        edgeList.forEach(edge => {
          if (edge[0] === vertex) neighbors.add(edge[1]);
          if (edge[1] === vertex) neighbors.add(edge[0]);
        });
        
        // Add unvisited neighbors to stack
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        });
      }
      
      // If not all vertices are reachable, try again
      if (visited.size !== vertices) {
        continue;
      }
      
      // Format the edges as a string
      const edgeText = edgeList.map(e => `[${e[0]},${e[1]}]`).join(',');
      
      return {
        name: `Random Euler (${vertices}v, ${edgeList.length}e)`,
        edges: edgeText,
        directed: false,
        weighted: false
      };
    } catch (error) {
      console.error('Error generating random Euler graph:', error);
      // Continue to next attempt
    }
  }
  
  // If we've exhausted our attempts, return a simple guaranteed Euler circuit
  console.warn('Failed to generate complex random Euler graph, using simple cycle');
  
  // A simple cycle is always an Euler circuit
  const edgeList = [];
  for (let i = 0; i < vertices; i++) {
    edgeList.push([i, (i + 1) % vertices]);
  }
  
  // Format the edges
  const edgeText = edgeList.map(e => `[${e[0]},${e[1]}]`).join(',');
  
  return {
    name: `Euler Cycle (${vertices}v, ${vertices}e)`,
    edges: edgeText,
    directed: false, 
    weighted: false
  };
};

/**
 * Save current graph
 * @param {string} [name] - Optional name for the graph
 * @return {Object|null} Saved graph object or null if error
 */
export const saveCurrentGraph = (name = null) => {
  initStorage();
  
  try {
    // Get current graph state
    const edges = getState('graph.edges');
    const directed = getState('graph.directed');
    const weighted = getState('graph.weighted');
    
    // If no edges, don't save
    if (!edges || edges.length === 0) {
      throw new Error('No graph to save');
    }
    
    // Generate a string representation of edges
    let edgeText = '';
    if (weighted) {
      edgeText = edges.map(e => `[${e.source},${e.target},${e.weight}]`).join(',');
    } else {
      edgeText = edges.map(e => `[${e.source},${e.target}]`).join(',');
    }
    
    // Get current graphs
    const savedGraphs = getSavedGraphs();
    
    // Generate name if not provided
    let graphName = name;
    if (!graphName) {
      const counter = parseInt(localStorage.getItem(COUNTER_KEY), 10) || 1;
      graphName = `Graph ${counter}`;
      localStorage.setItem(COUNTER_KEY, (counter + 1).toString());
    }
    
    // Create graph object
    const graph = {
      id: Date.now().toString(),
      name: graphName,
      edges: edgeText,
      directed,
      weighted,
      date: new Date().toISOString()
    };
    
    // Add to saved graphs
    savedGraphs.push(graph);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGraphs));
    
    return graph;
  } catch (error) {
    console.error('Error saving graph:', error);
    return null;
  }
};

/**
 * Load a graph by ID
 * @param {string} id - Graph ID
 * @return {Object|null} Graph object or null if not found
 */
export const loadGraph = (id) => {
  try {
    const savedGraphs = getSavedGraphs();
    return savedGraphs.find(g => g.id === id) || null;
  } catch (error) {
    console.error('Error loading graph:', error);
    return null;
  }
};

/**
 * Delete a graph by ID
 * @param {string} id - Graph ID
 * @return {boolean} Success
 */
export const deleteGraph = (id) => {
  try {
    const savedGraphs = getSavedGraphs();
    const newGraphs = savedGraphs.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGraphs));
    return true;
  } catch (error) {
    console.error('Error deleting graph:', error);
    return false;
  }
};

/**
 * Duplicate a graph
 * @param {string} id - Graph ID to duplicate
 * @return {Object|null} New graph object or null if error
 */
export const duplicateGraph = (id) => {
  try {
    const savedGraphs = getSavedGraphs();
    const graph = savedGraphs.find(g => g.id === id);
    
    if (!graph) {
      throw new Error('Graph not found');
    }
    
    // Find existing copies to generate proper name
    const nameBase = graph.name;
    const copyRegex = new RegExp(`^${nameBase} copy(\\s\\d+)?$`);
    const copies = savedGraphs.filter(g => copyRegex.test(g.name));
    
    let copyName = `${nameBase} copy`;
    if (copies.length > 0) {
      copyName = `${nameBase} copy ${copies.length + 1}`;
    }
    
    // Create new graph
    const newGraph = {
      ...graph,
      id: Date.now().toString(),
      name: copyName,
      date: new Date().toISOString()
    };
    
    // Add to saved graphs
    savedGraphs.push(newGraph);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGraphs));
    
    return newGraph;
  } catch (error) {
    console.error('Error duplicating graph:', error);
    return null;
  }
}; 
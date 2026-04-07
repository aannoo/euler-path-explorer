/**
 * Graph Model
 * Core representation of graph data independent of visualization
 */

/**
 * Graph class for managing nodes and edges
 */
export class Graph {
  /**
   * Creates a new graph instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.nodes = new Map(); // Map of node id -> node data
    this.edges = new Map(); // Map of edge id -> edge data
    this.directed = options.directed || false;
    this.weighted = options.weighted || false;
    
    // Auto-incrementing ID counters
    this._nodeIdCounter = 0;
    this._edgeIdCounter = 0;
    
    // Edge lookup maps for quick adjacency checks
    this._edgeLookup = new Map(); // Map of source -> Set of targets
  }
  
  /**
   * Get a node by ID
   * @param {string} id - Node ID
   * @return {Object|null} Node data or null if not found
   */
  getNode(id) {
    return this.nodes.get(id) || null;
  }
  
  /**
   * Get all nodes
   * @return {Array} Array of node objects
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }
  
  /**
   * Add a node to the graph
   * @param {Object} nodeData - Node data
   * @return {string} Generated node ID
   */
  addNode(nodeData = {}) {
    // Generate ID if not provided
    const id = nodeData.id || `n${this._nodeIdCounter++}`;
    
    // Create normalized node object
    const node = {
      id,
      label: nodeData.label || id,
      ...nodeData
    };
    
    // Store node
    this.nodes.set(id, node);
    
    return id;
  }
  
  /**
   * Remove a node from the graph
   * @param {string} id - Node ID
   * @return {boolean} Success
   */
  removeNode(id) {
    if (!this.nodes.has(id)) return false;
    
    // Remove all edges connected to this node
    this.getAllEdges().forEach(edge => {
      if (edge.source === id || edge.target === id) {
        this.removeEdge(edge.id);
      }
    });
    
    // Remove node
    this.nodes.delete(id);
    
    return true;
  }
  
  /**
   * Get an edge by ID
   * @param {string} id - Edge ID
   * @return {Object|null} Edge data or null if not found
   */
  getEdge(id) {
    return this.edges.get(id) || null;
  }
  
  /**
   * Get all edges
   * @return {Array} Array of edge objects
   */
  getAllEdges() {
    return Array.from(this.edges.values());
  }
  
  /**
   * Add an edge to the graph
   * @param {string} source - Source node ID
   * @param {string} target - Target node ID
   * @param {Object} edgeData - Edge data
   * @return {string|null} Generated edge ID or null if nodes don't exist
   */
  addEdge(source, target, edgeData = {}) {
    // Verify nodes exist
    if (!this.nodes.has(source) || !this.nodes.has(target)) {
      // Automatically create missing nodes
      if (!this.nodes.has(source)) this.addNode({ id: source });
      if (!this.nodes.has(target)) this.addNode({ id: target });
    }
    
    // Generate ID if not provided
    const id = edgeData.id || `e${this._edgeIdCounter++}`;
    
    // Create normalized edge object
    const edge = {
      id,
      source,
      target,
      weight: this.weighted ? (edgeData.weight || 1) : 1,
      ...edgeData
    };
    
    // Store edge
    this.edges.set(id, edge);
    
    // Update edge lookup for quick adjacency checks
    if (!this._edgeLookup.has(source)) {
      this._edgeLookup.set(source, new Set());
    }
    this._edgeLookup.get(source).add(target);
    
    // For undirected graphs, add reverse lookup as well
    if (!this.directed) {
      if (!this._edgeLookup.has(target)) {
        this._edgeLookup.set(target, new Set());
      }
      this._edgeLookup.get(target).add(source);
    }
    
    return id;
  }
  
  /**
   * Remove an edge from the graph
   * @param {string} id - Edge ID
   * @return {boolean} Success
   */
  removeEdge(id) {
    const edge = this.edges.get(id);
    if (!edge) return false;
    
    // Remove from edge lookup
    if (this._edgeLookup.has(edge.source)) {
      this._edgeLookup.get(edge.source).delete(edge.target);
    }
    
    // For undirected graphs, remove reverse lookup as well
    if (!this.directed && this._edgeLookup.has(edge.target)) {
      this._edgeLookup.get(edge.target).delete(edge.source);
    }
    
    // Remove edge
    this.edges.delete(id);
    
    return true;
  }
  
  /**
   * Check if an edge exists between two nodes
   * @param {string} source - Source node ID
   * @param {string} target - Target node ID
   * @return {boolean} Whether edge exists
   */
  hasEdge(source, target) {
    if (!this._edgeLookup.has(source)) return false;
    return this._edgeLookup.get(source).has(target);
  }
  
  /**
   * Get all edges between two nodes
   * @param {string} source - Source node ID
   * @param {string} target - Target node ID
   * @return {Array} Array of edge objects
   */
  getEdgesBetween(source, target) {
    return this.getAllEdges().filter(edge => 
      edge.source === source && edge.target === target ||
      (!this.directed && edge.source === target && edge.target === source)
    );
  }
  
  /**
   * Get all adjacent nodes
   * @param {string} nodeId - Node ID
   * @return {Array} Array of adjacent node IDs
   */
  getAdjacentNodes(nodeId) {
    if (!this._edgeLookup.has(nodeId)) return [];
    return Array.from(this._edgeLookup.get(nodeId));
  }
  
  /**
   * Clear the graph
   */
  clear() {
    this.nodes.clear();
    this.edges.clear();
    this._edgeLookup.clear();
    this._nodeIdCounter = 0;
    this._edgeIdCounter = 0;
  }
  
  /**
   * Parse edge list string into graph
   * @param {string} edgeListString - Edge list string
   * @param {boolean} directed - Whether the graph is directed
   * @param {boolean} weighted - Whether the graph is weighted
   * @return {Graph} This graph instance
   */
  parseEdgeList(edgeListString, directed = false, weighted = false) {
    // Update graph properties
    this.directed = directed;
    this.weighted = weighted;
    
    // Clear existing graph
    this.clear();
    
    try {
      // Match all [...] patterns
      const edgeMatches = edgeListString.match(/\[([^\]]+)\]/g) || [];
      
      edgeMatches.forEach(match => {
        // Remove brackets and split by comma
        const parts = match.substring(1, match.length - 1).split(',').map(p => p.trim());
        
        if (parts.length < 2) return; // Skip invalid edges
        
        const source = parts[0];
        const target = parts[1];
        
        // If weighted and has third part, use as weight
        const weight = (weighted && parts.length > 2) ? parseFloat(parts[2]) : 1;
        
        // Add nodes if they don't exist
        if (!this.nodes.has(source)) this.addNode({ id: source });
        if (!this.nodes.has(target)) this.addNode({ id: target });
        
        // Add edge
        this.addEdge(source, target, { weight });
      });
      
      return this;
    } catch (error) {
      return this;
    }
  }
  
  /**
   * Convert graph to edge list string
   * @return {string} Edge list string
   */
  toEdgeList() {
    return this.getAllEdges().map(edge => {
      if (this.weighted) {
        return `[${edge.source},${edge.target},${edge.weight}]`;
      } else {
        return `[${edge.source},${edge.target}]`;
      }
    }).join(',');
  }
}

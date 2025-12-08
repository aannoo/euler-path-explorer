/**
 * Input Validation Utilities
 * Provides validation functions for graph data
 */

/**
 * Validate a vertex name
 * @param {string} name - Vertex name to validate
 * @returns {Object} - { valid: boolean, message: string }
 */
export const validateVertex = (name) => {
  // Check if empty
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Vertex name cannot be empty' };
  }
  
  // Check length
  if (name.length > 10) {
    return { valid: false, message: 'Vertex name cannot exceed 10 characters' };
  }
  
  // Check for valid characters (alphanumeric and underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    return { valid: false, message: 'Vertex name can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate a list of vertices
 * @param {Array<string>} vertices - Array of vertex names
 * @returns {Object} - { valid: boolean, message: string, invalidVertices: Array<string> }
 */
export const validateVertices = (vertices) => {
  const invalidVertices = [];
  let duplicates = [];
  
  // Check for duplicates
  const seen = new Set();
  vertices.forEach(vertex => {
    if (seen.has(vertex)) {
      duplicates.push(vertex);
    } else {
      seen.add(vertex);
    }
  });
  
  // Check each vertex
  vertices.forEach(vertex => {
    const result = validateVertex(vertex);
    if (!result.valid) {
      invalidVertices.push(vertex);
    }
  });
  
  if (duplicates.length > 0) {
    return { 
      valid: false, 
      message: `Duplicate vertices found: ${duplicates.join(', ')}`,
      invalidVertices: [...invalidVertices, ...duplicates]
    };
  }
  
  if (invalidVertices.length > 0) {
    return { 
      valid: false, 
      message: `Invalid vertex names: ${invalidVertices.join(', ')}`,
      invalidVertices
    };
  }
  
  return { valid: true, message: '', invalidVertices: [] };
};

/**
 * Validate a single edge
 * @param {string} edge - Edge string in format "A-B", "A->B", or "A<->B"
 * @param {Array<string>} validVertices - Array of valid vertex names
 * @returns {Object} - { valid: boolean, message: string, from: string, to: string, bidirectional: boolean }
 */
export const validateEdge = (edge, validVertices) => {
  // Check for proper format using regex
  // Matches patterns like "A-B", "A->B", "A<->B"
  const edgePattern = /^([a-zA-Z0-9_]+)(->|<->|-)([a-zA-Z0-9_]+)$/;
  const match = edge.match(edgePattern);
  
  if (!match) {
    return { 
      valid: false, 
      message: 'Invalid edge format. Use A-B, A->B, or A<->B', 
      from: '', 
      to: '', 
      bidirectional: false 
    };
  }
  
  const from = match[1];
  const connector = match[2];
  const to = match[3];
  const bidirectional = connector === '<->' || connector === '-';
  
  // Check for self-loops
  if (from === to) {
    return { 
      valid: false, 
      message: 'Self-loops are not allowed', 
      from, 
      to, 
      bidirectional 
    };
  }
  
  // Check if vertices exist
  if (validVertices && validVertices.length > 0) {
    if (!validVertices.includes(from)) {
      return { 
        valid: false, 
        message: `Vertex "${from}" does not exist`, 
        from, 
        to, 
        bidirectional 
      };
    }
    
    if (!validVertices.includes(to)) {
      return { 
        valid: false, 
        message: `Vertex "${to}" does not exist`, 
        from, 
        to, 
        bidirectional 
      };
    }
  }
  
  return { valid: true, message: '', from, to, bidirectional };
};

/**
 * Validate a list of edges
 * @param {Array<string>} edges - Array of edge strings
 * @param {Array<string>} validVertices - Array of valid vertex names
 * @returns {Object} - { valid: boolean, message: string, invalidEdges: Array<{edge: string, reason: string}> }
 */
export const validateEdges = (edges, validVertices) => {
  const invalidEdges = [];
  const processedEdges = new Set();
  
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i].trim();
    if (!edge) continue; // Skip empty edges
    
    const result = validateEdge(edge, validVertices);
    
    if (!result.valid) {
      invalidEdges.push({ edge, reason: result.message });
      continue;
    }
    
    // Check for duplicates
    const normalizedEdge = result.bidirectional 
      ? [result.from, result.to].sort().join('-')
      : `${result.from}->${result.to}`;
      
    if (processedEdges.has(normalizedEdge)) {
      invalidEdges.push({ edge, reason: 'Duplicate edge' });
    } else {
      processedEdges.add(normalizedEdge);
    }
  }
  
  if (invalidEdges.length > 0) {
    return { 
      valid: false, 
      message: `${invalidEdges.length} invalid edge(s) found`,
      invalidEdges 
    };
  }
  
  return { valid: true, message: '', invalidEdges: [] };
};

/**
 * Validate graph name
 * @param {string} name - Graph name to validate
 * @returns {Object} - { valid: boolean, message: string, trimmed: string }
 */
export const validateGraphName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Graph name cannot be empty', trimmed: '' };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, message: 'Graph name must be at least 3 characters', trimmed };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, message: 'Graph name cannot exceed 30 characters', trimmed };
  }
  
  // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
  if (!/^[a-zA-Z0-9 _-]+$/.test(trimmed)) {
    return { 
      valid: false, 
      message: 'Graph name can only contain letters, numbers, spaces, hyphens, and underscores', 
      trimmed 
    };
  }
  
  return { valid: true, message: '', trimmed };
};

/**
 * Format validation error messages for UI display
 * @param {Object} validationResult - Result from validation functions
 * @returns {string} - Formatted error message
 */
export const formatValidationError = (validationResult) => {
  if (validationResult.valid) return '';
  
  let message = validationResult.message;
  
  // Add details for invalid edges
  if (validationResult.invalidEdges && validationResult.invalidEdges.length > 0) {
    const details = validationResult.invalidEdges
      .map(item => `• ${item.edge}: ${item.reason}`)
      .join('\n');
    message = `${message}:\n${details}`;
  }
  
  // Add details for invalid vertices
  if (validationResult.invalidVertices && validationResult.invalidVertices.length > 0) {
    message = `${message} (${validationResult.invalidVertices.join(', ')})`;
  }
  
  return message;
}; 
/**
 * Sigma.js Constants Module
 * Shared constants used across sigma modules
 * Extracted to break circular dependencies between sigma-core and other modules
 */

// Default attributes for new nodes
export const DEFAULT_NODE_ATTRIBUTES = {
  size: 10,
  color: '#FFDD00',
  label: '',
  x: 0,
  y: 0
};

// Default attributes for new edges
export const DEFAULT_EDGE_ATTRIBUTES = {
  size: 5,
  color: '#FF5A1F',
  label: '',
  type: 'line'
};

// Selection highlight attributes
export const SELECTION_NODE_ATTRIBUTES = {
  color: '#ffdd00',
  size: 14
};

export const SELECTION_EDGE_ATTRIBUTES = {
  color: '#ffdd00',
  size: 6
};

// Path highlight attributes (for Euler path visualization)
export const PATH_HIGHLIGHT_ATTRIBUTES = {
  nodeColor: '#0ea5e9',
  nodeSize: 12,
  edgeColor: '#0ea5e9',
  edgeSize: 4
};

// Animation highlight attributes
export const ANIMATION_ATTRIBUTES = {
  activeNodeColor: '#ffdd00',
  activeNodeSize: 16,
  pathNodeColor: '#ff8f29',
  pathNodeSize: 12
};

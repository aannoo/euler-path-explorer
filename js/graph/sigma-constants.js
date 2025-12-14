/**
 * Sigma.js Constants Module
 * Shared constants used across sigma modules
 * Extracted to break circular dependencies between sigma-core and other modules
 */

// Default attributes for new nodes
export const DEFAULT_NODE_ATTRIBUTES = {
  size: 8,
  color: '#FFDD00',
  label: '',
  x: 0,
  y: 0
};

// Default attributes for new edges
export const DEFAULT_EDGE_ATTRIBUTES = {
  size: 4,
  color: '#FF5A1F',
  label: '',
  type: 'line'
};

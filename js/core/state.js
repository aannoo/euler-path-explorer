/**
 * State Management Module
 * Provides centralized application state with pub/sub pattern
 */

// Initial application state
const state = {
  graph: {
    directed: false,
    weighted: false,
    edges: []
  },
  ui: {
    sidebarExpanded: true,
    activeTab: 'input',
    explanationVisible: false,
    editorMode: 'text'
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
};

// Store listeners by path
const listeners = new Map();

/**
 * Get state from a specific path
 * @param {string} [path] - Dot notation path (e.g., 'graph.directed')
 * @return {any} State value (returns a clone to prevent direct mutation)
 */
export const getState = (path) => {
  // Get appropriate part of state
  const value = path
    ? path.split('.').reduce((obj, key) => obj?.[key], state)
    : state;
  
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return value;
  }
  
  // Return a clone to prevent direct mutation
  return JSON.parse(JSON.stringify(value));
};

/**
 * Set state at a specific path
 * @param {string} path - Dot notation path (e.g., 'graph.directed')
 * @param {any} value - New value to set
 */
export const setState = (path, value) => {
  if (!path) return;
  
  const parts = path.split('.');
  const lastKey = parts.pop();
  
  // Add safeguard against undefined paths
  let target = state;
  if (parts.length) {
    // Create nested objects if they don't exist
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (target[key] === undefined || target[key] === null) {
        target[key] = {};
      }
      target = target[key];
    }
  }
  
  // Set value
  target[lastKey] = value;
  
  // Notify listeners
  notifyListeners(path);
};

/**
 * Subscribe to state changes at a specific path
 * @param {string} path - Dot notation path (e.g., 'graph.directed')
 * @param {Function} callback - Function to call when state changes
 * @return {Function} Unsubscribe function
 */
export const subscribe = (path, callback) => {
  if (!listeners.has(path)) {
    listeners.set(path, new Set());
  }
  
  listeners.get(path).add(callback);
  
  // Return unsubscribe function
  return () => {
    const pathListeners = listeners.get(path);
    if (pathListeners) {
      pathListeners.delete(callback);
      if (pathListeners.size === 0) {
        listeners.delete(path);
      }
    }
  };
};

/**
 * Notify all listeners of a state change
 * @param {string} changedPath - Path that changed
 */
const notifyListeners = (changedPath) => {
  // Call exact path listeners
  if (listeners.has(changedPath)) {
    listeners.get(changedPath).forEach(callback => {
      callback(getState(changedPath));
    });
  }
  
  // Call parent path listeners
  const parts = changedPath.split('.');
  while (parts.length > 0) {
    parts.pop();
    const parentPath = parts.join('.');
    if (listeners.has(parentPath)) {
      listeners.get(parentPath).forEach(callback => {
        callback(getState(parentPath));
      });
    }
  }
}; 
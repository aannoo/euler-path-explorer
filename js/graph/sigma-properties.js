/**
 * Sigma.js Properties Module
 * Node and edge property management
 * Split from sigma-adapter.js for better maintainability
 */

import { setState, getState } from '../core/state.js';
import { DEFAULT_NODE_ATTRIBUTES, DEFAULT_EDGE_ATTRIBUTES } from './sigma-constants.js';

// Editable property definitions
export const EDITABLE_NODE_PROPERTIES = ['label', 'color', 'size'];
export const EDITABLE_EDGE_PROPERTIES = ['label', 'color', 'size', 'weight'];

// Reference to graph and sigma instances
let graphInstance = null;
let sigmaInstance = null;

// Selection references
let selectedNodes = new Set();
let selectedEdges = new Set();

/**
 * Set references to graph and sigma instances
 * @param {Graph} graph - Graphology instance
 * @param {Sigma} sigma - Sigma instance
 */
export const setInstances = (graph, sigma) => {
  graphInstance = graph;
  sigmaInstance = sigma;
};

/**
 * Update selection references
 * @param {Set} nodes - Selected nodes
 * @param {Set} edges - Selected edges
 */
export const updateSelectionRefs = (nodes, edges) => {
  selectedNodes = nodes instanceof Set ? nodes : new Set(nodes);
  selectedEdges = edges instanceof Set ? edges : new Set(edges);
};

/**
 * Initialize property editing interface
 * @public
 */
export function initPropertyEditing() {
  // Listen to state changes for property editing
  const { subscribe } = require('../core/state.js');

  subscribe('ui.propertyEditing', (propertyState) => {
    if (!propertyState || !propertyState.active) return;
    // Property editing UI is handled by the UI layer
  });
}

/**
 * Get properties of an element
 * @param {string} id - Element ID
 * @param {string} type - 'node' or 'edge'
 * @returns {Object|null} Properties object
 */
export const getElementProperties = (id, type) => {
  if (!graphInstance || !id) return null;

  try {
    if (type === 'node' && graphInstance.hasNode(id)) {
      return graphInstance.getNodeAttributes(id);
    } else if (type === 'edge' && graphInstance.hasEdge(id)) {
      return graphInstance.getEdgeAttributes(id);
    }
  } catch (error) {
    console.error(`Error getting ${type} properties for ${id}:`, error);
  }

  return null;
};

/**
 * Set properties of an element
 * @param {string} id - Element ID
 * @param {Object} properties - Properties to set
 * @param {string} type - 'node' or 'edge'
 * @returns {boolean} Success
 */
export const setElementProperties = (id, properties, type) => {
  if (!graphInstance || !id || !properties) return false;

  try {
    if (type === 'node' && graphInstance.hasNode(id)) {
      Object.entries(properties).forEach(([key, value]) => {
        if (EDITABLE_NODE_PROPERTIES.includes(key) || key === 'x' || key === 'y') {
          graphInstance.setNodeAttribute(id, key, value);
        }
      });

      if (sigmaInstance) sigmaInstance.refresh();
      return true;
    } else if (type === 'edge' && graphInstance.hasEdge(id)) {
      Object.entries(properties).forEach(([key, value]) => {
        if (EDITABLE_EDGE_PROPERTIES.includes(key)) {
          graphInstance.setEdgeAttribute(id, key, value);
        }
      });

      if (sigmaInstance) sigmaInstance.refresh();
      return true;
    }
  } catch (error) {
    console.error(`Error setting ${type} properties for ${id}:`, error);
  }

  return false;
};

/**
 * Set properties on multiple elements at once
 * @param {Array} ids - Element IDs
 * @param {Object} properties - Properties to set
 * @param {string} type - 'node' or 'edge'
 * @returns {boolean} Success
 */
export const setBulkElementProperties = (ids, properties, type) => {
  if (!graphInstance || !ids || !properties) return false;

  graphInstance.emit('startBatch');

  let success = true;
  ids.forEach(id => {
    if (!setElementProperties(id, properties, type)) {
      success = false;
    }
  });

  graphInstance.emit('endBatch');

  if (sigmaInstance) sigmaInstance.refresh();

  return success;
};

// Convenience aliases for node operations
export const getNodeProperties = (nodeId) => getElementProperties(nodeId, 'node');
export const setNodeProperties = (nodeId, properties) => setElementProperties(nodeId, properties, 'node');
export const setBulkNodeProperties = (nodeIds, properties) => setBulkElementProperties(nodeIds, properties, 'node');

// Convenience aliases for edge operations
export const getEdgeProperties = (edgeId) => getElementProperties(edgeId, 'edge');
export const setEdgeProperties = (edgeId, properties) => setElementProperties(edgeId, properties, 'edge');
export const setBulkEdgeProperties = (edgeIds, properties) => setBulkElementProperties(edgeIds, properties, 'edge');

// Selection-based convenience methods
export const setSelectedNodeProperties = (properties) => {
  return setBulkElementProperties(Array.from(selectedNodes), properties, 'node');
};

export const setSelectedEdgeProperties = (properties) => {
  return setBulkElementProperties(Array.from(selectedEdges), properties, 'edge');
};

/**
 * Get list of editable node properties
 * @returns {Array} Property names
 */
export const getEditableNodeProperties = () => {
  return [...EDITABLE_NODE_PROPERTIES];
};

/**
 * Get list of editable edge properties
 * @returns {Array} Property names
 */
export const getEditableEdgeProperties = () => {
  return [...EDITABLE_EDGE_PROPERTIES];
};

/**
 * Update node label with sync to edge list
 * @param {string} nodeId - Node ID
 * @param {string} newLabel - New label
 * @returns {boolean} Success
 */
export const updateNodeLabel = (nodeId, newLabel) => {
  if (!graphInstance || !graphInstance.hasNode(nodeId)) return false;

  const oldLabel = graphInstance.getNodeAttribute(nodeId, 'label') || nodeId;
  graphInstance.setNodeAttribute(nodeId, 'label', newLabel);

  if (sigmaInstance) sigmaInstance.refresh();

  // Trigger edge list update
  if (typeof window !== 'undefined' && window.updateEdgeListDisplay) {
    window.updateEdgeListDisplay();
  }

  return true;
};

/**
 * Update edge weight
 * @param {string} edgeId - Edge ID
 * @param {number} weight - New weight
 * @returns {boolean} Success
 */
export const updateEdgeWeight = (edgeId, weight) => {
  if (!graphInstance || !graphInstance.hasEdge(edgeId)) return false;

  const numWeight = parseFloat(weight);
  if (isNaN(numWeight)) return false;

  graphInstance.setEdgeAttribute(edgeId, 'weight', numWeight);

  // Update label if weighted mode
  const isWeighted = getState('graph.weighted');
  if (isWeighted) {
    graphInstance.setEdgeAttribute(edgeId, 'label', String(numWeight));
  }

  if (sigmaInstance) sigmaInstance.refresh();

  return true;
};

/**
 * Set weight display on all edges
 * @param {boolean} showWeights - Whether to show weights as labels
 */
export const setWeightDisplay = (showWeights) => {
  if (!graphInstance) return;

  graphInstance.emit('startBatch');

  graphInstance.forEachEdge((edgeId, attributes) => {
    if (showWeights) {
      const weight = attributes.weight || 1;
      graphInstance.setEdgeAttribute(edgeId, 'label', String(weight));
    } else {
      graphInstance.removeEdgeAttribute(edgeId, 'label');
    }
  });

  graphInstance.emit('endBatch');

  if (sigmaInstance) sigmaInstance.refresh();
};

/**
 * Apply a color to all nodes
 * @param {string} color - Hex color
 */
export const setAllNodesColor = (color) => {
  if (!graphInstance) return;

  graphInstance.emit('startBatch');

  graphInstance.forEachNode((nodeId) => {
    if (!graphInstance.getNodeAttribute(nodeId, 'selected')) {
      graphInstance.setNodeAttribute(nodeId, 'color', color);
    }
  });

  graphInstance.emit('endBatch');

  if (sigmaInstance) sigmaInstance.refresh();
};

/**
 * Apply a color to all edges
 * @param {string} color - Hex color
 */
export const setAllEdgesColor = (color) => {
  if (!graphInstance) return;

  graphInstance.emit('startBatch');

  graphInstance.forEachEdge((edgeId) => {
    if (!graphInstance.getEdgeAttribute(edgeId, 'selected')) {
      graphInstance.setEdgeAttribute(edgeId, 'color', color);
    }
  });

  graphInstance.emit('endBatch');

  if (sigmaInstance) sigmaInstance.refresh();
};

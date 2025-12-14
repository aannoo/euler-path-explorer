/**
 * Sigma.js Selection Module
 * Node and edge selection, deletion, and visual feedback
 * Split from sigma-adapter.js for better maintainability
 */

import { setState, getState } from '../core/state.js';
import { DEFAULT_NODE_ATTRIBUTES, DEFAULT_EDGE_ATTRIBUTES } from './sigma-constants.js';
import { EDITABLE_NODE_PROPERTIES, EDITABLE_EDGE_PROPERTIES } from './sigma-properties.js';

// Selection state (module-scoped)
let selectedNodes = new Set();
let selectedEdges = new Set();

// Reference to graph and sigma instances
let graphInstance = null;
let sigmaInstance = null;

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
 * Set up selection tracking
 * @param {Graph} graph - Graphology instance
 * @param {Sigma} sigma - Sigma instance
 */
export function setupSelectionTracking(graph, sigma) {
  graphInstance = graph;
  sigmaInstance = sigma;

  selectedNodes.clear();
  selectedEdges.clear();

  setState('ui.selectedNodes', []);
  setState('ui.selectedEdges', []);
  setState('ui.propertyEditing', {
    active: false,
    selectedNodes: [],
    selectedEdges: [],
    editableNodeProperties: EDITABLE_NODE_PROPERTIES,
    editableEdgeProperties: EDITABLE_EDGE_PROPERTIES
  });

  // Set up click handlers
  setupClickHandlers();
}

/**
 * Set up click handlers for selection
 * @private
 */
function setupClickHandlers() {
  if (!sigmaInstance || !graphInstance) return;

  // Node click handler
  sigmaInstance.on("clickNode", (e) => {
    const nodeId = e.node;
    const editorMode = getState('ui.editorMode');

    if (editorMode !== 'visual') return;

    const isMultiSelect = (e.original && (e.original.ctrlKey || e.original.metaKey)) ||
                          (e.event && (e.event.ctrlKey || e.event.metaKey)) ||
                          (e.ctrlKey || e.metaKey);

    // Edge creation mode: if one node selected, create edge to clicked node
    if (!isMultiSelect && selectedNodes.size === 1 && !selectedNodes.has(nodeId)) {
      const firstNodeId = Array.from(selectedNodes)[0];

      try {
        graphInstance.addEdge(firstNodeId, nodeId, {
          size: DEFAULT_EDGE_ATTRIBUTES.size,
          color: DEFAULT_EDGE_ATTRIBUTES.color
        });

        clearSelection();
        setState('ui.selectedNodes', []);
        setState('ui.selectedEdges', []);
        sigmaInstance.refresh();

        // Sync to text input
        syncEdgeListToInput();
      } catch (error) {
        console.error('Error creating edge:', error);
      }

      e.preventSigmaDefault();
      return;
    }

    // Handle selection
    if (isMultiSelect) {
      toggleNodeSelection(nodeId);
    } else {
      clearSelection();
      selectNode(nodeId);
    }

    notifySelectionChange();
    e.preventSigmaDefault();
  });

  // Edge click handler
  sigmaInstance.on("clickEdge", (e) => {
    const edgeId = e.edge;
    const editorMode = getState('ui.editorMode');

    if (editorMode !== 'visual') return;

    const isMultiSelect = (e.original && (e.original.ctrlKey || e.original.metaKey)) ||
                          (e.event && (e.event.ctrlKey || e.event.metaKey)) ||
                          (e.ctrlKey || e.metaKey);

    if (isMultiSelect) {
      toggleEdgeSelection(edgeId);
    } else {
      clearSelection();
      selectEdge(edgeId);
    }

    notifySelectionChange();
    e.preventSigmaDefault();
  });

  // Stage click to clear selection
  sigmaInstance.on("clickStage", (e) => {
    const isMultiSelect = (e.original && (e.original.ctrlKey || e.original.metaKey)) ||
                          (e.event && (e.event.ctrlKey || e.event.metaKey)) ||
                          (e.ctrlKey || e.metaKey);

    if (!isMultiSelect) {
      clearSelection();
      notifySelectionChange();
    }
  });
}

/**
 * Select a node
 * @param {string} nodeId - Node ID
 */
function selectNode(nodeId) {
  if (!graphInstance.hasNode(nodeId)) return;

  selectedNodes.add(nodeId);
  graphInstance.setNodeAttribute(nodeId, "selected", true);
  graphInstance.setNodeAttribute(nodeId, "color", "#ffdd00");
  graphInstance.setNodeAttribute(nodeId, "size", 12);
  graphInstance.setNodeAttribute(nodeId, "zIndex", 10);
}

/**
 * Toggle node selection
 * @param {string} nodeId - Node ID
 */
function toggleNodeSelection(nodeId) {
  if (selectedNodes.has(nodeId)) {
    selectedNodes.delete(nodeId);
    if (graphInstance.hasNode(nodeId)) {
      graphInstance.removeNodeAttribute(nodeId, "selected");
      graphInstance.setNodeAttribute(nodeId, "color", DEFAULT_NODE_ATTRIBUTES.color);
      graphInstance.setNodeAttribute(nodeId, "size", DEFAULT_NODE_ATTRIBUTES.size);
    }
  } else {
    selectNode(nodeId);
  }
}

/**
 * Select an edge
 * @param {string} edgeId - Edge ID
 */
function selectEdge(edgeId) {
  if (!graphInstance.hasEdge(edgeId)) return;

  selectedEdges.add(edgeId);
  graphInstance.setEdgeAttribute(edgeId, "selected", true);
  graphInstance.setEdgeAttribute(edgeId, "color", "#ffdd00");
  graphInstance.setEdgeAttribute(edgeId, "size", 4);
}

/**
 * Toggle edge selection
 * @param {string} edgeId - Edge ID
 */
function toggleEdgeSelection(edgeId) {
  if (selectedEdges.has(edgeId)) {
    selectedEdges.delete(edgeId);
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.removeEdgeAttribute(edgeId, "selected");
      graphInstance.setEdgeAttribute(edgeId, "color", DEFAULT_EDGE_ATTRIBUTES.color);
      graphInstance.setEdgeAttribute(edgeId, "size", DEFAULT_EDGE_ATTRIBUTES.size);
    }
  } else {
    selectEdge(edgeId);
  }
}

/**
 * Clear all selections
 * @public
 */
export function clearSelection() {
  if (!graphInstance) return;

  graphInstance.emit('startBatch');

  selectedNodes.forEach(nodeId => {
    if (graphInstance.hasNode(nodeId)) {
      graphInstance.removeNodeAttribute(nodeId, "selected");
      graphInstance.setNodeAttribute(nodeId, "color", DEFAULT_NODE_ATTRIBUTES.color);
      graphInstance.setNodeAttribute(nodeId, "size", DEFAULT_NODE_ATTRIBUTES.size);
      graphInstance.removeNodeAttribute(nodeId, "zIndex");
    }
  });

  selectedEdges.forEach(edgeId => {
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.removeEdgeAttribute(edgeId, "selected");
      graphInstance.setEdgeAttribute(edgeId, "color", DEFAULT_EDGE_ATTRIBUTES.color);
      graphInstance.setEdgeAttribute(edgeId, "size", DEFAULT_EDGE_ATTRIBUTES.size);
    }
  });

  graphInstance.emit('endBatch');

  selectedNodes.clear();
  selectedEdges.clear();
}

/**
 * Notify state of selection change
 * @private
 */
function notifySelectionChange() {
  setState('ui.selectedNodes', Array.from(selectedNodes));
  setState('ui.selectedEdges', Array.from(selectedEdges));
  setState('ui.propertyEditing', {
    active: selectedNodes.size > 0 || selectedEdges.size > 0,
    selectedNodes: Array.from(selectedNodes),
    selectedEdges: Array.from(selectedEdges),
    editableNodeProperties: EDITABLE_NODE_PROPERTIES,
    editableEdgeProperties: EDITABLE_EDGE_PROPERTIES
  });
}

/**
 * Delete selected nodes and edges
 * @public
 */
export function deleteSelectedElements() {
  if (!graphInstance) return;

  graphInstance.emit('startBatch');

  selectedEdges.forEach(edgeId => {
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.dropEdge(edgeId);
    }
  });

  selectedNodes.forEach(nodeId => {
    if (graphInstance.hasNode(nodeId)) {
      graphInstance.dropNode(nodeId);
    }
  });

  graphInstance.emit('endBatch');

  selectedNodes.clear();
  selectedEdges.clear();

  setState('ui.selectedNodes', []);
  setState('ui.selectedEdges', []);

  if (sigmaInstance) {
    sigmaInstance.refresh();
  }

  syncEdgeListToInput();
}

/**
 * Delete a node by ID
 * @param {string} nodeId - Node ID
 * @returns {boolean} Success
 */
export const deleteNode = (nodeId) => {
  if (!graphInstance || !nodeId) return false;

  if (graphInstance.hasNode(nodeId)) {
    graphInstance.dropNode(nodeId);

    if (selectedNodes.has(nodeId)) {
      selectedNodes.delete(nodeId);
      setState('ui.selectedNodes', Array.from(selectedNodes));
    }

    if (sigmaInstance) {
      sigmaInstance.refresh();
    }

    return true;
  }

  return false;
};

/**
 * Delete an edge by ID
 * @param {string} edgeId - Edge ID
 * @returns {boolean} Success
 */
export const deleteEdge = (edgeId) => {
  if (!graphInstance || !edgeId) return false;

  if (graphInstance.hasEdge(edgeId)) {
    graphInstance.dropEdge(edgeId);

    if (selectedEdges.has(edgeId)) {
      selectedEdges.delete(edgeId);
      setState('ui.selectedEdges', Array.from(selectedEdges));
    }

    if (sigmaInstance) {
      sigmaInstance.refresh();
    }

    return true;
  }

  return false;
};

/**
 * Delete edge by source and target nodes
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @returns {boolean} Success
 */
export const deleteEdgeByNodes = (source, target) => {
  if (!graphInstance || !source || !target) return false;

  try {
    let edgeId = null;

    try {
      edgeId = graphInstance.edge(source, target);
    } catch (e) {
      try {
        edgeId = graphInstance.edge(target, source);
      } catch (e2) {
        return false;
      }
    }

    if (edgeId) {
      return deleteEdge(edgeId);
    }
  } catch (error) {
    console.error(`Error deleting edge between ${source} and ${target}:`, error);
  }

  return false;
};

/**
 * Get currently selected nodes
 * @returns {Array} Selected node IDs
 */
export const getSelectedNodes = () => Array.from(selectedNodes);

/**
 * Get currently selected edges
 * @returns {Array} Selected edge IDs
 */
export const getSelectedEdges = () => Array.from(selectedEdges);

/**
 * Update selection state
 * @param {Set|Array} nodeSet - Selected nodes
 * @param {Set|Array} edgeSet - Selected edges
 */
export function updateSelectionState(nodeSet, edgeSet) {
  const nodes = nodeSet instanceof Set ? nodeSet : new Set(nodeSet);
  const edges = edgeSet instanceof Set ? edgeSet : new Set(edgeSet);

  selectedNodes = nodes;
  selectedEdges = edges;

  notifySelectionChange();
  updateSelectionVisuals();
}

/**
 * Update visual styling of selected elements
 * @private
 */
function updateSelectionVisuals() {
  if (!graphInstance) return;

  graphInstance.emit('startBatch');

  graphInstance.forEachNode(node => {
    if (graphInstance.hasNodeAttribute(node, 'originalColor')) return;

    if (!selectedNodes.has(node)) {
      graphInstance.setNodeAttribute(node, 'color', DEFAULT_NODE_ATTRIBUTES.color);
      graphInstance.setNodeAttribute(node, 'size', DEFAULT_NODE_ATTRIBUTES.size);
      if (graphInstance.hasNodeAttribute(node, 'zIndex')) {
        graphInstance.removeNodeAttribute(node, 'zIndex');
      }
    }
  });

  graphInstance.forEachEdge(edge => {
    if (!selectedEdges.has(edge)) {
      if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {
        graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
        graphInstance.setEdgeAttribute(edge, 'size', 6);
      } else {
        graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
        graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);
      }
    }
  });

  selectedNodes.forEach(nodeId => {
    if (graphInstance.hasNode(nodeId) && !graphInstance.hasNodeAttribute(nodeId, 'originalColor')) {
      graphInstance.setNodeAttribute(nodeId, 'color', '#ffdd00');
      graphInstance.setNodeAttribute(nodeId, 'size', 12);
      graphInstance.setNodeAttribute(nodeId, 'zIndex', 10);
    }
  });

  selectedEdges.forEach(edgeId => {
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.setEdgeAttribute(edgeId, 'color', '#ffdd00');
      graphInstance.setEdgeAttribute(edgeId, 'size', 4);
    }
  });

  graphInstance.emit('endBatch');

  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
}

/**
 * Sync graph edges back to text input
 * @private
 */
function syncEdgeListToInput() {
  const edgeInput = document.querySelector('#edges');
  if (!edgeInput || !graphInstance) return;

  const edges = [];
  graphInstance.forEachEdge((edge, attributes, source, target) => {
    const sourceLabel = graphInstance.getNodeAttribute(source, 'label') || source;
    const targetLabel = graphInstance.getNodeAttribute(target, 'label') || target;
    edges.push({
      source: sourceLabel,
      target: targetLabel,
      weight: attributes.weight || 1
    });
  });

  const isWeighted = getState('graph.weighted');

  let edgeStr = '';
  if (isWeighted) {
    edgeStr = edges.map(e => `[${e.source},${e.target},${e.weight}]`).join(',');
  } else {
    edgeStr = edges.map(e => `[${e.source},${e.target}]`).join(',');
  }

  edgeInput.value = edgeStr;

  if (typeof window !== 'undefined' && window.updateEdgeListDisplay) {
    window.updateEdgeListDisplay();
  }
}

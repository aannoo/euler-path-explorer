/**
 * Sigma Adapter - Barrel File
 * Re-exports all functions from modularized sigma files
 * Maintains backward compatibility with existing imports
 *
 * Migration from sigma-adapter.js (2,219 lines) to modular structure:
 * - sigma-core.js (~300 lines) - Core initialization and lifecycle
 * - sigma-layouts.js (~350 lines) - Layout algorithms and animations
 * - sigma-selection.js (~350 lines) - Selection management
 * - sigma-properties.js (~250 lines) - Property management
 * - sigma-rendering.js (~250 lines) - Graph conversion and rendering
 */

// Core module exports
export {
  DEFAULT_NODE_ATTRIBUTES,
  DEFAULT_EDGE_ATTRIBUTES,
  initializeSigma,
  getSigma,
  getGraph,
  getContainer,
  destroySigma,
  enforceCameraBoundaries
} from './sigma-core.js';

// Layout module exports
export {
  initForceLayout,
  getForceLayout,
  pauseForceLayout,
  resumeForceLayout,
  destroyForceLayout,
  applyLayout,
  setDirected,
  highlightPath,
  animatePath,
  getCurrentAnimation,
  cancelAnimation
} from './sigma-layouts.js';

// Selection module exports
export {
  setupSelectionTracking,
  clearSelection,
  deleteSelectedElements,
  deleteNode,
  deleteEdge,
  deleteEdgeByNodes,
  getSelectedNodes,
  getSelectedEdges,
  updateSelectionState
} from './sigma-selection.js';

// Properties module exports
export {
  EDITABLE_NODE_PROPERTIES,
  EDITABLE_EDGE_PROPERTIES,
  initPropertyEditing,
  getElementProperties,
  setElementProperties,
  setBulkElementProperties,
  getNodeProperties,
  setNodeProperties,
  setBulkNodeProperties,
  getEdgeProperties,
  setEdgeProperties,
  setBulkEdgeProperties,
  setSelectedNodeProperties,
  setSelectedEdgeProperties,
  getEditableNodeProperties,
  getEditableEdgeProperties,
  updateNodeLabel,
  updateEdgeWeight,
  setWeightDisplay,
  setAllNodesColor,
  setAllEdgesColor
} from './sigma-properties.js';

// Rendering module exports
export {
  convertToGraphology,
  renderGraph,
  exportImage,
  exportJSON,
  importJSON,
  getGraphStats
} from './sigma-rendering.js';

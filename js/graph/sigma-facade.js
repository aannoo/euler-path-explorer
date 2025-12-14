/**
 * Sigma Facade
 * Provides a cleaner interface to sigma-adapter.js by grouping related functions.
 * Reduces coupling between sigma-controller.js and sigma-adapter.js.
 */

import {
  // Lifecycle
  initializeSigma,
  destroySigma,

  // Instance access
  getSigma,
  getGraph,

  // Rendering
  renderGraph,
  setDirected,

  // Layout
  applyLayout,
  initForceLayout,
  getForceLayout,
  pauseForceLayout,
  resumeForceLayout,

  // Selection
  getSelectedNodes,
  getSelectedEdges,
  deleteSelectedElements,

  // Deletion
  deleteNode,
  deleteEdge,

  // Properties
  setBulkNodeProperties,
  setBulkEdgeProperties,

  // Path/Animation
  highlightPath,
  animatePath,

  // Export
  exportImage,

  // Camera
  enforceCameraBoundaries
} from './sigma-adapter.js';

/**
 * Core lifecycle and instance management
 */
export const SigmaCore = {
  initialize: initializeSigma,
  destroy: destroySigma,
  getInstance: getSigma,
  getGraph: getGraph
};

/**
 * Rendering and layout operations
 */
export const SigmaRenderer = {
  render: renderGraph,
  setDirected: setDirected,
  applyLayout: applyLayout,
  enforceCameraBoundaries: enforceCameraBoundaries
};

/**
 * Force layout management
 */
export const SigmaLayout = {
  init: initForceLayout,
  get: getForceLayout,
  pause: pauseForceLayout,
  resume: resumeForceLayout
};

/**
 * Selection and deletion operations
 */
export const SigmaSelection = {
  getNodes: getSelectedNodes,
  getEdges: getSelectedEdges,
  deleteSelected: deleteSelectedElements,
  deleteNode: deleteNode,
  deleteEdge: deleteEdge
};

/**
 * Property management for nodes and edges
 */
export const SigmaProperties = {
  setBulkNodeProps: setBulkNodeProperties,
  setBulkEdgeProps: setBulkEdgeProperties
};

/**
 * Path highlighting and animation
 */
export const SigmaAnimation = {
  highlightPath: highlightPath,
  animatePath: animatePath
};

/**
 * Export functionality
 */
export const SigmaExport = {
  exportImage: exportImage
};

// Also export individual functions for backward compatibility
// This allows gradual migration
export {
  initializeSigma,
  destroySigma,
  getSigma,
  getGraph,
  renderGraph,
  setDirected,
  applyLayout,
  initForceLayout,
  getForceLayout,
  pauseForceLayout,
  resumeForceLayout,
  getSelectedNodes,
  getSelectedEdges,
  deleteSelectedElements,
  deleteNode,
  deleteEdge,
  setBulkNodeProperties,
  setBulkEdgeProperties,
  highlightPath,
  animatePath,
  exportImage,
  enforceCameraBoundaries
};

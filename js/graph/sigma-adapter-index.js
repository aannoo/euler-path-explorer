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

/**
 * Initialize window globals for backward compatibility
 * This maintains compatibility with existing code that uses window.SigmaAdapter
 */
export function initializeGlobals() {
  if (typeof window === 'undefined') return;

  // Import all modules
  Promise.all([
    import('./sigma-core.js'),
    import('./sigma-layouts.js'),
    import('./sigma-selection.js'),
    import('./sigma-properties.js'),
    import('./sigma-rendering.js')
  ]).then(([core, layouts, selection, properties, rendering]) => {
    window.SigmaAdapter = {
      // Core
      initializeSigma: core.initializeSigma,
      getSigma: core.getSigma,
      getGraph: core.getGraph,
      destroySigma: core.destroySigma,
      enforceCameraBoundaries: core.enforceCameraBoundaries,

      // Layouts
      initForceLayout: layouts.initForceLayout,
      getForceLayout: layouts.getForceLayout,
      pauseForceLayout: layouts.pauseForceLayout,
      resumeForceLayout: layouts.resumeForceLayout,
      applyLayout: layouts.applyLayout,
      setDirected: layouts.setDirected,
      highlightPath: layouts.highlightPath,
      animatePath: layouts.animatePath,

      // Selection
      deleteSelectedElements: selection.deleteSelectedElements,
      deleteNode: selection.deleteNode,
      deleteEdge: selection.deleteEdge,
      deleteEdgeByNodes: selection.deleteEdgeByNodes,
      getSelectedNodes: selection.getSelectedNodes,
      getSelectedEdges: selection.getSelectedEdges,
      updateSelectionState: selection.updateSelectionState,

      // Properties
      getElementProperties: properties.getElementProperties,
      setElementProperties: properties.setElementProperties,
      setBulkElementProperties: properties.setBulkElementProperties,
      getNodeProperties: properties.getNodeProperties,
      getEdgeProperties: properties.getEdgeProperties,
      setNodeProperties: properties.setNodeProperties,
      setEdgeProperties: properties.setEdgeProperties,
      setBulkNodeProperties: properties.setBulkNodeProperties,
      setBulkEdgeProperties: properties.setBulkEdgeProperties,
      setSelectedNodeProperties: properties.setSelectedNodeProperties,
      setSelectedEdgeProperties: properties.setSelectedEdgeProperties,
      getEditableNodeProperties: properties.getEditableNodeProperties,
      getEditableEdgeProperties: properties.getEditableEdgeProperties,

      // Rendering
      convertToGraphology: rendering.convertToGraphology,
      renderGraph: rendering.renderGraph,
      exportImage: rendering.exportImage,
      exportJSON: rendering.exportJSON,
      importJSON: rendering.importJSON,
      getGraphStats: rendering.getGraphStats
    };

    console.log('SigmaAdapter globals initialized (modular)');
  });
}

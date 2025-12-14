/**
 * Sigma.js Core Module
 * Core initialization, rendering, and lifecycle management
 * Split from sigma-adapter.js for better maintainability
 */

import { Sigma } from 'sigma';
import Graph from 'graphology';
import { setState, getState } from '../core/state.js';
import { initForceLayout, pauseForceLayout, resumeForceLayout, getForceLayout } from './sigma-layouts.js';
import { setupSelectionTracking, clearSelection, getSelectedNodes, getSelectedEdges } from './sigma-selection.js';
import { initPropertyEditing, EDITABLE_NODE_PROPERTIES, EDITABLE_EDGE_PROPERTIES } from './sigma-properties.js';

// Import and re-export constants from sigma-constants.js (breaks circular dependency)
export { DEFAULT_NODE_ATTRIBUTES, DEFAULT_EDGE_ATTRIBUTES } from './sigma-constants.js';

// Instance references (module-scoped)
let sigmaInstance = null;
let graphInstance = null;
let containerElement = null;
let registeredIntervals = [];
let globalEventListenersAdded = false;

// Global keydown handler for deletion
const handleKeyDown = function(e) {
  if (!sigmaInstance || !graphInstance) return;

  if (e.key === "Delete" || e.key === "Backspace") {
    const activeElement = document.activeElement;
    const isInput = activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.isContentEditable;

    if (!isInput) {
      // Import dynamically to avoid circular dependency
      import('./sigma-selection.js').then(({ deleteSelectedElements }) => {
        deleteSelectedElements();
      });
    }
  }
};

/**
 * Initialize Sigma.js in container
 * @param {string|Element} container - Container element or selector
 * @param {Object} [options] - Sigma.js options
 * @return {Sigma} Sigma instance
 */
export const initializeSigma = (container, options = {}) => {
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
  } else {
    containerElement = container;
  }

  if (!containerElement) {
    console.error('Sigma container not found');
    return null;
  }

  graphInstance = new Graph();

  const defaultOptions = {
    allowInvalidContainer: true,
    labelRenderedSizeThreshold: 10,
    labelFont: 'Arial',
    labelSize: 14,
    labelWeight: 'bold',
    defaultNodeColor: '#ff5a1f',
    defaultEdgeColor: '#1E293B',
    defaultEdgeType: 'line',
    renderEdgeLabels: true,
    edgeLabelSize: 12,
    ...options
  };

  try {
    sigmaInstance = new Sigma(graphInstance, containerElement, defaultOptions);

    if (!globalEventListenersAdded) {
      document.addEventListener('keydown', handleKeyDown);
      globalEventListenersAdded = true;
    }

    setupSigmaEnvironment();

    const enableForceLayout = options.enableForceLayout !== false;
    if (enableForceLayout) {
      initForceLayout(graphInstance);
    }

    addResetButton();
    setupGraphControlListeners();

    return sigmaInstance;
  } catch (error) {
    console.error('Error initializing Sigma:', error);
    return null;
  }
};

/**
 * Set up Sigma environment with core functionality
 * @private
 */
function setupSigmaEnvironment() {
  setupSelectionTracking(graphInstance, sigmaInstance);

  if (sigmaInstance.getCamera) {
    const camera = sigmaInstance.getCamera();
    camera.minRatio = 0.2;
    camera.maxRatio = 5.0;
    setupCameraBoundaries();
  }
}

/**
 * Add reset view button to the container
 * @private
 */
function addResetButton() {
  if (!containerElement) return;

  let resetBtn = containerElement.querySelector('.sigma-reset-btn');
  if (!resetBtn) {
    resetBtn = document.createElement('button');
    resetBtn.className = 'sigma-reset-btn';
    resetBtn.textContent = 'Reset View';
    resetBtn.style.position = 'absolute';
    resetBtn.style.bottom = '10px';
    resetBtn.style.right = '10px';
    resetBtn.style.zIndex = '10';
    resetBtn.style.padding = '8px 12px';
    resetBtn.style.background = '#ffffff';
    resetBtn.style.border = '1px solid #ccc';
    resetBtn.style.borderRadius = '4px';
    resetBtn.style.cursor = 'pointer';

    resetBtn.addEventListener('click', () => {
      if (sigmaInstance.getCamera) {
        sigmaInstance.getCamera().animatedReset({duration: 300});
      }
    });

    containerElement.appendChild(resetBtn);
  }
}

/**
 * Set up camera boundary enforcement
 * @private
 */
function setupCameraBoundaries() {
  setTimeout(() => enforceCameraBoundaries(), 500);

  let boundaryCheckTimeout = null;

  const checkBoundariesDebounced = () => {
    if (boundaryCheckTimeout) clearTimeout(boundaryCheckTimeout);
    boundaryCheckTimeout = setTimeout(() => {
      enforceCameraBoundaries();
    }, 100);
  };

  if (sigmaInstance && sigmaInstance.getCamera) {
    sigmaInstance.getCamera().on('updated', checkBoundariesDebounced);

    registeredIntervals.push(() => {
      if (boundaryCheckTimeout) clearTimeout(boundaryCheckTimeout);
      if (sigmaInstance && sigmaInstance.getCamera) {
        sigmaInstance.getCamera().off('updated', checkBoundariesDebounced);
      }
    });
  }
}

/**
 * Enforce camera boundaries to prevent panning too far from center
 * @public
 */
export const enforceCameraBoundaries = () => {
  if (!sigmaInstance || !graphInstance) return false;

  try {
    const camera = sigmaInstance.getCamera();
    const viewportDimensions = sigmaInstance.getDimensions();
    const nodeCount = graphInstance.order;

    if (nodeCount === 0) return false;

    let foundVisibleNode = false;

    graphInstance.forEachNode((nodeId, attributes) => {
      if (foundVisibleNode) return;

      const nodePosition = sigmaInstance.graphToViewport({
        x: attributes.x,
        y: attributes.y
      });

      const padding = 0;
      if (
        nodePosition.x >= -padding &&
        nodePosition.x <= viewportDimensions.width + padding &&
        nodePosition.y >= -padding &&
        nodePosition.y <= viewportDimensions.height + padding
      ) {
        foundVisibleNode = true;
        return;
      }
    });

    if (!foundVisibleNode) {
      camera.animatedReset({duration: 300});
      return true;
    }

    return false;
  } catch (e) {
    console.error('[CAMERA-BOUNDS] Error checking visibility:', e);
    return false;
  }
};

/**
 * Get the Sigma instance
 * @return {Object|null} Sigma instance or null if not initialized
 */
export const getSigma = () => sigmaInstance;

/**
 * Get the Graphology instance
 * @return {Object|null} Graphology instance or null if not initialized
 */
export const getGraph = () => graphInstance;

/**
 * Get the container element
 * @return {Element|null} Container element
 */
export const getContainer = () => containerElement;

/**
 * Destroy the Sigma instance to prevent memory leaks
 */
export const destroySigma = () => {
  if (!sigmaInstance) return;

  const debugDiv = document.getElementById('sigma-debug-info');
  if (debugDiv) {
    debugDiv.remove();
  }

  if (window._boundaryHandler) {
    try {
      if (sigmaInstance && typeof sigmaInstance.off === 'function') {
        sigmaInstance.off("cameraUpdated");
      }
    } catch (e) {
      console.warn('Error removing boundary handler:', e);
    }
    delete window._boundaryHandler;
  }

  // Get and cleanup force layout
  const forceLayout = getForceLayout();
  if (forceLayout) {
    try {
      forceLayout.stop();
      if (forceLayout.kill && typeof forceLayout.kill === 'function') {
        forceLayout.kill();
      }
      if (forceLayout.worker) {
        forceLayout.worker.terminate();
      }
    } catch (e) {
      console.warn('Error terminating force layout:', e);
    }
  }

  clearSelection();

  registeredIntervals.forEach(intervalOrCleanup => {
    if (typeof intervalOrCleanup === 'function') {
      intervalOrCleanup();
    } else {
      clearInterval(intervalOrCleanup);
    }
  });
  registeredIntervals = [];

  if (globalEventListenersAdded) {
    document.removeEventListener('keydown', handleKeyDown);
    globalEventListenersAdded = false;
  }

  if (sigmaInstance) {
    if (typeof sigmaInstance.removeAllListeners === 'function') {
      sigmaInstance.removeAllListeners();
    }

    try {
      sigmaInstance.clear();
      sigmaInstance.kill();
    } catch (e) {
      console.warn('Error during Sigma disposal', e);
    }
    sigmaInstance = null;
  }

  if (graphInstance) {
    try {
      graphInstance.clear();
    } catch (e) {
      console.warn('Error clearing graph instance', e);
    }
    graphInstance = null;
  }

  if (containerElement) {
    try {
      containerElement.innerHTML = '';
    } catch (e) {
      console.warn('Error clearing container', e);
    }
    containerElement = null;
  }
};

/**
 * Set up listeners for graph control events from UI
 * @private
 */
function setupGraphControlListeners() {
  const { subscribe } = require('../core/state.js');

  if (typeof subscribe !== 'function') {
    console.warn('State management not available for graph controls');
    return;
  }

  subscribe('graph.control', (controlEvent) => {
    if (!controlEvent || !controlEvent.action) return;
    handleGraphControlAction(controlEvent.action);
  });

  subscribe('graph.zoom-in', () => handleGraphControlAction('zoom-in'));
  subscribe('graph.zoom-out', () => handleGraphControlAction('zoom-out'));
  subscribe('graph.fit', () => handleGraphControlAction('fit'));
  subscribe('graph.layout-circle', () => handleGraphControlAction('layout-circle'));
  subscribe('graph.layout-grid', () => handleGraphControlAction('layout-grid'));
  subscribe('graph.layout-random', () => handleGraphControlAction('layout-random'));
  subscribe('graph.reset', () => handleGraphControlAction('reset'));
  subscribe('graph.animate', () => handleGraphControlAction('animate'));
  subscribe('graph.export', () => handleGraphControlAction('export'));
}

/**
 * Handle graph control actions
 * @param {string} action - The control action to perform
 * @private
 */
function handleGraphControlAction(action) {
  if (!sigmaInstance) {
    console.warn('Sigma instance not available for control action:', action);
    return;
  }

  // Import layout functions dynamically
  import('./sigma-layouts.js').then(({ applyLayout, animatePath }) => {
    import('./sigma-rendering.js').then(({ exportImage }) => {
      try {
        switch (action) {
          case 'zoom-in':
            const camera = sigmaInstance.getCamera();
            camera.animatedZoom({ ratio: camera.ratio / 4, duration: 300 });
            break;

          case 'zoom-out':
            const camera2 = sigmaInstance.getCamera();
            camera2.animatedZoom({ ratio: camera2.ratio * 4, duration: 300 });
            break;

          case 'fit':
            sigmaInstance.getCamera().animatedReset({ duration: 300 });
            break;

          case 'layout-circle':
            applyLayout('circular', { animate: true });
            break;

          case 'layout-grid':
            applyLayout('grid', { animate: true });
            break;

          case 'layout-random':
            applyLayout('random', { animate: true });
            break;

          case 'reset':
            sigmaInstance.getCamera().animatedReset({ duration: 300 });
            clearSelection();
            setState('ui.selectedNodes', []);
            setState('ui.selectedEdges', []);
            break;

          case 'animate':
            const currentPath = getState('results.path');
            if (currentPath && Array.isArray(currentPath)) {
              animatePath(currentPath);
            }
            break;

          case 'export':
            exportImage();
            break;

          default:
            console.warn('Unknown graph control action:', action);
        }
      } catch (error) {
        console.error('Error handling graph control action:', action, error);
      }
    });
  });
}

// Register cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', destroySigma);
}

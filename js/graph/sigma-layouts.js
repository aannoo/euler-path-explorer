/**
 * Sigma.js Layouts Module
 * Layout algorithms, force physics, and path animations
 * Split from sigma-adapter.js for better maintainability
 */

import forceAtlas2 from 'graphology-layout-forceatlas2';
import circular from 'graphology-layout/circular';
import random from 'graphology-layout/random';
import ForceSupervisor from 'graphology-layout-force/worker';
import { setState, getState } from '../core/state.js';
import { DEFAULT_NODE_ATTRIBUTES, DEFAULT_EDGE_ATTRIBUTES } from './sigma-core.js';

// Force layout instance (module-scoped)
let forceLayout = null;

// Track current animation state
let currentAnimation = null;

// Reference to graph and sigma instances (set during init)
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
 * Initialize physics-based force layout
 * @param {Graph} graph - Graphology graph instance
 * @public
 */
export function initForceLayout(graph) {
  if (!graph) {
    graph = graphInstance;
  }
  if (!graph) return;

  try {
    forceLayout = new ForceSupervisor(graph, {
      isNodeFixed: (_, attr) => attr.highlighted || attr.fixed,
      settings: {
        springLength: 80,
        springCoeff: 0.0008,
        gravity: 0.0001,
        theta: 0.8,
        dragCoeff: 0.02
      }
    });
    forceLayout.start();
  } catch (error) {
    console.error('Error initializing force layout:', error);
    forceLayout = null;
  }
}

/**
 * Get the current force layout instance
 * @return {ForceSupervisor|null} Force layout instance
 */
export const getForceLayout = () => forceLayout;

/**
 * Pause the force layout
 * @public
 */
export const pauseForceLayout = () => {
  if (forceLayout && forceLayout.isRunning()) {
    forceLayout.stop();
  }
};

/**
 * Resume the force layout
 * @public
 */
export const resumeForceLayout = () => {
  if (forceLayout && !forceLayout.isRunning()) {
    forceLayout.start();
  }
};

/**
 * Stop and cleanup force layout
 * @public
 */
export const destroyForceLayout = () => {
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
    forceLayout = null;
  }
};

/**
 * Apply a specific layout algorithm
 * @param {string} [layoutType='forceatlas2'] - Layout type
 * @param {Object} [options={}] - Layout options
 */
export const applyLayout = (layoutType = 'forceatlas2', options = {}) => {
  if (!graphInstance) return;

  if (forceLayout) {
    forceLayout.stop();
  }

  const layoutOptions = {
    forceatlas2: {
      iterations: 50,
      settings: { gravity: 1, scalingRatio: 2 },
      ...options
    },
    circular: { scale: 100, ...options },
    random: { scale: 100, ...options }
  };

  switch (layoutType) {
    case 'forceatlas2':
      forceAtlas2.assign(graphInstance, layoutOptions.forceatlas2);
      break;
    case 'circular':
      circular.assign(graphInstance, layoutOptions.circular);
      break;
    case 'grid':
      const nodes = graphInstance.nodes();
      const nodeCount = nodes.length;
      const cols = Math.ceil(Math.sqrt(nodeCount));
      const spacing = options.spacing || 100;

      nodes.forEach((nodeId, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        graphInstance.setNodeAttribute(nodeId, 'x', (col - cols/2) * spacing);
        graphInstance.setNodeAttribute(nodeId, 'y', (row - cols/2) * spacing);
      });
      break;
    case 'random':
      random.assign(graphInstance, layoutOptions.random);
      break;
    default:
      forceAtlas2.assign(graphInstance, layoutOptions.forceatlas2);
  }

  if (sigmaInstance) {
    sigmaInstance.refresh();
  }

  // Restart force layout if enabled
  let enableForceLayout = true;
  try {
    const featureState = getState('ui.visualFeatures');
    enableForceLayout = featureState?.enableForceLayout !== false;
  } catch (error) {
    enableForceLayout = true;
  }

  if (enableForceLayout) {
    if (!forceLayout) {
      initForceLayout(graphInstance);
    } else {
      forceLayout.start();
    }
  }
};

/**
 * Set graph directedness
 * @param {boolean} directed - Whether graph is directed
 */
export const setDirected = (directed) => {
  if (!graphInstance) return;

  directed = Boolean(directed);

  const currentState = getState('graph.directed');
  if (currentState !== directed) {
    setState('graph.directed', directed);
  }

  graphInstance.forEachEdge((edge, attributes) => {
    const newType = directed ? 'arrow' : 'line';

    if (!graphInstance.hasEdgeAttribute(edge, 'originalType')) {
      const currentType = graphInstance.getEdgeAttribute(edge, 'type') || 'line';
      graphInstance.setEdgeAttribute(edge, 'originalType', currentType);
    }

    graphInstance.setEdgeAttribute(edge, 'type', newType);

    if (directed) {
      const currentSize = graphInstance.getEdgeAttribute(edge, 'size');
      if (!currentSize || currentSize <= DEFAULT_EDGE_ATTRIBUTES.size) {
        graphInstance.setEdgeAttribute(edge, 'size', 6);
      }
      graphInstance.setEdgeAttribute(edge, 'color', '#FF5A1F');
    } else {
      graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);
      graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
    }
  });

  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
};

/**
 * Highlight a path in the graph
 * @param {Array} path - Array of node IDs
 */
export const highlightPath = (path) => {
  if (!graphInstance || !sigmaInstance || !path || path.length < 2) return;

  graphInstance.emit('startBatch');

  graphInstance.forEachNode((node) => {
    graphInstance.setNodeAttribute(node, 'color', DEFAULT_NODE_ATTRIBUTES.color);
    graphInstance.setNodeAttribute(node, 'size', DEFAULT_NODE_ATTRIBUTES.size);
  });

  graphInstance.forEachEdge((edge) => {
    graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
    graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);

    if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {
      graphInstance.setEdgeAttribute(edge, 'size', 6);
    }

    if (graphInstance.hasEdgeAttribute(edge, 'label')) {
      graphInstance.removeEdgeAttribute(edge, 'label');
    }
  });

  for (let i = 0; i < path.length; i++) {
    const nodeId = String(path[i]);

    if (graphInstance.hasNode(nodeId)) {
      graphInstance.setNodeAttribute(nodeId, 'color', '#0ea5e9');
      graphInstance.setNodeAttribute(nodeId, 'size', 10);
    }

    if (i < path.length - 1) {
      const nextNodeId = String(path[i + 1]);
      const edgeId = findEdgeId(nodeId, nextNodeId);

      if (edgeId && graphInstance.hasEdge(edgeId)) {
        graphInstance.setEdgeAttribute(edgeId, 'color', '#0ea5e9');
        graphInstance.setEdgeAttribute(edgeId, 'size', 3);
      }
    }
  }

  graphInstance.emit('endBatch');

  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
};

/**
 * Animate traversal of a path
 * @param {Array} path - Array of node IDs
 * @param {number} [delay=1000] - Delay between steps
 * @return {Promise}
 */
export const animatePath = (path, delay = 1000) => {
  if (!graphInstance || !sigmaInstance || !path || path.length < 2) {
    return Promise.resolve();
  }

  const normalizedPath = path.map(node => String(node));

  if (currentAnimation && typeof currentAnimation.cancel === 'function') {
    currentAnimation.cancel();
  }

  if (forceLayout) {
    forceLayout.stop();
  }

  graphInstance.emit('startBatch');

  graphInstance.forEachNode((node) => {
    graphInstance.setNodeAttribute(node, 'color', '#ff5a1f');
    graphInstance.setNodeAttribute(node, 'size', 8);
  });

  graphInstance.forEachEdge((edge) => {
    graphInstance.setEdgeAttribute(edge, 'color', '#1E293B');
    graphInstance.setEdgeAttribute(edge, 'size', 2);
  });

  graphInstance.emit('endBatch');

  setState('animation.inProgress', true);
  setState('animation.path', normalizedPath);
  setState('animation.currentStep', 0);

  let isAnimationCancelled = false;

  const animationPromise = new Promise(resolve => {
    try {
      sigmaInstance.getCamera().animatedReset({
        duration: 500,
        easing: 'cubicOut'
      });
    } catch (err) {
      console.error("Camera animation error:", err);
    }

    setTimeout(() => {
      let step = 0;

      const animateStep = () => {
        if (isAnimationCancelled || step >= normalizedPath.length) {
          setState('animation.inProgress', false);
          currentAnimation = null;

          if (forceLayout) {
            forceLayout.start();
          }

          resolve();
          return;
        }

        setState('animation.currentStep', step);

        graphInstance.emit('startBatch');

        normalizedPath.forEach(nodeId => {
          if (graphInstance.hasNode(nodeId)) {
            graphInstance.setNodeAttribute(nodeId, 'color', '#ff8f29');
            graphInstance.setNodeAttribute(nodeId, 'size', 10);
          }
        });

        const currentNodeId = normalizedPath[step];
        if (graphInstance.hasNode(currentNodeId)) {
          graphInstance.setNodeAttribute(currentNodeId, 'color', '#ffdd00');
          graphInstance.setNodeAttribute(currentNodeId, 'size', 14);

          if (step < normalizedPath.length - 1) {
            const nextNodeId = normalizedPath[step + 1];
            if (graphInstance.hasNode(nextNodeId)) {
              const isDirected = getState('graph.directed') || false;
              const edgeId = findEdgeId(currentNodeId, nextNodeId, isDirected);

              if (edgeId) {
                graphInstance.setEdgeAttribute(edgeId, 'color', '#ffdd00');
                graphInstance.setEdgeAttribute(edgeId, 'size', 4);
              }
            }
          }
        }

        graphInstance.emit('endBatch');
        sigmaInstance.refresh();

        step++;
        setTimeout(animateStep, delay);
      };

      animateStep();
    }, 600);
  });

  animationPromise.cancel = () => {
    isAnimationCancelled = true;
  };

  currentAnimation = animationPromise;

  return animationPromise;
};

/**
 * Find edge ID between two nodes
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @param {boolean} [directed=null] - Consider direction
 * @return {string|null} Edge ID or null
 */
function findEdgeId(source, target, directed = null) {
  if (!graphInstance) return null;

  if (directed === null) {
    try {
      directed = getState('graph.directed') || false;
    } catch (e) {
      directed = false;
    }
  }

  directed = Boolean(directed);
  source = String(source);
  target = String(target);

  try {
    if (typeof graphInstance.edge === 'function') {
      try {
        return graphInstance.edge(source, target);
      } catch (e) {
        if (!directed) {
          try {
            return graphInstance.edge(target, source);
          } catch (e) {
            // Edge not found
          }
        }
      }
    }
  } catch (e) {
    // Fall back to iteration
  }

  let edgeId = null;

  graphInstance.forEachEdge((id, attributes, sourceId, targetId) => {
    if (edgeId) return false;

    const sid = String(sourceId);
    const tid = String(targetId);

    if ((sid === source && tid === target) ||
        (!directed && sid === target && tid === source)) {
      edgeId = id;
      return false;
    }
  });

  return edgeId;
}

/**
 * Get current animation state
 * @return {Object|null} Current animation or null
 */
export const getCurrentAnimation = () => currentAnimation;

/**
 * Cancel current animation
 */
export const cancelAnimation = () => {
  if (currentAnimation && typeof currentAnimation.cancel === 'function') {
    currentAnimation.cancel();
    currentAnimation = null;
  }
};

/**
 * Sigma.js Rendering Module
 * Graph conversion, rendering, and export
 * Split from sigma-adapter.js for better maintainability
 */

import { setState, getState } from '../core/state.js';
import { DEFAULT_NODE_ATTRIBUTES, DEFAULT_EDGE_ATTRIBUTES } from './sigma-constants.js';
import { getSigma, getGraph } from './sigma-core.js';
import { applyLayout, initForceLayout, pauseForceLayout, setDirected } from './sigma-layouts.js';
import { clearSelection } from './sigma-selection.js';

/**
 * Convert Euler graph format to Graphology format
 * @param {Object} eulerGraph - Graph in Euler format {nodes, edges, directed, weighted}
 * @returns {Object} Graphology-compatible data
 */
export const convertToGraphology = (eulerGraph) => {
  const nodes = new Map();
  const edges = [];

  if (!eulerGraph || !eulerGraph.edges) {
    return { nodes: [], edges: [] };
  }

  const isDirected = eulerGraph.directed || false;
  const isWeighted = eulerGraph.weighted || false;

  eulerGraph.edges.forEach((edge, index) => {
    let source, target, weight;

    if (typeof edge === 'string') {
      const parts = edge.split(',').map(s => s.trim());
      source = parts[0];
      target = parts[1];
      weight = parts[2] ? parseFloat(parts[2]) : 1;
    } else if (Array.isArray(edge)) {
      source = String(edge[0]);
      target = String(edge[1]);
      weight = edge[2] !== undefined ? parseFloat(edge[2]) : 1;
    } else if (typeof edge === 'object') {
      source = String(edge.source || edge.from || edge[0]);
      target = String(edge.target || edge.to || edge[1]);
      weight = edge.weight !== undefined ? parseFloat(edge.weight) : 1;
    } else {
      return;
    }

    if (!source || !target) return;

    // Add nodes if not exists
    if (!nodes.has(source)) {
      nodes.set(source, {
        id: source,
        label: source,
        ...DEFAULT_NODE_ATTRIBUTES,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50
      });
    }

    if (!nodes.has(target)) {
      nodes.set(target, {
        id: target,
        label: target,
        ...DEFAULT_NODE_ATTRIBUTES,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50
      });
    }

    // Add edge
    edges.push({
      id: `e${index}`,
      source,
      target,
      weight,
      size: DEFAULT_EDGE_ATTRIBUTES.size,
      color: DEFAULT_EDGE_ATTRIBUTES.color,
      type: isDirected ? 'arrow' : 'line',
      label: isWeighted ? String(weight) : undefined
    });
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
    directed: isDirected,
    weighted: isWeighted
  };
};

/**
 * Render a graph
 * @param {Object} eulerGraph - Graph data
 * @param {boolean} [fit=true] - Whether to fit graph to viewport
 */
export const renderGraph = (eulerGraph, fit = true) => {
  const sigmaInstance = getSigma();
  const graphInstance = getGraph();

  if (!sigmaInstance || !graphInstance) {
    return;
  }

  // Pause force layout during updates
  pauseForceLayout();

  // Clear existing graph
  graphInstance.clear();
  clearSelection();

  // Convert and add nodes/edges
  const graphData = convertToGraphology(eulerGraph);

  graphInstance.emit('startBatch');

  // Add nodes
  graphData.nodes.forEach(node => {
    try {
      graphInstance.addNode(node.id, {
        label: node.label || node.id,
        x: node.x,
        y: node.y,
        size: node.size || DEFAULT_NODE_ATTRIBUTES.size,
        color: node.color || DEFAULT_NODE_ATTRIBUTES.color
      });
    } catch (error) {
      // Node add error - ignore duplicates
    }
  });

  // Add edges
  graphData.edges.forEach(edge => {
    try {
      graphInstance.addEdge(edge.source, edge.target, {
        size: edge.size || DEFAULT_EDGE_ATTRIBUTES.size,
        color: edge.color || DEFAULT_EDGE_ATTRIBUTES.color,
        type: edge.type || 'line',
        weight: edge.weight || 1,
        label: edge.label
      });
    } catch (error) {
      // Edge add error - ignore duplicates
    }
  });

  graphInstance.emit('endBatch');

  // Apply initial layout
  if (graphData.nodes.length > 0) {
    applyLayout('circular', { animate: false });
  }

  // Set directed mode
  setDirected(graphData.directed);

  // Fit to viewport
  if (fit && sigmaInstance.getCamera) {
    setTimeout(() => {
      sigmaInstance.getCamera().animatedReset({ duration: 300 });
    }, 100);
  }

  // Reinitialize force layout
  initForceLayout(graphInstance);

  sigmaInstance.refresh();
};

/**
 * Export graph as image
 * @returns {Promise<string|null>} Data URL or null on failure
 */
export const exportImage = () => {
  const sigmaInstance = getSigma();

  if (!sigmaInstance) {
    return null;
  }

  try {
    // Get the sigma canvas layers
    const container = sigmaInstance.getContainer();
    if (!container) return null;

    const canvases = container.querySelectorAll('canvas');
    if (canvases.length === 0) return null;

    // Create composite canvas
    const compositeCanvas = document.createElement('canvas');
    const mainCanvas = canvases[0];
    compositeCanvas.width = mainCanvas.width;
    compositeCanvas.height = mainCanvas.height;

    const ctx = compositeCanvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

    // Draw each canvas layer
    canvases.forEach(canvas => {
      ctx.drawImage(canvas, 0, 0);
    });

    // Convert to data URL
    const dataUrl = compositeCanvas.toDataURL('image/png');

    // Trigger download
    const link = document.createElement('a');
    link.download = `euler-graph-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  } catch (error) {
    console.error('Error exporting image:', error);
    return null;
  }
};

/**
 * Export graph as JSON
 * @returns {Object|null} Graph data or null
 */
export const exportJSON = () => {
  const graphInstance = getGraph();

  if (!graphInstance) return null;

  const nodes = [];
  const edges = [];

  graphInstance.forEachNode((nodeId, attributes) => {
    nodes.push({
      id: nodeId,
      label: attributes.label || nodeId,
      x: attributes.x,
      y: attributes.y,
      color: attributes.color,
      size: attributes.size
    });
  });

  graphInstance.forEachEdge((edgeId, attributes, source, target) => {
    edges.push({
      id: edgeId,
      source,
      target,
      weight: attributes.weight || 1,
      color: attributes.color,
      size: attributes.size
    });
  });

  return {
    nodes,
    edges,
    directed: getState('graph.directed') || false,
    weighted: getState('graph.weighted') || false
  };
};

/**
 * Import graph from JSON
 * @param {Object} jsonData - Graph data
 * @returns {boolean} Success
 */
export const importJSON = (jsonData) => {
  if (!jsonData || !jsonData.edges) return false;

  try {
    const eulerGraph = {
      edges: jsonData.edges.map(e => ({
        source: e.source,
        target: e.target,
        weight: e.weight || 1
      })),
      directed: jsonData.directed || false,
      weighted: jsonData.weighted || false
    };

    renderGraph(eulerGraph);
    return true;
  } catch (error) {
    console.error('Error importing JSON:', error);
    return false;
  }
};

/**
 * Get current graph statistics
 * @returns {Object} Stats object
 */
export const getGraphStats = () => {
  const graphInstance = getGraph();

  if (!graphInstance) {
    return { nodes: 0, edges: 0, directed: false, weighted: false };
  }

  return {
    nodes: graphInstance.order,
    edges: graphInstance.size,
    directed: getState('graph.directed') || false,
    weighted: getState('graph.weighted') || false
  };
};

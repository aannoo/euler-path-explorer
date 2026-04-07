/**
 * Sigma Controller
 * Connects graph model with UI and handles operations using Sigma.js
 */
import { $, $$ } from '../utils/dom.js';
import { getState, setState, subscribe } from '../core/state.js';
import { Graph } from './model.js';
import {
  SigmaCore,
  SigmaRenderer,
  SigmaLayout,
  SigmaSelection,
  SigmaProperties,
  SigmaAnimation,
  SigmaExport
} from './sigma-facade.js';
import { showNotification } from '../ui/init.js';
import { findEulerPath, buildAdjacencyList, getExplanation } from '../core/algorithm.js';
import { showCalcLoader, hideCalcLoader, updateLoaderProgress, cancelLoading } from '../ui/loader.js';
import { validateEdge, validateEdges, formatValidationError } from '../utils/validation.js';

// Create a graph instance
const graph = new Graph();

// Track visualization feature settings
const visualFeatures = {
  enableDragAndDrop: true,
  enableVisualCreation: false,
  enableForceLayout: true,
  enableDeletion: true,
  enablePropertyEditing: true
};

/**
 * Initialize sigma controller
 * @param {string} [container='#cy'] - Sigma container selector
 */
export const initializeSigmaGraph = (container = '#cy') => {
  // Initialize Sigma.js with all features enabled
  const sigmaResult = SigmaCore.initialize(container, visualFeatures);
  
  if (!sigmaResult) {
    return;
  }
  
  // Subscribe to graph property changes
  subscribe('graph.directed', (directed) => {
    graph.directed = directed;
    updateGraph();
  });
  
  subscribe('graph.weighted', (weighted) => {
    graph.weighted = weighted;
    updateGraph();
  });
  
  // Subscribe to visual feature toggles
  subscribe('ui.visualFeatures', (features) => {
    // Update feature settings
    Object.assign(visualFeatures, features);
    
    // Re-initialize Sigma with new settings (requires destroying and recreating)
    SigmaCore.destroy();
    SigmaCore.initialize(container, visualFeatures);
    
    // Re-render the graph
    updateGraph();
  });
  
  // Set up edge input parsing
  setupEdgeInput();
  
  // Set up export button
  const exportBtn = $('#export');
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExport);
  }
  
  // Set up animation button
  const animateBtn = $('#animate');
  if (animateBtn) {
    animateBtn.addEventListener('click', handleAnimation);
  }
  
  // Set up reset button
  const resetBtn = $('#reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear path
      setState('animation.path', null);
      
      // Clear the graph
      graph.clear();
      
      // Update the graph state
      setState('graph.edges', []);
      
      // Update the visualization
      updateGraph();
      
      // Switch back to input tab
      setState('ui.activeTab', 'input');
      
      // Hide result
      $('#result').classList.add('hidden');
      $('#explanation').classList.add('hidden');
      $('#controls').classList.add('hidden');
      
      // Focus on the input textarea and select all text
      setTimeout(() => {
        const edgeInput = $('#edges');
        if (edgeInput) {
          edgeInput.focus();
          edgeInput.select();
        }
      }, 100); // Small delay to ensure tab switch completes
    });
  }
  
  // Set up selection state tracking
  setupSelectionTracking();
  
  return {
    getGraph: () => graph,
    getSigma: SigmaCore.getInstance,
    getGraphology: SigmaCore.getGraph
  };
};

/**
 * Set up selection tracking
 */
const setupSelectionTracking = () => {
  // Initialize state with empty selection
  setState('ui.selectedNodes', []);
  setState('ui.selectedEdges', []);
  setState('ui.propertyEditing', {
    active: false,
    selectedNodes: [],
    selectedEdges: [],
    editableNodeProperties: [
      { name: 'label', type: 'string', label: 'Label' },
      { name: 'color', type: 'color', label: 'Color' },
      { name: 'size', type: 'number', label: 'Size', min: 1, max: 20 }
    ],
    editableEdgeProperties: [
      { name: 'label', type: 'string', label: 'Label' },
      { name: 'color', type: 'color', label: 'Color' },
      { name: 'size', type: 'number', label: 'Size', min: 1, max: 10 },
      { name: 'weight', type: 'number', label: 'Weight', min: 1, max: 100 }
    ]
  });
};

/**
 * Set up edge input parsing
 */
const setupEdgeInput = () => {
  const calculateBtn = $('#calculate');
  const edgeInput = $('#edges');
  
  if (!calculateBtn || !edgeInput) return;
  
  // Handle the calculation process
  const handleCalculation = () => {
    try {
      const edgeStr = edgeInput.value;
      if (!edgeStr) {
        showNotification('Please enter edges', 'error');
        return;
      }
      
      
      // Test if orbital element exists
      const orbitalTest = document.getElementById('orbital-welcome');
      
      // Signal that calculation has started (for orbital animation)
      // The state subscription in main.js handles the animation trigger
      setState('ui.calculationStarted', true);
      
      // Wait for orbital animation to start before beginning graph processing
      setTimeout(() => {
        // Parse edges first to get node count
        const edges = parseEdgeInput(edgeStr);
        
        // Make sure edges is an array
        if (!Array.isArray(edges)) {
          throw new Error('Edge parsing did not return an array');
        }
        
        // Calculate node count from edges
        const nodes = new Set();
        edges.forEach(edge => {
          nodes.add(edge.source);
          nodes.add(edge.target);
        });
        const nodeCount = nodes.size;
        
        // Show global loader with node count and wait for animations to complete
        showCalcLoader('Parsing Graph...', nodeCount).then(() => {
          try {
            // Update the graph
            graph.clear();
            
            // Set graph properties first
            // Check for pending changes in the directed/weighted state
            const pendingDirected = getState('graph.pendingDirected');
            const pendingWeighted = getState('graph.pendingWeighted');
            
            // Apply pending changes if they exist
            if (pendingDirected !== undefined) {
              setState('graph.directed', pendingDirected);
              setState('graph.pendingDirected', undefined); // Clear pending state
            }
            
            if (pendingWeighted !== undefined) {
              setState('graph.weighted', pendingWeighted);
              setState('graph.pendingWeighted', undefined); // Clear pending state
            }
            
            // Now apply the current state
            graph.directed = getState('graph.directed');
            graph.weighted = getState('graph.weighted');
            
            // Add all edges (this will add nodes as well)
            edges.forEach(edge => {
              graph.addEdge(edge.source, edge.target, { weight: edge.weight });
            });
            
            // Update the graph state
            setState('graph.edges', edges);
            
            // Update loader progress
            updateLoaderProgress('Rendering Graph...');
            
            // Update the visualization
            updateGraph();
            
            // Update loader for Euler path calculation
            updateLoaderProgress('Finding Euler Path...');
            
            // Calculate Euler path
            calculateEulerPath(false);
            
            // Update UI to show results
            setState('ui.activeTab', 'results');
            
            // Hide loader after processing is complete and wait for animations
            hideCalcLoader().then(() => {
              // Only show notification after loader is completely gone
              showNotification('Graph updated successfully');
            });
          } catch (error) {
            showNotification('Error: ' + error.message);
            // Use cancelLoading for immediate cleanup in error state
            cancelLoading();
          }
        });
      }, 1000); // Small delay to let orbital animation start first
    } catch (error) {
      showNotification('Error parsing edges. Check format.');
      // Use cancelLoading for immediate cleanup in error state
      cancelLoading();
    }
  };
  
  // Set up calculate button click event
  calculateBtn.addEventListener('click', handleCalculation);
  
  // Add keyboard event handling for Enter key
  edgeInput.addEventListener('keydown', (event) => {
    // Only process if we're on the input tab
    if (getState('ui.activeTab') !== 'input') return;
    
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior
      
      // Add visual feedback class
      calculateBtn.classList.add('keyboard-active');
      
      // Trigger calculation
      handleCalculation();
      
      // Safety timeout in case keyup is missed
      const safetyTimeout = setTimeout(() => {
        calculateBtn.classList.remove('keyboard-active');
      }, 1000);
      
      // Create one-time keyup listener to remove active class
      const keyupHandler = (upEvent) => {
        if (upEvent.key === 'Enter') {
          // Remove the active class
          calculateBtn.classList.remove('keyboard-active');
          // Clear the safety timeout
          clearTimeout(safetyTimeout);
          // Remove this event listener
          document.removeEventListener('keyup', keyupHandler);
        }
      };
      
      // Add the keyup listener
      document.addEventListener('keyup', keyupHandler);
    }
  });
  
  // Update graph info strip when edge input changes
  // Uses state.js pub/sub instead of window global
  edgeInput.addEventListener('input', () => {
    setState('ui.edgeInputChanged', Date.now());
  });
};

/**
 * Parse edge input string
 * @param {string} input - Edge input string
 * @return {Array} Array of edge objects
 */
export const parseEdgeInput = (input) => {
  // Strip whitespace and validate basic format
  input = input.trim();
  
  if (!input) {
    throw new Error('Edge input is empty. Please enter some edge data.');
  }
  
  try {
    // Check for Euler edge format (A-B, A->B, A<->B)
    const lines = input.split('\n').filter(line => line.trim());
    
    // If the first line matches Euler format, process as Euler format
    const firstLine = lines[0].trim();
    const eulerEdgePattern = /^([a-zA-Z0-9_]+)(->|<->|-)([a-zA-Z0-9_]+)$/;
    
    if (eulerEdgePattern.test(firstLine)) {
      
      // Extract all vertices first for validation
      const vertices = new Set();
      lines.forEach(line => {
        const match = line.trim().match(eulerEdgePattern);
        if (match) {
          vertices.add(match[1]); // source
          vertices.add(match[3]); // target
        }
      });
      
      // Validate the edges using our validation utilities
      const validationResult = validateEdges(
        lines, 
        Array.from(vertices)
      );
      
      if (!validationResult.valid) {
        const errorMsg = formatValidationError(validationResult);
        throw new Error(errorMsg);
      }
      
      // Convert to the internal edge format
      const edges = [];
      lines.forEach(line => {
        const match = line.trim().match(eulerEdgePattern);
        if (match) {
          const source = match[1];
          const target = match[3];
          const connector = match[2];
          const bidirectional = connector === '<->' || connector === '-';
          
          // Add primary edge
          edges.push({
            source,
            target,
            weight: 1
          });
          
          // Add reverse edge if bidirectional
          if (bidirectional) {
            edges.push({
              source: target,
              target: source,
              weight: 1
            });
          }
        }
      });
      
      return edges;
    }
    
    // First check if it's already in JSON format
    if (input.startsWith('[{') && input.endsWith('}]')) {
      // Try parsing as JSON array of objects
      try {
        const parsed = JSON.parse(input);
        
        // Ensure result is an array
        if (!Array.isArray(parsed)) {
          throw new Error('JSON input must be an array of edge objects');
        }
        
        // Validate each edge object
        const invalidEdges = parsed.filter(edge => !edge.source || !edge.target);
        if (invalidEdges.length > 0) {
          throw new Error('Some edges are missing source or target: ' + 
            JSON.stringify(invalidEdges.slice(0, 2)));
        }
        
        return parsed;
      } catch (jsonError) {
        // If JSON parsing fails, provide a specific error
        throw new Error(`Invalid JSON format: ${jsonError.message}. Expected format: [{source:"a",target:"b"}]`);
      }
    }
    
    // Parse using regex approach like in Graph.parseEdgeList
    const edges = [];
    const edgeMatches = input.match(/\[([^\]]+)\]/g) || [];
    
    if (edgeMatches.length === 0) {
      throw new Error('No valid edges found. Format should be: [a,b],[c,d]');
    }
    
    edgeMatches.forEach((match, index) => {
      // Add null check and validation for match
      if (!match || typeof match !== 'string' || match.length < 3) {
        throw new Error(`Edge ${index + 1} is invalid: empty or malformed edge definition`);
      }
      
      // Remove brackets and split by comma
      const parts = match.substring(1, match.length - 1).split(',').map(p => p.trim());
      
      if (parts.length < 2) {
        throw new Error(`Edge ${index + 1} is invalid: ${match}. Each edge needs at least source and target.`);
      }
      
      const source = parts[0];
      const target = parts[1];
      
      if (!source || !target) {
        throw new Error(`Edge ${index + 1} has empty source or target: ${match}`);
      }
      
      // If there's a third part, use as weight
      let weight = 1;
      if (parts.length > 2) {
        const weightValue = parseFloat(parts[2]);
        if (isNaN(weightValue)) {
          throw new Error(`Edge ${index + 1} has invalid weight: ${parts[2]}. Weight must be a number.`);
        }
        weight = weightValue;
        
        // Ensure weight is positive
        if (weight <= 0) {
          throw new Error(`Edge ${index + 1} has invalid weight: ${weight}. Weight must be positive.`);
        }
      }
      
      // Add edge object
      const edge = { source, target, weight };
      edges.push(edge);
    });
    
    return edges;
  } catch (error) {
    // Provide specific format guidance in the error message
    if (error.message.includes('No valid edges found')) {
      throw new Error('No valid edges found. Format should be: [a,b],[c,d] or [{source:"a",target:"b"}]');
    } else {
      throw new Error(`Invalid edge format: ${error.message}\nExpected format: [source,target] or [source,target,weight]`);
    }
  }
};

/**
 * Update the graph visualization
 */
const updateGraph = () => {
  // Render the graph using Sigma.js adapter
  SigmaRenderer.render(graph);
  
  // Update the state for the UI
  const edges = graph.getAllEdges();
  setState('graph.edges', edges);
  setState('graph.hasEdges', edges.length > 0);
};

/**
 * Calculate Euler path
 */
export const calculateEulerPath = async (showLoader = true) => {
    // Get all nodes and edges
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();
    
    const isWeighted = getState('graph.weighted');

    if (nodes.length === 0 || edges.length === 0) {
      showNotification('Graph is empty');
      return null;
    }
    
    // Make sure we have at least one edge
    if (edges.length === 0) {
      showNotification('Graph must have at least one edge');
      return null;
    }
    
    // Show loader if requested
    if (showLoader) {
      showCalcLoader();
    }
    
    try {
      // Build adjacency list - make sure to pass edges array, not the graph object
      updateLoaderProgress('Building adjacency list...');
      const adjacencyList = buildAdjacencyList(edges, graph.directed);
      
      
      // Find Euler path - pass weighted flag to use Chinese Postman if weighted
      updateLoaderProgress(isWeighted ? 'Finding Chinese Postman tour...' : 'Finding Euler path...');
      const result = await findEulerPath(adjacencyList, null, isWeighted);
      
      
      // Process result
      updateLoaderProgress('Processing result...');
      processPathResult(result);
      
      // Hide loader if we showed it
      if (showLoader) {
        hideCalcLoader();
        
        // Only switch to results tab if we're showing a loader
        // (this means it was initiated directly by the user)
        setState('ui.activeTab', 'results');
      }
      
      return result;
    } catch (error) {
      showNotification(`Calculation error: ${error.message}`);
      if (showLoader) {
        hideCalcLoader();
      }
      return null;
    }
};

/**
 * Process path result
 * @param {Object} result - Result object from algorithm
 */
const processPathResult = (result) => {
  // Update state
  setState('euler.hasPath', result.hasPath);
  setState('euler.isCircuit', result.hasCircuit);
  setState('euler.path', result.path);
  setState('euler.explanation', result.explanation);
  setState('euler.isChinesePostman', result.isChinesePostman || false);
  if (result.totalWeight) {
    setState('euler.totalWeight', result.totalWeight);
  }
  if (result.duplicatedEdges) {
    setState('euler.duplicatedEdges', result.duplicatedEdges);
  }
  
  // Show result in UI
  const resultEl = $('#result');
  const resultTitleEl = $('#result-title');
  const resultPathEl = $('#result-path');
  const resultSummaryEl = $('#result-summary');
  const explanationEl = $('#explanation');
  const explanationContentEl = $('#explanation-content');
  const controlsEl = $('#controls');
  
  if (resultEl && resultTitleEl && resultPathEl && resultSummaryEl) {
    // Show result container
    resultEl.classList.remove('hidden');
    
    // Set result title
    if (result.isChinesePostman) {
      resultTitleEl.textContent = 'Chinese Postman Tour';
    } else {
      resultTitleEl.textContent = result.hasPath 
        ? `Euler ${result.hasCircuit ? 'Circuit' : 'Path'} Found` 
        : 'No Euler Path Found';
    }
    
    // Display path in the dedicated path element
    if (result.hasPath && result.path) {
      const pathStr = result.path.join(' → ');
      resultPathEl.innerHTML = `<span class="path-title">Path:</span> ${pathStr}`;
      resultPathEl.classList.remove('hidden');
    } else {
      resultPathEl.classList.add('hidden');
    }
    
    // Set result summary
    if (result.isChinesePostman) {
      let summaryText = result.hasCircuit 
        ? 'Found minimum-weight tour. ' 
        : 'Found minimum-weight path. ';
      
      if (result.totalWeight) {
        summaryText += `Total weight: ${result.totalWeight}`;
      }
      
      resultSummaryEl.textContent = summaryText;
    } else if (result.summary) {
      resultSummaryEl.textContent = result.summary;
    }
    
    // Set explanation but keep it hidden initially
    if (explanationEl && explanationContentEl) {
      // Keep explanation hidden until user clicks the button
      explanationEl.classList.add('hidden');
      explanationContentEl.innerHTML = getExplanation(result);
    }
    
    // Show controls if path found
    if (controlsEl) {
      if (result.hasPath) {
        controlsEl.classList.remove('hidden');
      } else {
        controlsEl.classList.add('hidden');
      }
    }
  }
  
  // If we found a path, highlight it
  if (result.hasPath && result.path) {
    if (result.isChinesePostman && result.duplicatedEdges) {
      // For Chinese Postman, highlight duplicated edges differently
      highlightChinesePostmanPath(result.path, result.duplicatedEdges);
    } else {
      // Regular path highlighting
      SigmaAnimation.highlightPath(result.path);
    }
  }
};

/**
 * Highlight a Chinese Postman path with duplicated edges
 * @param {Array} path - Path as array of node IDs
 * @param {Array} duplicatedEdges - Array of duplicated edges
 */
const highlightChinesePostmanPath = (path, duplicatedEdges) => {
  if (!path || path.length < 2) return;

  // Get the Sigma and graph instances
  const graphInstance = SigmaCore.getGraph();
  if (!graphInstance) return;
  
  try {
    // First reset all node and edge colors (similar to highlightPath)
    graphInstance.forEachNode(node => {
      graphInstance.setNodeAttribute(node, 'color', '#ff5a1f');
      graphInstance.setNodeAttribute(node, 'size', 8);
    });
    
    graphInstance.forEachEdge(edge => {
      graphInstance.setEdgeAttribute(edge, 'color', '#1E293B');
      graphInstance.setEdgeAttribute(edge, 'size', 2);
      
      // Remove any existing weight labels
      if (graphInstance.hasEdgeAttribute(edge, 'label')) {
        graphInstance.removeEdgeAttribute(edge, 'label');
      }
    });
    
    // Highlight the path nodes
    for (let i = 0; i < path.length; i++) {
      const nodeId = String(path[i]);
      
      // Highlight current node
      if (graphInstance.hasNode(nodeId)) {
        graphInstance.setNodeAttribute(nodeId, 'color', '#0ea5e9'); // Blue
        graphInstance.setNodeAttribute(nodeId, 'size', 10);
      }
      
      // If not the last node, highlight the edge to the next node
      if (i < path.length - 1) {
        const nextNodeId = String(path[i + 1]);
        // Use imported findEdgeId function or utility
        const edgeId = findEdgeId(nodeId, nextNodeId);
        
        if (edgeId) {
          // Check if this is a duplicated edge (find in duplicatedEdges array)
          const isDuplicated = duplicatedEdges.some(e => 
            (e.source === nodeId && e.target === nextNodeId) || 
            (e.source === nextNodeId && e.target === nodeId)
          );
          
          if (isDuplicated) {
            // Highlight duplicated edges with a different color (red)
            graphInstance.setEdgeAttribute(edgeId, 'color', '#ef4444');
            graphInstance.setEdgeAttribute(edgeId, 'size', 3);
          } else {
            // Normal path edge (blue)
            graphInstance.setEdgeAttribute(edgeId, 'color', '#0ea5e9');
            graphInstance.setEdgeAttribute(edgeId, 'size', 3);
          }
          
          // Show weight if available
          const weight = graphInstance.getEdgeAttribute(edgeId, 'weight');
          if (weight !== undefined) {
            graphInstance.setEdgeAttribute(edgeId, 'label', weight.toString());
          }
        }
      }
    }
    
    // If path is a circuit (ends where it starts), highlight the last edge too
    if (path.length > 2 && path[0] === path[path.length - 1]) {
      const startNodeId = String(path[0]);
      const endNodeId = String(path[path.length - 2]);
      const edgeId = findEdgeId(startNodeId, endNodeId);
      
      if (edgeId) {
        graphInstance.setEdgeAttribute(edgeId, 'color', '#0ea5e9');
        graphInstance.setEdgeAttribute(edgeId, 'size', 3);
      }
    }
    
    // Make sure sigma refreshes
    const sigmaInstance = SigmaCore.getInstance();
    if (sigmaInstance) {
      sigmaInstance.refresh();
    }
  } catch (error) {
  }
};

/**
 * Find edge ID between two nodes (helper function)
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @return {string|null} Edge ID or null if not found
 */
const findEdgeId = (source, target) => {
  const graphInstance = SigmaCore.getGraph();
  if (!graphInstance) return null;
  
  let edgeId = null;
  
  // Check if the direct lookup method is available
  try {
    return graphInstance.edge(source, target);
  } catch (e) {
    // If direct lookup fails, try reverse direction for undirected graphs
    try {
      return graphInstance.edge(target, source);
    } catch (e2) {
      // If both direct lookups fail, fall back to iteration
    }
  }
  
  // Fall back to iteration
  graphInstance.forEachEdge((id, attributes, sourceId, targetId) => {
    if (edgeId) return false; // Early exit if we found an edge
    
    // Convert to strings for comparison
    const sid = String(sourceId);
    const tid = String(targetId);
    
    // Check both directions since we're not sure if the graph is directed
    if ((sid === source && tid === target) || (sid === target && tid === source)) {
      edgeId = id;
      return false; // Break the forEach loop
    }
  });
  
  return edgeId;
};

/**
 * Handle animation
 */
const handleAnimation = async () => {
  const path = getState('euler.path');
  if (!path) return;
  
  try {
    // Show notification
    showNotification('Animating Euler path...');
    
    // Disable animate button during animation
    const animateBtn = $('#animate');
    if (animateBtn) {
      animateBtn.disabled = true;
    }
    
    // Animate the path
    await SigmaAnimation.animatePath(path, 800);
    
    // Re-enable button
    if (animateBtn) {
      animateBtn.disabled = false;
    }
    
    // Show completion notification
    showNotification('Animation complete!');
  } catch (error) {
    showNotification(`Animation error: ${error.message}`);
    
    // Re-enable button
    const animateBtn = $('#animate');
    if (animateBtn) {
      animateBtn.disabled = false;
    }
  }
};

/**
 * Handle export
 */
const handleExport = async () => {
  try {
    // Show notification
    showNotification('Exporting graph image...');
    
    // Export the image
    await SigmaExport.exportImage();
    
    // Show success notification
    showNotification('Graph exported successfully!');
  } catch (error) {
    showNotification(`Export error: ${error.message}`);
  }
};

/**
 * Toggle visual creation mode
 * @param {boolean} enabled - Whether visual creation is enabled
 */
export const toggleSigmaVisualCreation = (enabled) => {
  // Update feature settings
  visualFeatures.enableVisualCreation = enabled;
  
  // Update the state
  setState('ui.visualFeatures', { ...visualFeatures });
};

/**
 * Toggle physics-based force layout
 * @param {boolean} enabled - Whether force layout is enabled
 */
export const toggleSigmaForceLayout = (enabled) => {
  // Update feature settings
  visualFeatures.enableForceLayout = enabled;
  
  // Update the state
  setState('ui.visualFeatures', { ...visualFeatures });
  
  // Get the adapter functions
  const sigmaAdapter = SigmaCore.getInstance();
  const graphInstance = SigmaCore.getGraph();

  try {
    if (enabled) {
      // If enabled, initialize the force layout
      SigmaLayout.init();
    } else {
      // If disabled, stop the force layout
      const forceLayout = SigmaLayout.get();
      if (forceLayout) {
        forceLayout.stop();
      }
    }
  } catch (error) {
  }
};

/**
 * Set the graph layout
 * @param {string} layoutName - Layout name
 */
export const setSigmaLayout = (layoutName) => {
  // Apply the layout
  SigmaRenderer.applyLayout(layoutName);
};

/**
 * Add a random node with connections to the graph
 */
export const addSigmaRandomNode = () => {
  if (!graph) return;
  
  // Generate a unique ID
  const nodeId = `n${Date.now()}`;
  
  // Add the node
  graph.addNode({ id: nodeId });
  
  // Get all nodes
  const nodes = graph.getAllNodes();
  
  // If there are other nodes, connect to a random one
  if (nodes.length > 1) {
    // Find a random node to connect to
    const otherNodes = nodes.filter(n => n.id !== nodeId);
    const randomIndex = Math.floor(Math.random() * otherNodes.length);
    const targetNode = otherNodes[randomIndex];
    
    // Add an edge
    graph.addEdge(nodeId, targetNode.id);
  }
  
  // Update the visualization
  updateGraph();
};

/**
 * Update the edge list textarea from the graph
 */
export const updateSigmaEdgeListFromGraph = () => {
  const edgeInput = $('#edges');
  if (!edgeInput) return;
  
  // Get all edges
  const edges = graph.getAllEdges();
  
  // Generate edge string
  let edgeStr = '';
  
  if (graph.weighted) {
    edgeStr = edges.map(e => `[${e.source},${e.target},${e.weight}]`).join(',');
  } else {
    edgeStr = edges.map(e => `[${e.source},${e.target}]`).join(',');
  }
  
  // Update the input
  edgeInput.value = edgeStr;
};

/**
 * Delete selected elements
 */
export const deleteSigmaSelected = () => {
  // Get selected nodes and edges
  const selectedNodes = SigmaSelection.getNodes();
  const selectedEdges = SigmaSelection.getEdges();

  // Delete selected edges first
  selectedEdges.forEach(edge => {
    SigmaSelection.deleteEdge(edge);
  });

  // Then delete selected nodes
  selectedNodes.forEach(node => {
    SigmaSelection.deleteNode(node);
  });
  
  // Update the visualization
  updateGraph();
  
  // Update the edge list input
  updateSigmaEdgeListFromGraph();
};

/**
 * Set properties for all selected nodes
 * @param {Object} properties - Properties to set
 */
export const setSigmaSelectedNodeProperties = (properties) => {
  const selectedNodes = SigmaSelection.getNodes();
  SigmaProperties.setBulkNodeProps(selectedNodes, properties);
};

/**
 * Set properties for all selected edges
 * @param {Object} properties - Properties to set
 */
export const setSigmaSelectedEdgeProperties = (properties) => {
  const selectedEdges = SigmaSelection.getEdges();
  SigmaProperties.setBulkEdgeProps(selectedEdges, properties);
};

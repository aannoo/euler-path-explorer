/**
 * Sigma.js Adapter
 * Connects EULER graph model with Sigma.js visualization
 */

// Import required libraries
import { Sigma } from 'sigma';
import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import circular from 'graphology-layout/circular';
import random from 'graphology-layout/random';
import { downloadAsImage } from '@sigma/export-image';
import { setState, getState, subscribe } from '../core/state.js';
import ForceSupervisor from 'graphology-layout-force/worker';
import { v4 as uuid } from 'uuid';

// Default attributes for new nodes and edges
const DEFAULT_NODE_ATTRIBUTES = {
  size: 10,
  color: '#FFDD00',
  label: '',
  x: 0,
  y: 0
};

const DEFAULT_EDGE_ATTRIBUTES = {
  size: 5,
  color: '#FF5A1F',
  label: '',
  type: 'line'
};

// Selection highlight constants
const SELECTION_NODE_SIZE = 14;
const SELECTION_EDGE_SIZE = 6;
const SELECTION_COLOR = '#ffdd00';

// Directed edge size (arrows need to be larger)
const DIRECTED_EDGE_SIZE = 7;

// Editable property definitions
const EDITABLE_NODE_PROPERTIES = [
  { name: 'label', type: 'string', label: 'Label' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'size', type: 'number', label: 'Size', min: 4, max: 24 },
  { name: 'fixed', type: 'boolean', label: 'Fixed Position' }
];

const EDITABLE_EDGE_PROPERTIES = [
  { name: 'label', type: 'string', label: 'Label' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'size', type: 'number', label: 'Size', min: 2, max: 12 },
  { name: 'type', type: 'select', label: 'Type', options: ['line', 'arrow', 'dashed'] }
];

// Simple color utility for random colors (replacing chroma-js)
const randomColor = {
  hex: () => {
    // Predefined set of visually distinct colors suitable for graph nodes
    const colors = [
      '#FF5A1F', // Orange
      '#FF8F29', // Light Orange
      '#FFDD00', // Yellow
      '#00C781', // Green
      '#4199E1', // Blue
      '#9B59B6', // Purple
      '#E74C3C', // Red
      '#1ABC9C', // Teal
      '#34495E', // Dark Blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
};

// Instance references
let sigmaInstance = null;
let graphInstance = null;
let forceLayout = null;
let containerElement = null;
let registeredIntervals = [];
let lastKnownGoodCameraPosition = { x: 0, y: 0 };

// Track current animation state to prevent overlapping animations
let currentAnimation = null;

// Track selected elements
let selectedNodes = new Set();
let selectedEdges = new Set();

// Global event listener management
let globalEventListenersAdded = false;

// Simple debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Global keydown handler for deletion - defined as function to allow removal
const handleKeyDown = function(e) {
  // Only handle if sigma is initialized and we're not in an input field
  if (!sigmaInstance || !graphInstance) return;
  
  // Delete key pressed
  if (e.key === "Delete" || e.key === "Backspace") {
    // Check if we have focus on an input field
    const activeElement = document.activeElement;
    const isInput = activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'TEXTAREA' || 
                    activeElement.isContentEditable;
    
    // Only delete if not focused on an input
    if (!isInput) {
      deleteSelectedElements();
    }
  }
};

/**
 * Sync Sigma graph back to text input
 * @private
 */
const updateSigmaEdgeListFromGraph = () => {
  const edgeInput = document.querySelector('#edges');
  if (!edgeInput || !graphInstance) return;
  
  // Get all edges from the graph using labels instead of IDs
  const edges = [];
  graphInstance.forEachEdge((edge, attributes, source, target) => {
    // Get node labels for better readability
    const sourceLabel = graphInstance.getNodeAttribute(source, 'label') || source;
    const targetLabel = graphInstance.getNodeAttribute(target, 'label') || target;
    
    edges.push({ 
      source: sourceLabel, 
      target: targetLabel, 
      weight: attributes.weight || 1 
    });
  });
  
  // Check if graph is weighted by looking at state
  const isWeighted = getState('graph.weighted');
  
  // Generate edge string
  let edgeStr = '';
  if (isWeighted) {
    edgeStr = edges.map(e => `[${e.source},${e.target},${e.weight}]`).join(',');
  } else {
    edgeStr = edges.map(e => `[${e.source},${e.target}]`).join(',');
  }
  
  // Update the input
  edgeInput.value = edgeStr;
};

/**
 * Initialize Sigma.js in container
 * @param {string|Element} container - Container element or selector
 * @param {Object} [options] - Sigma.js options
 * @return {Sigma} Sigma instance
 */
export const initializeSigma = (container, options = {}) => {
  // Store container element
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
  } else {
    containerElement = container;
  }
  
  if (!containerElement) {
    console.error('Sigma container not found');
    return null;
  }
  
  // Create graph instance
  graphInstance = new Graph();
  
  // Initialize Sigma with default options
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
  
  // Create Sigma instance
  try {
    sigmaInstance = new Sigma(graphInstance, containerElement, defaultOptions);
    
    // Add global event handlers only once
    if (!globalEventListenersAdded) {
      document.addEventListener('keydown', handleKeyDown);
      globalEventListenersAdded = true;
    }
    
    // Reset global state
    selectedNodes.clear();
    selectedEdges.clear();
    
    // Set up core functionality
    setupSigmaEnvironment();
    
    // Initialize force layout if enabled
    const enableForceLayout = options.enableForceLayout !== false;
    if (enableForceLayout) {
      initForceLayout();
    }
    
    // Add reset button
    addResetButton();

    // Subscribe to graph control events
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
  // Initialize selection tracking
    setupSelectionTracking();
    
  // Set camera zoom limits
    if (sigmaInstance.getCamera) {
      const camera = sigmaInstance.getCamera();
    camera.minRatio = 0.2;  // Maximum zoom out
    camera.maxRatio = 5.0;  // Maximum zoom in
    
    // Setup camera boundary checks
    setupCameraBoundaries();
  }
  
  // Setup interaction handlers
  initDragAndDrop();
  initVisualCreation();
  initDeletionFunctionality();
  initPropertyEditing();
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
  // Check boundary once on initial render
  setTimeout(() => enforceCameraBoundaries(), 500);
  
  // Only check boundaries after camera movements with debouncing
  let boundaryCheckTimeout = null;
  
  const checkBoundariesDebounced = () => {
    if (boundaryCheckTimeout) clearTimeout(boundaryCheckTimeout);
    boundaryCheckTimeout = setTimeout(() => {
      enforceCameraBoundaries();
    }, 100); // Check 100ms after camera stops moving
  };
  
  // Listen to camera updates instead of polling
  if (sigmaInstance && sigmaInstance.getCamera) {
    sigmaInstance.getCamera().on('updated', checkBoundariesDebounced);
    
    // Store cleanup function
    registeredIntervals.push(() => {
      if (boundaryCheckTimeout) clearTimeout(boundaryCheckTimeout);
      if (sigmaInstance && sigmaInstance.getCamera) {
        sigmaInstance.getCamera().off('updated', checkBoundariesDebounced);
      }
    });
  }
}

/**
 * Set up selection tracking
 * @private
 */
function setupSelectionTracking() {
  // Initialize state with empty selection
  setState('ui.selectedNodes', []);
  setState('ui.selectedEdges', []);
  setState('ui.propertyEditing', {
    active: false,
    selectedNodes: [],
    selectedEdges: [],
    editableNodeProperties: EDITABLE_NODE_PROPERTIES,
    editableEdgeProperties: EDITABLE_EDGE_PROPERTIES
  });
}

/**
 * Initialize physics-based force layout
 * @public
 */
export function initForceLayout() {
  if (!graphInstance) return;
  
  try {
    // Create and start force layout
    forceLayout = new ForceSupervisor(graphInstance, { 
      isNodeFixed: (_, attr) => attr.highlighted || attr.fixed,
      // Add a tick callback to maintain selection state during physics updates
      onNodeDragEnd: () => {
        // Ensure selected nodes maintain their visual highlighting
        selectedNodes.forEach(nodeId => {
          if (graphInstance.hasNode(nodeId)) {
            graphInstance.setNodeAttribute(nodeId, "color", SELECTION_COLOR);
            graphInstance.setNodeAttribute(nodeId, "size", SELECTION_NODE_SIZE);
            graphInstance.setNodeAttribute(nodeId, "zIndex", 10);
          }
        });

        // Ensure selected edges maintain their visual highlighting
        selectedEdges.forEach(edgeId => {
          if (graphInstance.hasEdge(edgeId)) {
            graphInstance.setEdgeAttribute(edgeId, "color", SELECTION_COLOR);
            graphInstance.setEdgeAttribute(edgeId, "size", SELECTION_EDGE_SIZE);
          }
        });
      },
      settings: {
        springLength: 80,
        springCoeff: 0.0008,
        gravity: 0.0001,
        theta: 0.8,
        dragCoeff: 0.02
      }
    });
    forceLayout.start();

    // PERFORMANCE FIX: Auto-stop force layout after 3 seconds to prevent CPU drain
    // The graph should stabilize within this time; users can manually restart if needed
    setTimeout(() => {
      if (forceLayout && forceLayout.isRunning()) {
        forceLayout.stop();
      }
    }, 3000);
  } catch (error) {
    console.error('Error initializing force layout:', error);
    forceLayout = null;
  }
}

/**
 * Get the current force layout instance
 * @return {ForceSupervisor|null} Force layout instance or null if not initialized
 */
export const getForceLayout = () => forceLayout;

/**
 * Pause the force layout to improve performance during interactions
 * @public
 */
export const pauseForceLayout = () => {
  if (forceLayout && forceLayout.isRunning()) {
    forceLayout.stop();
  }
};

/**
 * Resume the force layout after interactions
 * @public
 */
export const resumeForceLayout = () => {
  if (forceLayout && !forceLayout.isRunning()) {
    forceLayout.start();
    // PERFORMANCE FIX: Auto-stop after 3 seconds
    setTimeout(() => {
      if (forceLayout && forceLayout.isRunning()) {
        forceLayout.stop();
      }
    }, 3000);
  }
};

/**
 * Initialize drag and drop functionality
 * @private
 */
function initDragAndDrop() {
  if (!sigmaInstance || !graphInstance) return;
  
  // State for drag'n'drop
  let draggedNode = null;
  let isDragging = false;
  
  // On mouse down on a node
  // - we enable the drag mode
  // - save the dragged node in the state
  // - highlight the node
  sigmaInstance.on("downNode", (e) => {
    isDragging = true;
    draggedNode = e.node;
    
    // Pause force layout during drag for better performance
    pauseForceLayout();
    
    // Mark the node as highlighted to prevent it from moving with the force layout
    graphInstance.setNodeAttribute(draggedNode, "highlighted", true);
    
    // Visual feedback - change color to highlight
    const originalColor = graphInstance.getNodeAttribute(draggedNode, "color");
    graphInstance.setNodeAttribute(draggedNode, "originalColor", originalColor);
    graphInstance.setNodeAttribute(draggedNode, "color", "#ffdd00");
    
    // Set custom bounding box to prevent auto-rescaling during drag
    if (!sigmaInstance.getCustomBBox()) sigmaInstance.setCustomBBox(sigmaInstance.getBBox());
  });
  
  // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
  sigmaInstance.on("moveBody", (e) => {
    if (!isDragging || !draggedNode) return;
    
    // Handle different event structures
    const event = e.event || e;
    
    // Get new position of node
    const pos = sigmaInstance.viewportToGraph(event);
    
    graphInstance.setNodeAttribute(draggedNode, "x", pos.x);
    graphInstance.setNodeAttribute(draggedNode, "y", pos.y);
    
    // Prevent sigma from moving camera - safely handle different event structures
    if (typeof event.preventSigmaDefault === 'function') {
      event.preventSigmaDefault();
    }
    
    // Handle different event structures for original event
    const originalEvent = e.original || event.original || event;
    if (originalEvent && typeof originalEvent.preventDefault === 'function') {
      originalEvent.preventDefault();
    }
    if (originalEvent && typeof originalEvent.stopPropagation === 'function') {
      originalEvent.stopPropagation();
    }
  });
  
  // On mouse up, we reset the dragging mode
  const handleUp = () => {
    if (draggedNode) {
      // Remove highlighted attribute so force layout can affect it again
      graphInstance.removeNodeAttribute(draggedNode, "highlighted");
      
      // Restore original color if it exists
      if (graphInstance.hasNodeAttribute(draggedNode, "originalColor")) {
        const origColor = graphInstance.getNodeAttribute(draggedNode, "originalColor");
        graphInstance.setNodeAttribute(draggedNode, "color", origColor);
        graphInstance.removeNodeAttribute(draggedNode, "originalColor");
      } else {
        graphInstance.setNodeAttribute(draggedNode, "color", "#ff5a1f");
      }
      
      // Resume force layout after a short delay
      setTimeout(() => resumeForceLayout(), 1000);
    }
    isDragging = false;
    draggedNode = null;
  };
  
  sigmaInstance.on("upNode", handleUp);
  sigmaInstance.on("upStage", handleUp);
  
}

/**
 * Initialize visual graph creation functionality
 * @private
 */
function initVisualCreation() {
  if (!sigmaInstance || !graphInstance) return;
  
  // When clicking on the stage, behavior depends on editor mode and selection
  sigmaInstance.on("clickStage", (e) => {
    const editorMode = getState('ui.editorMode');
    
    // Only allow stage interaction in visual mode
    if (editorMode !== 'visual') {
      return; // Completely disable stage clicking in text mode
    }
    
    if (selectedNodes.size === 1) {
      // Visual mode with one node selected: add new node and connect to selected
      const event = e.event || e;
      const pos = sigmaInstance.viewportToGraph({ x: event.x, y: event.y });
      const nodeId = uuid();
      const selectedNodeId = Array.from(selectedNodes)[0];
      
      // Generate a better label for the new node
      const existingNodes = graphInstance.nodes();
      const existingLabels = existingNodes.map(id => {
        const label = graphInstance.getNodeAttribute(id, 'label');
        return label || id;
      });
      
      // Find next available single letter (a, b, c, etc.)
      let newLabel = '';
      for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(97 + i); // 'a' + i
        if (!existingLabels.includes(letter)) {
          newLabel = letter;
          break;
        }
      }
      
      // If all letters taken, use a number
      if (!newLabel) {
        let num = 1;
        while (existingLabels.includes(num.toString())) {
          num++;
        }
        newLabel = num.toString();
      }
      
      // Create new node with proper styling
      graphInstance.addNode(nodeId, {
        x: pos.x,
        y: pos.y,
        size: DEFAULT_NODE_ATTRIBUTES.size,
        color: DEFAULT_NODE_ATTRIBUTES.color,
        label: newLabel
      });
      
      // Connect to selected node with proper styling
      graphInstance.addEdge(selectedNodeId, nodeId, {
        size: DEFAULT_EDGE_ATTRIBUTES.size,
        color: DEFAULT_EDGE_ATTRIBUTES.color
      });
      
      // Clear selection and refresh
      clearSelection();
      setState('ui.selectedNodes', []);
      setState('ui.selectedEdges', []);
      sigmaInstance.refresh();
      
      // Sync back to text input
      updateSigmaEdgeListFromGraph();
      
      // Also update visual editor display if in visual mode
      if (typeof window !== 'undefined' && window.updateEdgeListDisplay) {
        window.updateEdgeListDisplay();
      }
      
    }
    // If visual mode with no selection or multiple selections, do nothing
  });
}

/**
 * Initialize node and edge deletion functionality
 * @private
 */
function initDeletionFunctionality() {
  if (!sigmaInstance || !graphInstance) return;
  
  // Selection state
  selectedNodes = new Set();
  selectedEdges = new Set();
  
  // Node click handler for selection
  sigmaInstance.on("clickNode", (e) => {
    // Debug event structure
    
    const nodeId = e.node;
    const editorMode = getState('ui.editorMode');
    
    // Only allow node interaction in visual mode
    if (editorMode !== 'visual') {
      return; // Completely disable node clicking in text mode
    }
    
    // Safely check for modifier keys - handle both old and new event structure
    const isMultiSelect = (e.original && (e.original.ctrlKey || e.original.metaKey)) || 
                          (e.event && (e.event.ctrlKey || e.event.metaKey)) || 
                          (e.ctrlKey || e.metaKey);
    
    // STEP 3: Visual mode edge creation - if in visual mode and one node already selected
    if (!isMultiSelect && selectedNodes.size === 1 && !selectedNodes.has(nodeId)) {
      const firstNodeId = Array.from(selectedNodes)[0];
      
      // Create edge between first selected node and clicked node
      try {
        graphInstance.addEdge(firstNodeId, nodeId, {
          size: DEFAULT_EDGE_ATTRIBUTES.size,
          color: DEFAULT_EDGE_ATTRIBUTES.color
        });
        
        // Clear selection after creating edge
        clearSelection();
        setState('ui.selectedNodes', []);
        setState('ui.selectedEdges', []);
        
        // Refresh visualization
        sigmaInstance.refresh();
        
        // Sync back to text input
        updateSigmaEdgeListFromGraph();
        
        // Also update visual editor display if in visual mode
        if (typeof window !== 'undefined' && window.updateEdgeListDisplay) {
          window.updateEdgeListDisplay();
        }
        
      } catch (error) {
        console.error('Error creating edge:', error);
      }
      
      // Prevent further processing
      e.preventSigmaDefault();
      return;
    }
    
    // Handle selection with Ctrl key for multiple selection
    if (isMultiSelect) {
      // Toggle selection
      if (selectedNodes.has(nodeId)) {
        selectedNodes.delete(nodeId);
        // Remove highlight styling
        if (graphInstance.hasNodeAttribute(nodeId, "selected")) {
          graphInstance.removeNodeAttribute(nodeId, "selected");
          graphInstance.setNodeAttribute(nodeId, "color", DEFAULT_NODE_ATTRIBUTES.color);
          graphInstance.setNodeAttribute(nodeId, "size", DEFAULT_NODE_ATTRIBUTES.size);
        }
      } else {
        selectedNodes.add(nodeId);
        // Add highlight styling with a more distinct appearance
        graphInstance.setNodeAttribute(nodeId, "selected", true);
        graphInstance.setNodeAttribute(nodeId, "color", SELECTION_COLOR);
        graphInstance.setNodeAttribute(nodeId, "size", SELECTION_NODE_SIZE);
        // Add a border effect by setting zIndex higher so selected nodes appear on top
        graphInstance.setNodeAttribute(nodeId, "zIndex", 10);
      }
    } else {
      // Clear previous selection
      clearSelection();

      // Select only this node
      selectedNodes.add(nodeId);
      graphInstance.setNodeAttribute(nodeId, "selected", true);
      graphInstance.setNodeAttribute(nodeId, "color", SELECTION_COLOR);
      graphInstance.setNodeAttribute(nodeId, "size", SELECTION_NODE_SIZE);
      // Add a border effect by setting zIndex higher so selected nodes appear on top
      graphInstance.setNodeAttribute(nodeId, "zIndex", 10);
    }
    
    // Notify state change
    setState('ui.selectedNodes', Array.from(selectedNodes));
    setState('ui.selectedEdges', Array.from(selectedEdges));
    
    // Prevent further propagation to allow drag and drop to work correctly
    e.preventSigmaDefault();
  });
  
  // Edge click handler for selection
  sigmaInstance.on("clickEdge", (e) => {
    // Debug event structure
    
    const edgeId = e.edge;
    const editorMode = getState('ui.editorMode');
    
    // Only allow edge interaction in visual mode
    if (editorMode !== 'visual') {
      return; // Completely disable edge clicking in text mode
    }
    
    // Safely check for modifier keys - handle both old and new event structure
    const isMultiSelect = (e.original && (e.original.ctrlKey || e.original.metaKey)) || 
                          (e.event && (e.event.ctrlKey || e.event.metaKey)) || 
                          (e.ctrlKey || e.metaKey);
    
    // Handle selection with Ctrl key for multiple selection
    if (isMultiSelect) {
      // Toggle selection
      if (selectedEdges.has(edgeId)) {
        selectedEdges.delete(edgeId);
        // Remove highlight styling
        if (graphInstance.hasEdgeAttribute(edgeId, "selected")) {
          graphInstance.removeEdgeAttribute(edgeId, "selected");
          graphInstance.setEdgeAttribute(edgeId, "color", DEFAULT_EDGE_ATTRIBUTES.color);
          graphInstance.setEdgeAttribute(edgeId, "size", DEFAULT_EDGE_ATTRIBUTES.size);
        }
      } else {
        selectedEdges.add(edgeId);
        // Add highlight styling
        graphInstance.setEdgeAttribute(edgeId, "selected", true);
        graphInstance.setEdgeAttribute(edgeId, "color", SELECTION_COLOR);
        graphInstance.setEdgeAttribute(edgeId, "size", SELECTION_EDGE_SIZE);
      }
    } else {
      // Clear previous selection
      clearSelection();

      // Select only this edge
      selectedEdges.add(edgeId);
      graphInstance.setEdgeAttribute(edgeId, "selected", true);
      graphInstance.setEdgeAttribute(edgeId, "color", SELECTION_COLOR);
      graphInstance.setEdgeAttribute(edgeId, "size", SELECTION_EDGE_SIZE);
    }
    
    // Notify state change
    setState('ui.selectedNodes', Array.from(selectedNodes));
    setState('ui.selectedEdges', Array.from(selectedEdges));
    
    // Prevent default to avoid camera movement
    e.preventSigmaDefault();
  });
  
  // Stage click handler to clear selection when clicking on empty space
  sigmaInstance.on("clickStage", (e) => {
    // Debug event structure
    
    // Safely check for modifier keys - handle both old and new event structure
    const isMultiSelect = (e.original && (e.original.ctrlKey || e.original.metaKey)) || 
                          (e.event && (e.event.ctrlKey || e.event.metaKey)) || 
                          (e.ctrlKey || e.metaKey);
    
    // Only clear selection if not in visual creation mode and not holding Ctrl
    if (!isMultiSelect) {
      clearSelection();
      
      // Notify state change
      setState('ui.selectedNodes', []);
      setState('ui.selectedEdges', []);
    }
  });
  
  // Note: Delete key handling is already managed by the global handleKeyDown function
  // No need for duplicate event listener here
}

/**
 * Clear all selections
 * @private
 */
function clearSelection() {
  if (!graphInstance) return;

  // Start batch operation
  graphInstance.emit('startBatch');

  // Clear node selections
  selectedNodes.forEach(nodeId => {
    if (graphInstance.hasNode(nodeId)) {
      graphInstance.removeNodeAttribute(nodeId, "selected");
      graphInstance.setNodeAttribute(nodeId, "color", DEFAULT_NODE_ATTRIBUTES.color);
      graphInstance.setNodeAttribute(nodeId, "size", DEFAULT_NODE_ATTRIBUTES.size);
      // Reset z-index
      graphInstance.removeNodeAttribute(nodeId, "zIndex");
    }
  });

  // Clear edge selections
  selectedEdges.forEach(edgeId => {
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.removeEdgeAttribute(edgeId, "selected");
      graphInstance.setEdgeAttribute(edgeId, "color", DEFAULT_EDGE_ATTRIBUTES.color);
      graphInstance.setEdgeAttribute(edgeId, "size", DEFAULT_EDGE_ATTRIBUTES.size);
    }
  });

  // End batch operation
  graphInstance.emit('endBatch');

  // Reset selection state
  selectedNodes.clear();
  selectedEdges.clear();
}

/**
 * Delete selected nodes and edges
 * @public
 */
export function deleteSelectedElements() {
  if (!graphInstance) return;
  
  // Start batch operation
  graphInstance.emit('startBatch');
  
  // First delete selected edges
  selectedEdges.forEach(edgeId => {
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.dropEdge(edgeId);
    }
  });
  
  // Then delete selected nodes (this will also remove connected edges)
  selectedNodes.forEach(nodeId => {
    if (graphInstance.hasNode(nodeId)) {
      graphInstance.dropNode(nodeId);
    }
  });
  
  // End batch operation
  graphInstance.emit('endBatch');
  
  // Clear selection state
  selectedNodes.clear();
  selectedEdges.clear();
  
  // Notify state change
  setState('ui.selectedNodes', []);
  setState('ui.selectedEdges', []);
  
  // Refresh the visualization
  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
}

/**
 * Delete a node by ID
 * @param {string} nodeId - ID of the node to delete
 * @returns {boolean} true if deleted, false if not found
 */
export const deleteNode = (nodeId) => {
  if (!graphInstance || !nodeId) return false;
  
  if (graphInstance.hasNode(nodeId)) {
    graphInstance.dropNode(nodeId);
    
    // Remove from selection if selected
    if (selectedNodes.has(nodeId)) {
      selectedNodes.delete(nodeId);
      setState('ui.selectedNodes', Array.from(selectedNodes));
    }
    
    // Refresh the visualization
    if (sigmaInstance) {
      sigmaInstance.refresh();
    }
    
    return true;
  }
  
  return false;
};

/**
 * Delete an edge by ID
 * @param {string} edgeId - ID of the edge to delete
 * @returns {boolean} true if deleted, false if not found
 */
export const deleteEdge = (edgeId) => {
  if (!graphInstance || !edgeId) return false;
  
  if (graphInstance.hasEdge(edgeId)) {
    graphInstance.dropEdge(edgeId);
    
    // Remove from selection if selected
    if (selectedEdges.has(edgeId)) {
      selectedEdges.delete(edgeId);
      setState('ui.selectedEdges', Array.from(selectedEdges));
    }
    
    // Refresh the visualization
    if (sigmaInstance) {
      sigmaInstance.refresh();
    }
    
    return true;
  }
  
  return false;
};

/**
 * Delete an edge by source and target node IDs
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @returns {boolean} true if deleted, false if not found
 */
export const deleteEdgeByNodes = (source, target) => {
  if (!graphInstance || !source || !target) return false;
  
  try {
    // Try to find the edge in both directions (for undirected graphs)
    let edgeId = null;
    
    try {
      edgeId = graphInstance.edge(source, target);
    } catch (e) {
      try {
        edgeId = graphInstance.edge(target, source);
      } catch (e2) {
        return false; // Edge not found in either direction
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
 * @returns {Array} Array of selected node IDs
 */
export const getSelectedNodes = () => {
  return Array.from(selectedNodes);
};

/**
 * Get currently selected edges
 * @returns {Array} Array of selected edge IDs
 */
export const getSelectedEdges = () => {
  return Array.from(selectedEdges);
};

/**
 * Initialize property editing functionality
 * @private
 */
function initPropertyEditing() {
  if (!sigmaInstance || !graphInstance) return;
  
  // Set up state for property editing
  setState('ui.propertyEditing', {
    active: false,
    selectedNodes: [],
    selectedEdges: [],
    editableNodeProperties: EDITABLE_NODE_PROPERTIES,
    editableEdgeProperties: EDITABLE_EDGE_PROPERTIES
  });
  
  // Selection change handler to update property editing state
  const handleSelectionChange = () => {
    // Update the property editing state with current selection
    setState('ui.propertyEditing', {
      active: selectedNodes.size > 0 || selectedEdges.size > 0,
      selectedNodes: Array.from(selectedNodes),
      selectedEdges: Array.from(selectedEdges),
      editableNodeProperties: EDITABLE_NODE_PROPERTIES,
      editableEdgeProperties: EDITABLE_EDGE_PROPERTIES
    });
  };
  
  // Add event listeners to track selection changes
  sigmaInstance.on('clickNode', () => {
    // Update after click handlers are processed
    setTimeout(handleSelectionChange, 0);
  });
  
  sigmaInstance.on('clickEdge', () => {
    // Update after click handlers are processed
    setTimeout(handleSelectionChange, 0);
  });
  
  sigmaInstance.on('clickStage', () => {
    // Update after click handlers are processed
    setTimeout(handleSelectionChange, 0);
  });
}

/**
 * Get properties of a node or edge
 * @param {string} id - ID of the element
 * @param {string} type - Type of element ('node' or 'edge')
 * @returns {Object|null} Properties or null if not found
 */
export const getElementProperties = (id, type) => {
  if (!graphInstance || !id) return null;
  
  if (type === 'node') {
    return graphInstance.hasNode(id) ? graphInstance.getNodeAttributes(id) : null;
  } else if (type === 'edge') {
    return graphInstance.hasEdge(id) ? graphInstance.getEdgeAttributes(id) : null;
  }
  
  return null;
};

/**
 * Set properties for a node or edge
 * @param {string} id - ID of the element
 * @param {Object} properties - Properties to set
 * @param {string} type - Type of element ('node' or 'edge')
 * @returns {boolean} True if successful, false otherwise
 */
export const setElementProperties = (id, properties, type) => {
  if (!graphInstance || !id) return false;
  
  const hasElement = type === 'node' ? graphInstance.hasNode(id) : graphInstance.hasEdge(id);
  if (!hasElement) return false;
  
  try {
    // Start batch operation for efficiency
    graphInstance.emit('startBatch');
    
    // Apply each property
    Object.entries(properties).forEach(([key, value]) => {
      if (type === 'node') {
        graphInstance.setNodeAttribute(id, key, value);
      } else {
        graphInstance.setEdgeAttribute(id, key, value);
      }
    });
    
    // End batch operation
    graphInstance.emit('endBatch');
    
    // Refresh the visualization
    if (sigmaInstance) {
      sigmaInstance.refresh();
    }
    
    return true;
  } catch (error) {
    console.error(`Error setting ${type} properties for ${id}:`, error);
    return false;
  }
};

/**
 * Set properties for multiple elements (nodes or edges)
 * @param {Array} ids - Array of element IDs
 * @param {Object} properties - Properties to set
 * @param {string} type - Type of elements ('node' or 'edge')
 * @returns {Object} Object with success and failed counts
 */
export const setBulkElementProperties = (ids, properties, type) => {
  if (!graphInstance || !Array.isArray(ids) || ids.length === 0) {
    return { success: 0, failed: 0 };
  }
  
  let success = 0;
  let failed = 0;
  
  // Start batch operation for efficiency
  graphInstance.emit('startBatch');
  
  ids.forEach(id => {
    const hasElement = type === 'node' ? graphInstance.hasNode(id) : graphInstance.hasEdge(id);
    if (hasElement) {
      try {
        // Apply each property
        Object.entries(properties).forEach(([key, value]) => {
          if (type === 'node') {
            graphInstance.setNodeAttribute(id, key, value);
    } else {
            graphInstance.setEdgeAttribute(id, key, value);
          }
        });
        success++;
      } catch (error) {
        console.error(`Error setting bulk ${type} properties for ${id}:`, error);
        failed++;
      }
    } else {
      failed++;
    }
  });
  
  // End batch operation
  graphInstance.emit('endBatch');
  
  // Refresh the visualization
  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
  
  return { success, failed };
};

/**
 * Convert EULER graph model to data compatible with Sigma.js
 * @param {Graph} eulerGraph - EULER graph model instance
 * @return {Object} Object with nodes and edges arrays in Sigma format
 */
export const convertToGraphology = (eulerGraph) => {
  if (!eulerGraph) {
    console.error('Invalid graph model provided');
    return { nodes: [], edges: [] };
  }
  
  try {
    const nodes = eulerGraph.getAllNodes().map(node => ({
      id: String(node.id), // Ensure IDs are strings
      label: node.label || String(node.id),
      size: node.size || DEFAULT_NODE_ATTRIBUTES.size,
      color: node.color || DEFAULT_NODE_ATTRIBUTES.color,
      x: node.x !== undefined ? node.x : Math.random() * 10,
      y: node.y !== undefined ? node.y : Math.random() * 10
    }));
    
    const edges = eulerGraph.getAllEdges().map(edge => {
      // Determine edge size based on directed status
      let edgeSize = edge.size || DEFAULT_EDGE_ATTRIBUTES.size;
      if (eulerGraph.directed && !edge.size) {
        edgeSize = 6; // Use larger size for directed arrows
      }
      
      return {
        id: String(edge.id), // Ensure IDs are strings
        source: String(edge.source), // Ensure source IDs are strings
        target: String(edge.target), // Ensure target IDs are strings
        label: edge.label || '',
        size: edgeSize,
        color: edge.color || DEFAULT_EDGE_ATTRIBUTES.color,
        type: eulerGraph.directed ? 'arrow' : 'line',
        weight: edge.weight || 1
      };
    });

    return { nodes, edges };
  } catch (error) {
    console.error('Error converting graph model:', error);
    return { nodes: [], edges: [] };
  }
};

/**
 * Render the graph using the provided graph model
 * @param {Object} eulerGraph - Graph model instance
 * @param {boolean} [fit=true] - Whether to fit graph to viewport
 */
export const renderGraph = (eulerGraph, fit = true) => {
  if (!graphInstance || !sigmaInstance || !eulerGraph) {
    console.error('Cannot render graph: required instances not available');
    return;
  }
  
  try {
    // Convert our graph model to Graphology format
    const { nodes, edges } = convertToGraphology(eulerGraph);
    
    // Debug log
    
    // Clear the graph
    graphInstance.clear();
    
    // Add all nodes first
    nodes.forEach(node => {
      try {
        // Create node with generated attributes
        graphInstance.addNode(node.id, {
          ...DEFAULT_NODE_ATTRIBUTES,
          label: node.label || node.id,
          size: node.size || DEFAULT_NODE_ATTRIBUTES.size,
          color: node.color || DEFAULT_NODE_ATTRIBUTES.color,
          x: node.x || (Math.random() * 10 - 5),
          y: node.y || (Math.random() * 10 - 5)
        });
      } catch (nodeError) {
        console.error(`Error adding node ${node.id}:`, nodeError);
      }
    });
    
    // Add all edges
    edges.forEach(edge => {
      try {
        // Ensure both nodes exist before creating edge
        if (graphInstance.hasNode(edge.source) && graphInstance.hasNode(edge.target)) {
          // Create edge with generated attributes
          graphInstance.addEdge(edge.source, edge.target, {
            ...DEFAULT_EDGE_ATTRIBUTES,
            label: edge.label || (eulerGraph.weighted ? String(edge.weight) : ''),
            size: edge.size || DEFAULT_EDGE_ATTRIBUTES.size,
            color: edge.color || DEFAULT_EDGE_ATTRIBUTES.color,
            type: eulerGraph.directed ? 'arrow' : 'line',
            weight: edge.weight || 1
          });
        } else {
          console.warn(`Cannot create edge: source or target node missing (${edge.source} → ${edge.target})`);
        }
      } catch (edgeError) {
        console.error(`Error adding edge from ${edge.source} to ${edge.target}:`, edgeError);
      }
    });
    
    // Update display settings based on graph properties
    setDirected(eulerGraph.directed);
    
    // Apply a layout if the graph has just a few nodes - helps with initial render
    if (nodes.length > 0 && nodes.length < 100 && fit) {
      applyLayout('circular');
    }
    
    // Fit graph to view after short delay to allow rendering
    if (fit) {
      setTimeout(() => {
        try {
            // First, reset camera to fit the graph
  sigmaInstance.getCamera().animatedReset({ duration: 300 });
  
  // After reset completes, add a bit more padding (zoom out slightly)
  setTimeout(() => {
    const camera = sigmaInstance.getCamera();
    const currentRatio = camera.ratio;
    
    // Calculate a good zoom level with padding, but respect min/max ratio limits
    let targetRatio = currentRatio * 1.1; // Add 10% padding
    
    // Ensure we don't exceed the camera's min/max ratio limits
    if (camera.minRatio !== undefined) {
      targetRatio = Math.max(targetRatio, camera.minRatio);
    }
    if (camera.maxRatio !== undefined) {
      targetRatio = Math.min(targetRatio, camera.maxRatio);
    }
    
    // Apply the adjusted ratio
    camera.animate({ ratio: targetRatio }, { duration: 150 });
    
    // Call our boundary enforcer after the animation
    setTimeout(enforceCameraBoundaries, 200);
  }, 350); // Wait for reset animation to complete
        } catch (error) {
          console.warn('Camera reset error:', error);
        }
      }, 100);
    }
    
    // Initialize the force layout if not already running
    let enableForceLayout = true;
    try {
      // Try to get the state, defaulting to true if not found
      const featureState = getState('ui.visualFeatures');
      enableForceLayout = featureState && typeof featureState.enableForceLayout !== 'undefined' 
        ? featureState.enableForceLayout 
        : true;
    } catch (error) {
      // Default to enabled if there's an error
      enableForceLayout = true;
    }
    
    if (enableForceLayout !== false && !forceLayout) {
      initForceLayout();
    }
  } catch (error) {
    console.error('Error rendering graph:', error);
  }
};

/**
 * Apply a specific layout algorithm
 * @param {string} [layoutType='forceatlas2'] - Layout type to apply
 * @param {Object} [options={}] - Layout options
 */
export const applyLayout = (layoutType = 'forceatlas2', options = {}) => {
  if (!graphInstance) return;
  
  // Stop force layout if it's running
  if (forceLayout) {
    forceLayout.stop();
  }
  
  const layoutOptions = {
    forceatlas2: {
      iterations: 50,
      settings: {
        gravity: 1,
        scalingRatio: 2
      },
      ...options
    },
    circular: {
      scale: 100,
      ...options
    },
    random: {
      scale: 100,
      ...options
    }
  };
  
  // Apply the selected layout
  switch (layoutType) {
    case 'forceatlas2':
      forceAtlas2.assign(graphInstance, layoutOptions.forceatlas2);
      break;
    case 'circular':
      circular.assign(graphInstance, layoutOptions.circular);
      break;
    case 'grid':
      // Simple grid layout implementation
      const nodes = graphInstance.nodes();
      const nodeCount = nodes.length;
      const cols = Math.ceil(Math.sqrt(nodeCount));
      const rows = Math.ceil(nodeCount / cols);
      const spacing = options.spacing || 100;
      
      nodes.forEach((nodeId, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        graphInstance.setNodeAttribute(nodeId, 'x', (col - cols/2) * spacing);
        graphInstance.setNodeAttribute(nodeId, 'y', (row - rows/2) * spacing);
      });
      break;
    case 'random':
      random.assign(graphInstance, layoutOptions.random);
      break;
    default:
      forceAtlas2.assign(graphInstance, layoutOptions.forceatlas2);
  }
  
  // Refresh the visualization
  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
  
  // Check if force layout should be enabled
  let enableForceLayout = true;
  try {
    // Try to get the state, defaulting to true if not found
    const featureState = getState('ui.visualFeatures');
    enableForceLayout = featureState && typeof featureState.enableForceLayout !== 'undefined' 
      ? featureState.enableForceLayout 
      : true;
  } catch (error) {
    // Default to enabled if there's an error
    enableForceLayout = true;
  }
  
  // Restart force layout if it exists and should be enabled
  if (enableForceLayout !== false) {
    // If force layout doesn't exist, initialize it
    if (!forceLayout) {
      initForceLayout();
    } else {
      // Otherwise just restart it
      forceLayout.start();
      // PERFORMANCE FIX: Auto-stop after 3 seconds
      setTimeout(() => {
        if (forceLayout && forceLayout.isRunning()) {
          forceLayout.stop();
        }
      }, 3000);
    }
  }
};

/**
 * Set graph directedness
 * @param {boolean} directed - Whether the graph is directed
 */
export const setDirected = (directed) => {
  if (!graphInstance) return;
  
  
  // Convert to boolean to ensure consistent type
  directed = Boolean(directed);
  
  // Make sure to update central state if it doesn't match
  const currentState = getState('graph.directed');
  if (currentState !== directed) {
    setState('graph.directed', directed);
  }
  
  // Update all edges to use the correct edge type based on direction
  graphInstance.forEachEdge((edge, attributes, source, target) => {
    // When directed changes, we need to update the edge type
    const newType = directed ? 'arrow' : 'line';
    
    // Store the original type in the edge data if not already saved
    if (!graphInstance.hasEdgeAttribute(edge, 'originalType')) {
      const currentType = graphInstance.getEdgeAttribute(edge, 'type') || 'line';
      graphInstance.setEdgeAttribute(edge, 'originalType', currentType);
    }
    
    // Update the type
    graphInstance.setEdgeAttribute(edge, 'type', newType);
    
    // For directed graphs, make the arrows more prominent
    if (directed) {
      // Only change size if it's the default or smaller to avoid overriding custom sizes
      const currentSize = graphInstance.getEdgeAttribute(edge, 'size');
      if (!currentSize || currentSize <= DEFAULT_EDGE_ATTRIBUTES.size) {
        graphInstance.setEdgeAttribute(edge, 'size', DIRECTED_EDGE_SIZE);
      }

      // Add a visual indicator to emphasize direction
      graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
    } else {
      // Reset to default size if switching back to undirected
      graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);
      graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
    }

    // If the edge was selected, keep its highlighting
    if (selectedEdges.has(edge)) {
      graphInstance.setEdgeAttribute(edge, 'color', SELECTION_COLOR);
      graphInstance.setEdgeAttribute(edge, 'size', SELECTION_EDGE_SIZE);
    }
  });
  
  // Refresh the renderer
  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
  
};

/**
 * Highlight a path in the graph
 * @param {Array} path - Array of node IDs forming a path
 */
export const highlightPath = (path) => {
  if (!graphInstance || !sigmaInstance || !path || path.length < 2) return;
  
  // Start batch operation
  graphInstance.emit('startBatch');
  
  // Reset all node and edge colors
  graphInstance.forEachNode((node) => {
    graphInstance.setNodeAttribute(node, 'color', DEFAULT_NODE_ATTRIBUTES.color);
    graphInstance.setNodeAttribute(node, 'size', DEFAULT_NODE_ATTRIBUTES.size);
  });

  graphInstance.forEachEdge((edge) => {
    graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
    graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);

    // Make arrows bigger for directed graphs
    if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {
      graphInstance.setEdgeAttribute(edge, 'size', DIRECTED_EDGE_SIZE);
    }

    // Remove any existing weight labels when highlighting a new path
    if (graphInstance.hasEdgeAttribute(edge, 'label')) {
      graphInstance.removeEdgeAttribute(edge, 'label');
    }
  });

  // Path highlight colors
  const PATH_NODE_COLOR = '#0ea5e9';
  const PATH_NODE_SIZE = 12;
  const PATH_EDGE_COLOR = '#0ea5e9';
  const PATH_EDGE_SIZE = 4;

  // Highlight the path nodes first
  for (let i = 0; i < path.length; i++) {
    // Convert node ID to string for comparison
    const nodeId = String(path[i]);

    // Highlight current node
    if (graphInstance.hasNode(nodeId)) {
      graphInstance.setNodeAttribute(nodeId, 'color', PATH_NODE_COLOR);
      graphInstance.setNodeAttribute(nodeId, 'size', PATH_NODE_SIZE);
    }

    // If not the last node, highlight edge to next node
    if (i < path.length - 1) {
      const nextNodeId = String(path[i + 1]);
      const edgeId = findEdgeId(nodeId, nextNodeId);

      if (edgeId && graphInstance.hasEdge(edgeId)) {
        graphInstance.setEdgeAttribute(edgeId, 'color', PATH_EDGE_COLOR);
        graphInstance.setEdgeAttribute(edgeId, 'size', PATH_EDGE_SIZE);
        
        // Show weight if this is a weighted graph
        if (graphInstance.weighted) {
          const weight = graphInstance.getEdgeAttribute(edgeId, 'weight');
          if (weight !== undefined) {
            graphInstance.setEdgeAttribute(edgeId, 'label', weight.toString());
          }
        }
      }
    }
  }
  
  // End batch operation
  graphInstance.emit('endBatch');
  
  // Make sure sigma refreshes
  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
};

/**
 * Animate traversal of a path
 * @param {Array} path - Array of node IDs forming a path
 * @param {number} [delay=1000] - Delay between steps in ms
 * @return {Promise} Promise that resolves when animation is complete
 */
export const animatePath = (path, delay = 1000) => {
  if (!graphInstance || !sigmaInstance || !path || path.length < 2) {
    return Promise.resolve();
  }
  
  // Ensure all path nodes are strings for consistent comparison
  const normalizedPath = path.map(node => String(node));
  
  // Cancel any existing animation
  if (currentAnimation && typeof currentAnimation.cancel === 'function') {
    currentAnimation.cancel();
  }
  
  // Pause force layout during animation if it exists
  if (forceLayout) {
    forceLayout.stop();
  }
  
  // Start batch operation for efficiency
  graphInstance.emit('startBatch');
  
  // Reset all node and edge colors with a single batch
  graphInstance.forEachNode((node) => {
    graphInstance.setNodeAttribute(node, 'color', DEFAULT_NODE_ATTRIBUTES.color);
    graphInstance.setNodeAttribute(node, 'size', DEFAULT_NODE_ATTRIBUTES.size);
  });

  graphInstance.forEachEdge((edge) => {
    graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
    graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);
  });
  
  // End batch operation
  graphInstance.emit('endBatch');
  
  // Update animation state
  setState('animation.inProgress', true);
  setState('animation.path', normalizedPath);
  setState('animation.currentStep', 0);
  
  // Create a cancellable animation
  let isAnimationCancelled = false;
  
  const animationPromise = new Promise(resolve => {
        // Reset camera to see the whole graph
    try {
        sigmaInstance.getCamera().animatedReset({
          duration: 500,
          easing: 'cubicOut'
        });
      } catch (err) {
      console.error("Camera animation error:", err);
    }
    
    // Start the animation after camera reset
    setTimeout(() => {
      let step = 0;
      
      const animateStep = () => {
        if (isAnimationCancelled || step >= normalizedPath.length) {
          // Animation complete or cancelled
          setState('animation.inProgress', false);
          currentAnimation = null;
          
          // Restart force layout if it exists
          if (forceLayout) {
            forceLayout.start();
            // PERFORMANCE FIX: Auto-stop after 3 seconds
            setTimeout(() => {
              if (forceLayout && forceLayout.isRunning()) {
                forceLayout.stop();
              }
            }, 3000);
          }

          resolve();
          return;
        }
        
        // Update state
        setState('animation.currentStep', step);
        
        // Start batch operation
        graphInstance.emit('startBatch');
        
        // Animation constants
        const ANIM_PATH_COLOR = '#ff8f29';
        const ANIM_PATH_SIZE = 12;
        const ANIM_ACTIVE_COLOR = '#ffdd00';
        const ANIM_ACTIVE_SIZE = 16;
        const ANIM_EDGE_COLOR = '#ffdd00';
        const ANIM_EDGE_SIZE = 5;

        // Set all nodes in path to a standard highlight color
        normalizedPath.forEach(nodeId => {
          if (graphInstance.hasNode(nodeId)) {
            graphInstance.setNodeAttribute(nodeId, 'color', ANIM_PATH_COLOR);
            graphInstance.setNodeAttribute(nodeId, 'size', ANIM_PATH_SIZE);
          }
        });

        // Highlight current node with more intense color
        const currentNodeId = normalizedPath[step];
        if (graphInstance.hasNode(currentNodeId)) {
          graphInstance.setNodeAttribute(currentNodeId, 'color', ANIM_ACTIVE_COLOR);
          graphInstance.setNodeAttribute(currentNodeId, 'size', ANIM_ACTIVE_SIZE);
          
          // If there's a next node, highlight the edge between them
          if (step < normalizedPath.length - 1) {
            const nextNodeId = normalizedPath[step+1];
            if (graphInstance.hasNode(nextNodeId)) {
              // Get the graph's directed state from the central state
              const isDirected = getState('graph.directed') || false;
              
              // Use utility function to find edge ID with correct directed parameter
              const edgeId = findEdgeId(currentNodeId, nextNodeId, isDirected);
              
              if (edgeId) {
                // Highlight this edge
                graphInstance.setEdgeAttribute(edgeId, 'color', ANIM_EDGE_COLOR);
                graphInstance.setEdgeAttribute(edgeId, 'size', ANIM_EDGE_SIZE);
              }
            }
          }
        }
        
        // End batch operation
        graphInstance.emit('endBatch');
        
        // Refresh the visualization
        sigmaInstance.refresh();
        
        step++;
        setTimeout(animateStep, delay);
      };
      
      // Start animation
      animateStep();
    }, 600);
  });
  
  // Add cancel method to the promise
  animationPromise.cancel = () => {
    isAnimationCancelled = true;
  };
  
  // Store current animation
  currentAnimation = animationPromise;
  
  return animationPromise;
};

/**
 * Export the graph as an image
 * @return {Promise<Blob>} Promise that resolves to a Blob containing the image
 */
export const exportImage = () => {
  if (!sigmaInstance) return Promise.reject(new Error('Sigma not initialized'));
  
  try {
    // Use the official Sigma.js export utility directly
    return downloadAsImage(sigmaInstance, {
      // Export all layers to ensure nodes, edges and labels are included
      layers: null, // This includes all layers automatically
      // Use PNG format with dark background
      format: 'png', 
      fileName: 'sigma-graph',
      backgroundColor: '#0F172A', // Match the app background
    });
  } catch (error) {
    console.error("Export error:", error);
    return Promise.reject(error);
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
 * Enforce camera boundaries to prevent panning too far from center
 * Uses actual graph bounds instead of arbitrary thresholds
 * @public
 */
export const enforceCameraBoundaries = () => {
  if (!sigmaInstance || !graphInstance) return false;
  
  try {
    // Simple approach: check if any nodes are visible in the current view
  const camera = sigmaInstance.getCamera();
    const viewportDimensions = sigmaInstance.getDimensions();
    const nodeCount = graphInstance.order;
    
    if (nodeCount === 0) return false; // No nodes to check
    
    // We just need to find at least one visible node
    let foundVisibleNode = false;
    
    graphInstance.forEachNode((nodeId, attributes) => {
      // Skip iteration if we already found a visible node
      if (foundVisibleNode) return; // Stop iteration, but don't return false
      
      // Convert node position to screen coordinates
      const nodePosition = sigmaInstance.graphToViewport({
        x: attributes.x,
        y: attributes.y
      });
      
      const padding = 0; // pixels - reasonable buffer around viewport
      if (
        nodePosition.x >= -padding &&
        nodePosition.x <= viewportDimensions.width + padding &&
        nodePosition.y >= -padding &&
        nodePosition.y <= viewportDimensions.height + padding
      ) {
        foundVisibleNode = true;
        return; // Stop iteration once we find one visible node
      }
    });
    
    // If no nodes are visible, reset the view
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
 * Destroy the Sigma instance to prevent memory leaks
 */
export const destroySigma = () => {
  if (!sigmaInstance) return;
  
  // Clean up any debug UI elements
  const debugDiv = document.getElementById('sigma-debug-info');
  if (debugDiv) {
    debugDiv.remove();
  }
  
  // Clean up boundary handler
  if (window._boundaryHandler) {
    try {
      if (sigmaInstance && typeof sigmaInstance.off === 'function') {
        sigmaInstance.off("cameraUpdated"); // Remove all handlers for this event
      }
    } catch (e) {
      console.warn('Error removing boundary handler:', e);
    }
    delete window._boundaryHandler;
  }
  
  // Properly terminate force layout
  if (forceLayout) {
    try {
      forceLayout.stop();
      if (forceLayout.kill && typeof forceLayout.kill === 'function') {
        forceLayout.kill();
      }
      // Ensure the worker is terminated
      if (forceLayout.worker) {
        forceLayout.worker.terminate();
      }
    } catch (e) {
      console.warn('Error terminating force layout:', e);
    }
    forceLayout = null;
  }
  
  // Clear selection
  selectedNodes.clear();
  selectedEdges.clear();
  
  // Stop all animations
  if (currentAnimation && typeof currentAnimation.cancel === 'function') {
    currentAnimation.cancel();
    currentAnimation = null;
  }
  
  // Clear all registered intervals and cleanup functions
  registeredIntervals.forEach(intervalOrCleanup => {
    if (typeof intervalOrCleanup === 'function') {
      // It's a cleanup function
      intervalOrCleanup();
    } else {
      // It's an interval ID
      clearInterval(intervalOrCleanup);
    }
  });
  registeredIntervals = [];
  
  // Remove all global event listeners
  if (globalEventListenersAdded) {
    document.removeEventListener('keydown', handleKeyDown);
    globalEventListenersAdded = false;
  }
  
  // Remove all Sigma event listeners
  if (sigmaInstance) {
    // First try removeAllListeners if available (safer)
    if (typeof sigmaInstance.removeAllListeners === 'function') {
      sigmaInstance.removeAllListeners();
    } else {
      // Fallback to removing specific event types
    const eventTypes = [
      'clickNode', 'rightClickNode', 'downNode', 'enterNode', 'leaveNode',
      'clickEdge', 'rightClickEdge', 'downEdge', 'enterEdge', 'leaveEdge',
      'clickStage', 'rightClickStage', 'downStage', 'doubleClickStage',
      'wheel', 'cameraUpdated'
    ];
    
    // Remove all registered events
    eventTypes.forEach(eventType => {
      try {
          sigmaInstance.off(eventType);
      } catch (e) {
          // Silently fail for individual events
      }
    });
    }
    
    // Remove specific captors listeners
    try {
      const captors = ['getMouseCaptor', 'getTouchCaptor', 'getWheelCaptor', 'getCamera'];
      captors.forEach(captorMethod => {
        try {
          const captor = sigmaInstance[captorMethod]();
          if (captor && typeof captor.removeAllListeners === 'function') {
            captor.removeAllListeners();
          }
    } catch (e) {
          // Silently fail for individual captors
        }
      });
    } catch (e) {
      // Silently fail captor cleanup
    }
  }
  
  // Dispose Sigma instance - this will remove WebGL contexts
  try {
    sigmaInstance.clear();
    sigmaInstance.kill();
  } catch (e) {
    console.warn('Error during Sigma disposal', e);
  }
  sigmaInstance = null;
  
  // Clear graph instance
  if (graphInstance) {
    try {
      graphInstance.clear();
    } catch (e) {
      console.warn('Error clearing graph instance', e);
    }
    graphInstance = null;
  }
  
  // Reset container state if exists
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
 * Find edge ID between two nodes
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @param {boolean} [directed=null] - Whether to consider direction, if null will use graph.directed from state
 * @return {string|null} Edge ID or null if not found
 */
function findEdgeId(source, target, directed = null) {
  if (!graphInstance) return null;
  
  // If directed parameter is null, get directed state from central state management
  if (directed === null) {
    try {
      directed = getState('graph.directed') || false;
    } catch (e) {
      // Fallback in case of error
      directed = false;
    }
  }
  
  // Convert to booleans to ensure proper comparison
  directed = Boolean(directed);
  
  // Ensure source and target are strings
  source = String(source);
  target = String(target);
  
  // For better performance, first try direct methods if available
  try {
    // Try direct edge lookup if available
    if (typeof graphInstance.edge === 'function') {
      try {
        return graphInstance.edge(source, target);
      } catch (e) {
        // Edge not found in this direction
        if (!directed) {
          try {
            // Try reverse direction for undirected graphs
            return graphInstance.edge(target, source);
          } catch (e) {
            // Edge not found in either direction
          }
        }
      }
    }
  } catch (e) {
    // Fall back to iteration if direct lookup fails
  }
  
  // Fall back to iteration
  let edgeId = null;
  
  graphInstance.forEachEdge((id, attributes, sourceId, targetId) => {
    if (edgeId) return false; // Early exit if we found an edge
    
    // Convert to strings for comparison
    const sid = String(sourceId);
    const tid = String(targetId);
    
    // If directed, only check source→target
    // If undirected, check both directions
    if ((sid === source && tid === target) || 
        (!directed && sid === target && tid === source)) {
      edgeId = id;
      return false; // Break the forEach loop
    }
  });
  
  return edgeId;
}

// Create debounced version of findEdgeId for performance optimization
const findEdgeIdDebounced = debounce(findEdgeId, 50);

/**
 * Update selection state in both local Sets and global state
 * This is a centralized function to maintain consistent selection state
 * @param {Set|Array} nodeSet - Set or Array of selected node IDs
 * @param {Set|Array} edgeSet - Set or Array of selected edge IDs
 * @private
 */
export function updateSelectionState(nodeSet, edgeSet) {
  // Ensure we have Sets for local tracking
  const nodes = nodeSet instanceof Set ? nodeSet : new Set(nodeSet);
  const edges = edgeSet instanceof Set ? edgeSet : new Set(edgeSet);
  
  // Update local Sets
  selectedNodes = nodes;
  selectedEdges = edges;
  
  // Convert Sets to Arrays for state
  const nodeArray = Array.from(nodes);
  const edgeArray = Array.from(edges);
  
  // Update central state in single batch to reduce updates
  const stateUpdates = {
    'ui.selectedNodes': nodeArray,
    'ui.selectedEdges': edgeArray,
    'ui.propertyEditing': {
    active: nodeArray.length > 0 || edgeArray.length > 0,
    selectedNodes: nodeArray,
    selectedEdges: edgeArray,
    editableNodeProperties: EDITABLE_NODE_PROPERTIES,
    editableEdgeProperties: EDITABLE_EDGE_PROPERTIES
    }
  };
  
  // Update all state properties at once
  Object.entries(stateUpdates).forEach(([key, value]) => {
    setState(key, value);
  });
  
  // Update visual appearance of selected elements
  updateSelectionVisuals();
}

/**
 * Update visual styling of selected elements
 * @private
 */
function updateSelectionVisuals() {
  // Nothing to update if no graph
  if (!graphInstance) return;
  
  // Start batch operation
  graphInstance.emit('startBatch');
  
  // First reset all nodes/edges to default appearance
  graphInstance.forEachNode(node => {
      // Skip nodes that are currently being dragged
    if (graphInstance.hasNodeAttribute(node, 'originalColor')) {
      return;
    }
    
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
      // For directed graphs, keep the larger size for arrows
      if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {
        graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
        graphInstance.setEdgeAttribute(edge, 'size', DIRECTED_EDGE_SIZE);
      } else {
        graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
        graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);
      }
    }
  });

  // Then apply selection styling
  selectedNodes.forEach(nodeId => {
    if (graphInstance.hasNode(nodeId) && !graphInstance.hasNodeAttribute(nodeId, 'originalColor')) {
      graphInstance.setNodeAttribute(nodeId, 'color', SELECTION_COLOR);
      graphInstance.setNodeAttribute(nodeId, 'size', SELECTION_NODE_SIZE);
      graphInstance.setNodeAttribute(nodeId, 'zIndex', 10);
    }
  });

  selectedEdges.forEach(edgeId => {
    if (graphInstance.hasEdge(edgeId)) {
      graphInstance.setEdgeAttribute(edgeId, 'color', SELECTION_COLOR);
      graphInstance.setEdgeAttribute(edgeId, 'size', SELECTION_EDGE_SIZE);
    }
  });
  
  // End batch operation
  graphInstance.emit('endBatch');
  
  // Refresh the visualization
  if (sigmaInstance) {
    sigmaInstance.refresh();
  }
} 

// Legacy functions using the new consolidated functions
export const getNodeProperties = (nodeId) => getElementProperties(nodeId, 'node');
export const getEdgeProperties = (edgeId) => getElementProperties(edgeId, 'edge');
export const setNodeProperties = (nodeId, properties) => setElementProperties(nodeId, properties, 'node');
export const setEdgeProperties = (edgeId, properties) => setElementProperties(edgeId, properties, 'edge');
export const setBulkNodeProperties = (nodeIds, properties) => setBulkElementProperties(nodeIds, properties, 'node');
export const setBulkEdgeProperties = (edgeIds, properties) => setBulkElementProperties(edgeIds, properties, 'edge');
export const setSelectedNodeProperties = (properties) => setBulkElementProperties(Array.from(selectedNodes), properties, 'node');
export const setSelectedEdgeProperties = (properties) => setBulkElementProperties(Array.from(selectedEdges), properties, 'edge');

/**
 * Get the definition of editable properties for nodes
 * @returns {Array} Array of property definitions
 */
export const getEditableNodeProperties = () => {
  return [...EDITABLE_NODE_PROPERTIES];
};

/**
 * Get the definition of editable properties for edges
 * @returns {Array} Array of property definitions
 */
export const getEditableEdgeProperties = () => {
  return [...EDITABLE_EDGE_PROPERTIES];
};

/**
 * Set up listeners for graph control events from UI
 * @private
 */
function setupGraphControlListeners() {
  if (typeof subscribe !== 'function') {
    console.warn('State management not available for graph controls');
    return;
  }

  // Listen for general graph control events
  subscribe('graph.control', (controlEvent) => {
    if (!controlEvent || !controlEvent.action) return;
    handleGraphControlAction(controlEvent.action);
  });

  // Listen for specific control actions
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

  
  try {
    switch (action) {
      case 'zoom-in':
        const camera = sigmaInstance.getCamera();
        // Much more dramatic zoom in - divide ratio by 4
        camera.animatedZoom({ ratio: camera.ratio / 4, duration: 300 });
        break;
      
      case 'zoom-out':
        const camera2 = sigmaInstance.getCamera();
        // Much more dramatic zoom out - multiply ratio by 4  
        camera2.animatedZoom({ ratio: camera2.ratio * 4, duration: 300 });
        break;
      
      case 'fit':
        sigmaInstance.getCamera().animatedReset({ duration: 300 });
        break;
      
      case 'layout-circle':
        applyLayout('circular', { animate: true });
        break;
      
      case 'layout-grid':
        applyLayout('grid', { animate: true }); // Use proper grid layout
        break;
      
      case 'layout-random':
        applyLayout('random', { animate: true });
        break;
      
      case 'reset':
        // Reset camera view
        sigmaInstance.getCamera().animatedReset({ duration: 300 });

        // Clear all selections
        clearSelection();
        setState('ui.selectedNodes', []);
        setState('ui.selectedEdges', []);

        // Reset all node and edge colors to default (clear highlights)
        if (graphInstance) {
          graphInstance.emit('startBatch');

          graphInstance.forEachNode((node) => {
            graphInstance.setNodeAttribute(node, 'color', DEFAULT_NODE_ATTRIBUTES.color);
            graphInstance.setNodeAttribute(node, 'size', DEFAULT_NODE_ATTRIBUTES.size);
            if (graphInstance.hasNodeAttribute(node, 'zIndex')) {
              graphInstance.removeNodeAttribute(node, 'zIndex');
            }
          });

          graphInstance.forEachEdge((edge) => {
            graphInstance.setEdgeAttribute(edge, 'color', DEFAULT_EDGE_ATTRIBUTES.color);
            graphInstance.setEdgeAttribute(edge, 'size', DEFAULT_EDGE_ATTRIBUTES.size);

            // Adjust size for directed graphs
            if (getState('graph.directed') && graphInstance.getEdgeAttribute(edge, 'type') === 'arrow') {
              graphInstance.setEdgeAttribute(edge, 'size', DIRECTED_EDGE_SIZE);
            }
          });

          graphInstance.emit('endBatch');
          sigmaInstance.refresh();
        }
        break;
      
      case 'animate':
        // Get the current Euler path and animate it
        const currentPath = getState('results.path');
        if (currentPath && Array.isArray(currentPath)) {
          animatePath(currentPath);
        } else {
          console.warn('No path available to animate');
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
} 
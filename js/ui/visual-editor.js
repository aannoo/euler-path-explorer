/**
 * Visual Editor Module
 * Handles visual mode functionality with edge list display and sync
 */

import { $, $$ } from '../utils/dom.js';
import { getState, setState, subscribe } from '../core/state.js';
import { parseEdgeInput } from '../graph/sigma-controller.js';
import { getGraph } from '../graph/sigma-adapter.js';

let isVisualMode = false;
let originalTextValue = ''; // Store original text when entering visual mode
let buttonClickHandler = null; // Store button handler for cleanup

/**
 * Initialize visual editor functionality
 */
export const initVisualEditor = () => {
  
  // Expose updateEdgeListDisplay globally for sigma-adapter
  if (typeof window !== 'undefined') {
    window.updateEdgeListDisplay = updateEdgeListDisplay;
  }
  
  // Subscribe to editor mode changes
  subscribe('ui.editorMode', (mode) => {
    isVisualMode = mode === 'visual';
    
    if (isVisualMode) {
      syncTextToVisual();
      setupButtonHandler();
      updateButtonContent();
    } else {
      syncVisualToText();
      removeButtonHandler();
    }
  });
  
  // Subscribe to selection changes to update button
  subscribe('ui.selectedNodes', () => {
    if (isVisualMode) {
      updateButtonContent();
    }
  });
  
};

/**
 * Sync text input to visual mode display
 */
const syncTextToVisual = () => {
  
  const textInput = $('#edges');
  if (!textInput) {
    console.warn('❌ Text input not found');
    return;
  }
  
  // Store original text value
  originalTextValue = textInput.value;
  
  try {
    const edges = parseEdgeInput(textInput.value);
    displayEdgeList(edges);
  } catch (error) {
    console.error('❌ Parse error:', error);
    displayEdgeList([]);
    showParseError(error.message);
  }
};

/**
 * Sync visual mode changes back to text input
 * Extract current graph state and convert to text format
 */
const syncVisualToText = () => {
  
  const textInput = $('#edges');
  
  if (!textInput) {
    console.warn('❌ Text input not found');
    return;
  }
  
  try {
    // Get current graph from Sigma
    const graphInstance = getGraph();
    if (!graphInstance) {
      console.warn('❌ Graph instance not found, restoring original text');
      textInput.value = originalTextValue;
      return;
    }
    
    // Extract edges from graph using labels instead of IDs
    const edges = [];
    graphInstance.forEachEdge((edge, attributes, source, target) => {
      // Get node labels for better readability
      const sourceLabel = graphInstance.getNodeAttribute(source, 'label') || source;
      const targetLabel = graphInstance.getNodeAttribute(target, 'label') || target;
      const weight = attributes.weight || 1;
      
      edges.push({ 
        source: sourceLabel, 
        target: targetLabel, 
        weight: weight 
      });
    });
    
    // Check if graph is weighted by looking at state
    const isWeighted = getState('graph.weighted');
    
    // Generate edge string in the correct format
    let edgeStr = '';
    if (isWeighted) {
      edgeStr = edges.map(e => `[${e.source},${e.target},${e.weight}]`).join(',');
    } else {
      edgeStr = edges.map(e => `[${e.source},${e.target}]`).join(',');
    }
    
    // Update the input
    textInput.value = edgeStr;
  } catch (error) {
    console.error('❌ Error syncing visual to text:', error);
    // Fallback to original text if there's an error
    textInput.value = originalTextValue;
  }
};

/**
 * Update button content based on mode and selection
 */
const updateButtonContent = () => {
  const button = $('#add-edge');
  if (!button) return;
  
  const selectedNodes = getState('ui.selectedNodes') || [];
  
  if (selectedNodes.length === 0) {
    // No selection: show instruction
    button.innerHTML = '<i class="fas fa-mouse-pointer"></i> SELECT NODE TO BEGIN';
    button.disabled = true;
    button.style.opacity = '0.6';
  } else if (selectedNodes.length === 1) {
    // One node selected: show selected node name and delete option
    const selectedNodeId = selectedNodes[0];
    button.innerHTML = `<span>"${selectedNodeId}"</span> | <i class="fas fa-trash"></i> DELETE`;
    button.disabled = false;
    button.style.opacity = '1';
  } else {
    // Multiple nodes selected: show delete option
    button.innerHTML = `<span>${selectedNodes.length} SELECTED</span> | <i class="fas fa-trash"></i> DELETE`;
    button.disabled = false;
    button.style.opacity = '1';
  }
};

/**
 * Update the edge list display from current Sigma graph
 */
const updateEdgeListDisplay = () => {
  if (!isVisualMode) return;
  
  try {
    // Get current graph from Sigma
    const graphInstance = getGraph();
    if (!graphInstance) return;
    
    // Extract edges from graph using labels instead of IDs
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
    
    // Display the updated edge list
    displayEdgeList(edges);
  } catch (error) {
    console.error('❌ Error updating edge list display:', error);
  }
};

/**
 * Handle button click based on current state
 */
const handleButtonClick = () => {
  const selectedNodes = getState('ui.selectedNodes') || [];
  
  if (selectedNodes.length > 0) {
    // Delete selected nodes using the correct function from sigma-adapter
    import('../graph/sigma-adapter.js').then(({ deleteSelectedElements }) => {
      deleteSelectedElements();
      // Sync the edge list display after deletion
      updateEdgeListDisplay();
    });
  }
  // If no selection, button is disabled so nothing happens
};

/**
 * Set up button handler for visual mode
 */
const setupButtonHandler = () => {
  const button = $('#add-edge');
  if (button && !buttonClickHandler) {
    buttonClickHandler = handleButtonClick;
    button.addEventListener('click', buttonClickHandler);
  }
};

/**
 * Remove button handler when leaving visual mode
 */
const removeButtonHandler = () => {
  const button = $('#add-edge');
  if (button && buttonClickHandler) {
    button.removeEventListener('click', buttonClickHandler);
    buttonClickHandler = null;
    // Restore original button
    button.innerHTML = '<i class="fas fa-plus"></i> ADD EDGE';
    button.disabled = false;
    button.style.opacity = '1';
  }
};

/**
 * Display edge list in visual mode
 */
const displayEdgeList = (edges) => {
  const container = $('#edge-list');
  if (!container) {
    console.warn('❌ Edge list container not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (edges.length === 0) {
    container.innerHTML = '<div class="edge-item">No edges to display</div>';
    return;
  }
  
  edges.forEach((edge, index) => {
    const edgeItem = document.createElement('div');
    edgeItem.className = 'edge-item';
    edgeItem.innerHTML = `
      <span class="source-label">FROM:</span>
      <span class="edge-vertex">${edge.source}</span>
      <span class="target-label">TO:</span>
      <span class="edge-vertex">${edge.target}</span>
      ${edge.weight !== 1 ? `<span class="weight-label">WEIGHT: ${edge.weight}</span>` : ''}
    `;
    container.appendChild(edgeItem);
  });
  
};

/**
 * Show parse error in edge list
 */
const showParseError = (message) => {
  const container = $('#edge-list');
  if (!container) return;
  
  container.innerHTML = `
    <div class="edge-item error">
      <span style="color: var(--error-color);">⚠️ Parse Error: ${message}</span>
    </div>
  `;
}; 
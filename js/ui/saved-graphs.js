/**
 * Saved Graphs UI Module
 * Manages the saved graphs panel and interactions
 */
import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { getState, setState, subscribe } from '../core/state.js';
import { showNotification } from './init.js';
import { 
  getSavedGraphs, 
  getExampleGraphs, 
  saveCurrentGraph, 
  loadGraph, 
  deleteGraph, 
  duplicateGraph,
  generateRandomEulerGraph
} from '../core/storage.js';
import { parseEdgeInput, calculateEulerPath } from '../graph/sigma-controller.js';
import { Graph } from '../graph/model.js';
import { getGraph, renderGraph } from '../graph/sigma-adapter.js';
import { showCalcLoader, hideCalcLoader, updateLoaderProgress } from '../ui/loader.js';

// State for collapsed sections
let examplesSectionCollapsed = false;
let savedSectionCollapsed = false;

// Module-level DOM references
let savedGraphsList = null;
let currentGraphSection = null;

// Original loaded graph data for comparison
let originalGraphData = null;

/**
 * Initialize saved graphs panel
 */
export const initializeSavedGraphs = () => {
  savedGraphsList = $('#saved-graphs-list');
  currentGraphSection = $('.save-form');
  const saveButton = $('#save');
  
  // Initialize the savedGraphs state object first
  if (!getState().ui) {
    setState('ui', {});
  }
  
  if (!getState().ui.savedGraphs) {
    setState('ui.savedGraphs', {
      activeItemId: null,
      editingItemId: null,
      confirmingDeleteId: null,
      isModified: false,
      currentGraphId: null
    });
  } else {
    // Just make sure individual properties are initialized
    setState('ui.savedGraphs.activeItemId', getState().ui.savedGraphs.activeItemId || null);
    setState('ui.savedGraphs.editingItemId', getState().ui.savedGraphs.editingItemId || null);
    setState('ui.savedGraphs.confirmingDeleteId', getState().ui.savedGraphs.confirmingDeleteId || null);
    setState('ui.savedGraphs.isModified', getState().ui.savedGraphs.isModified || false);
    setState('ui.savedGraphs.currentGraphId', getState().ui.savedGraphs.currentGraphId || null);
  }
  
  if (!savedGraphsList) {
    return;
  }
  
  // Set up save button
  if (saveButton) {
    saveButton.addEventListener('click', handleSave);
    
    // Initial button state
    updateSaveButtonState();
  }
  
  // Initial render
  renderSavedGraphs(savedGraphsList);
  updateCurrentGraphSection();
  
  // Subscribe to state changes
  subscribe('ui.savedGraphs.activeItemId', (activeId) => {
    renderSavedGraphs(savedGraphsList);
    
    // If loading a graph through an active item set, update current graph too
    if (activeId) {
      const graph = loadGraph(activeId);
      if (graph) {
        // Set as current graph too
        setState('ui.savedGraphs.currentGraphId', activeId);
        setState('ui.savedGraphs.isModified', false);
        
        // Store original data for change detection
        originalGraphData = {
          edges: graph.edges,
          directed: graph.directed,
          weighted: graph.weighted
        };
        
        // Update current graph section
        updateCurrentGraphSection();
      }
    }
  });
  
  subscribe('ui.savedGraphs.confirmingDeleteId', (confirmingId) => {
    renderSavedGraphs(savedGraphsList);
  });
  
  subscribe('ui.savedGraphs.editingItemId', (editingId) => {
    setTimeout(() => {
      if (editingId) {
        const nameInput = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-input`);
        const nameDisplay = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-name`);
        
        if (nameInput && nameDisplay) {
          nameDisplay.style.display = 'none';
          nameInput.style.display = 'block';
          nameInput.focus();
          nameInput.select();
        }
      }
    }, 10);
  });
  
  subscribe('ui.savedGraphs.renamed', (data) => {
    if (data && data.id) {
      // Update the display without a full re-render
      const nameDisplay = document.querySelector(`.saved-graph-item[data-id="${data.id}"] .saved-graph-name`);
      if (nameDisplay) {
        nameDisplay.textContent = data.name;
        nameDisplay.style.display = 'block';
      }
      
      const nameInput = document.querySelector(`.saved-graph-item[data-id="${data.id}"] .saved-graph-input`);
      if (nameInput) {
        nameInput.style.display = 'none';
      }
      
      // Update current graph section if this is the current graph
      if (data.id === getState().ui.savedGraphs.currentGraphId) {
        updateCurrentGraphSection();
      }
    }
  });
  
  // Listen for tab changes to update current graph section
  subscribe('ui.activeTab', (activeTab) => {
    if (activeTab === 'saved') {
      updateSaveButtonState();
      updateCurrentGraphSection();
      checkForGraphChanges();
    }
  });
  
  // Listen for graph data changes
  subscribe('graph.edges', () => {
    checkForGraphChanges();
    updateCurrentGraphSection();
  });
  
  subscribe('graph.directed', () => {
    checkForGraphChanges();
    updateCurrentGraphSection();
  });
  
  subscribe('graph.weighted', () => {
    checkForGraphChanges();
    updateCurrentGraphSection();
  });
  
  // Return update function for external use
  return {
    update: () => {
      renderSavedGraphs(savedGraphsList);
      updateCurrentGraphSection();
    }
  };
};

/**
 * Update save button state based on whether there's a graph to save
 */
const updateSaveButtonState = () => {
  const state = getState();
  const hasEdges = state && state.graph && state.graph.edges && state.graph.edges.length > 0;
  const isModified = state && state.ui && state.ui.savedGraphs ? state.ui.savedGraphs.isModified : false;
  const currentGraphId = state && state.ui && state.ui.savedGraphs ? state.ui.savedGraphs.currentGraphId : null;
  
  const saveButton = $('#save');
  if (saveButton) {
    saveButton.style.display = hasEdges ? 'block' : 'none';
    
    // Update button text based on state
    if (currentGraphId && isModified) {
      saveButton.innerHTML = '<i class="fas fa-save"></i> UPDATE GRAPH';
    } else if (currentGraphId) {
      saveButton.innerHTML = '<i class="fas fa-save"></i> SAVE GRAPH';
    } else {
      saveButton.innerHTML = '<i class="fas fa-save"></i> SAVE NEW GRAPH';
    }
  }
  
  // Update hint box visibility - scope to saved tab only
  const saveHint = $('#saved-tab #save-hint');
  if (saveHint) {
    if (currentGraphId && isModified) {
      saveHint.classList.remove('hidden');
      saveHint.innerHTML = '<i class="fas fa-info-circle"></i> You\'ve made changes to this graph';
      saveHint.style.opacity = '1';
      saveHint.style.height = 'auto';
      saveHint.style.padding = `var(--spacing-2) var(--spacing-3)`;
      saveHint.style.marginBottom = '0';
    } else {
      // Only affect save hint in saved tab
      saveHint.classList.add('hidden');
      saveHint.style.opacity = '0';
      saveHint.style.height = '0';
      saveHint.style.padding = '0';
      saveHint.style.marginBottom = '0';
    }
  }
};

/**
 * Handle save button click
 */
const handleSave = () => {
  try {
    const state = getState();
    const currentGraphId = state.ui.savedGraphs.currentGraphId;
    let graph = null;
    
    if (currentGraphId) {
      // We are updating an existing graph - get its name
      const existingGraph = loadGraph(currentGraphId);
      if (existingGraph) {
        graph = saveCurrentGraph(existingGraph.name);
        
        // Only delete the old version if save was successful
        if (graph) {
          deleteGraph(currentGraphId);
        }
      } else {
        graph = saveCurrentGraph();
      }
    } else {
      // Creating a new graph
      graph = saveCurrentGraph();
    }
    
    if (graph) {
      // Set this as the current graph
      setState('ui.savedGraphs.currentGraphId', graph.id);
      setState('ui.savedGraphs.activeItemId', graph.id);
      setState('ui.savedGraphs.isModified', false);
      
      // Store original data for change detection
      originalGraphData = {
        edges: graph.edges,
        directed: graph.directed,
        weighted: graph.weighted
      };
      
      // Update UI
      renderSavedGraphs(savedGraphsList);
      updateCurrentGraphSection();
      
      showNotification(`Graph saved as "${graph.name}"`, 'success');
      
      // Scroll to the saved graph
      setTimeout(() => {
        const graphItem = document.querySelector(`.saved-graph-item[data-id="${graph.id}"]`);
        if (graphItem) {
          graphItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      showNotification('Failed to save graph', 'error');
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
};

/**
 * Render saved graphs list
 * @param {Element} container - Container element
 */
const renderSavedGraphs = (container) => {
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Get examples and saved graphs
  const examples = getExampleGraphs();
  const savedGraphs = getSavedGraphs();
  
  // Sort saved graphs by date in descending order (newest first)
  const sortedSavedGraphs = [...savedGraphs].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Auto-collapse examples section if there are saved graphs
  if (savedGraphs.length > 0) {
    examplesSectionCollapsed = true;
  }
  
  // Example Graphs section
  const examplesSectionHTML = `
    <div class="saved-section ${examplesSectionCollapsed ? 'collapsed' : ''}">
      <h4><i class="fas fa-lightbulb"></i> Example Graphs</h4>
      <div class="saved-graphs-items">
        ${examples.length > 0 
          ? examples.map((graph, index) => createExampleItemHTML(graph, index)).join('')
          : '<p class="no-items-message">No example graphs available.</p>'
        }
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', examplesSectionHTML);
  
  // Saved Graphs section
  const savedSectionHTML = `
    <div class="saved-section ${savedSectionCollapsed ? 'collapsed' : ''}">
      <h4><i class="fas fa-save"></i> Saved Graphs</h4>
      <div class="saved-graphs-items">
        ${sortedSavedGraphs.length > 0 
          ? sortedSavedGraphs.map(graph => createSavedItemHTML(graph)).join('')
          : '<p class="no-items-message">No saved graphs yet. Click "Save Graph" to save the current graph.</p>'
        }
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', savedSectionHTML);
  
  // Attach event listeners
  attachEventListeners();
};

/**
 * Create HTML for a saved graph item
 * @param {Object} graph - Graph object
 * @return {string} The HTML string
 */
const createSavedItemHTML = (graph) => {
  // Get state for active and confirming delete
  const state = getState().ui.savedGraphs || {};
  const isActive = graph.id === state.activeItemId;
  const isConfirmingDelete = graph.id === state.confirmingDeleteId;
  
  // Calculate node count from edges
  const nodes = new Set();
  let edgeCount = 0;
  
  // Try to parse the edges string correctly
  // It could be comma-separated format like "[a,b],[b,c]" or newline format
  if (graph.edges.includes('[') && graph.edges.includes(']')) {
    // Handle bracket notation format
    const edgeMatches = graph.edges.match(/\[([^\]]+)\]/g) || [];
    edgeCount = edgeMatches.length;
    
    edgeMatches.forEach(match => {
      // Remove brackets and split by comma
      const parts = match.substring(1, match.length - 1).split(',').map(p => p.trim());
      
      if (parts.length >= 2) {
        nodes.add(parts[0]);
        // For weighted graphs, parts[1] is the target node, otherwise it's the last part
        const targetNodeIndex = graph.weighted ? 1 : parts.length - 1;
        nodes.add(parts[targetNodeIndex]);
      }
    });
  } else {
    // Handle newline format
    const lines = graph.edges.split('\n').filter(line => line.trim().length > 0);
    edgeCount = lines.length;
    
    lines.forEach(line => {
      line = line.trim();
      if (line.length > 0) {
        const parts = line.split(/\s*->\s*|\s*--\s*|\s+/);
        if (parts.length >= 2) {
          nodes.add(parts[0]);
          // For weighted graphs, parts[1] is the target node, otherwise it's the last part
          const targetNodeIndex = graph.weighted ? 1 : parts.length - 1;
          nodes.add(parts[targetNodeIndex]);
        }
      }
    });
  }
  
  const nodeCount = nodes.size;
  
  let actionsHTML = '';
  if (isActive) {
    if (isConfirmingDelete) {
      actionsHTML = `
        <div class="saved-graph-actions">
          <div class="confirmation-message">Are you sure you want to delete this graph?</div>
          <div class="action-buttons">
            <button class="btn btn-secondary btn-saved-action cancel-delete-btn"><i class="fas fa-times"></i> CANCEL</button>
            <button class="btn btn-warning btn-saved-action confirm-delete-btn"><i class="fas fa-trash"></i> DELETE</button>
          </div>
        </div>
      `;
    } else {
      actionsHTML = `
        <div class="saved-graph-actions">
          <div class="action-buttons">
            <button class="btn btn-secondary btn-saved-action duplicate-btn"><i class="fas fa-copy"></i> DUPLICATE</button>
            <button class="btn btn-secondary btn-saved-action remove-btn"><i class="fas fa-trash"></i> REMOVE</button>
          </div>
        </div>
      `;
    }
  }
  
  // Create graph property icons
  const directedIcon = graph.directed ? 'fa-long-arrow-alt-right' : 'fa-exchange-alt';
  const weightedIcon = graph.weighted ? 'fa-weight-hanging' : 'fa-minus';
  const directedText = graph.directed ? 'Directed' : 'Undirected';
  const weightedText = graph.weighted ? 'Weighted' : 'Unweighted';
  
  // Format date if available
  let dateDisplay = '';
  if (graph.date) {
    const dateObj = new Date(graph.date);
    dateDisplay = dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return `
    <div class="saved-graph-item ${isActive ? 'active' : ''}" data-id="${graph.id}">
      <div class="saved-graph-name">${graph.name}</div>
      <input type="text" class="saved-graph-input" name="graph-name" aria-label="Graph name" value="${graph.name}">
      <div class="saved-graph-details">${graph.edges}</div>
      <div class="graph-metadata">
        <div class="graph-property">
          <i class="fas fa-project-diagram"></i>
          <span class="property-text">Nodes:</span> ${nodeCount}
        </div>
        <div class="graph-property">
          <i class="fas fa-link"></i>
          <span class="property-text">Edges:</span> ${edgeCount}
        </div>
        <div class="graph-property">
          <i class="fas ${directedIcon}"></i>
          <span class="property-text">${directedText}</span>
        </div>
        <div class="graph-property">
          <i class="fas ${weightedIcon}"></i>
          <span class="property-text">${weightedText}</span>
        </div>
        ${graph.date && isActive ? `
        <div class="graph-property">
          <i class="fas fa-calendar-alt"></i>
          <span class="property-text">Created:</span> ${dateDisplay}
        </div>
        ` : ''}
      </div>
      ${actionsHTML}
    </div>
  `;
};

/**
 * Create HTML for an example graph item
 * @param {Object} graph - Graph object
 * @param {number} index - Example index
 * @return {string} The HTML string
 */
const createExampleItemHTML = (graph, index) => {
  // Special handling for random generator
  if (graph.isRandomGenerator) {
    return `
      <div class="saved-graph-item example-item random-generator" data-index="${index}">
        <div class="saved-graph-name">${graph.name}</div>
        <div class="saved-graph-details">
          <p>Generates a random Euler circuit where all vertices have even degree</p>
          <div class="random-params">
            <label>
              <span>Vertices:</span>
              <input type="number" class="random-vertices" name="random-vertices" aria-label="Number of vertices" min="3" max="15" value="5">
            </label>
            <label>
              <span>Edges:</span>
              <input type="number" class="random-edges" name="random-edges" aria-label="Number of edges" min="5" max="50" value="8">
            </label>
          </div>
          <div class="euler-info">
            <small>An Euler circuit visits every edge exactly once and returns to the starting vertex.</small>
          </div>
        </div>
        <div class="graph-metadata">
          <div class="graph-property">
            <i class="fas fa-dice"></i>
            <span class="property-text">Random Euler Circuit Generator</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Calculate node count from edges
  const nodes = new Set();
  let edgeCount = 0;
  
  // Try to parse the edges string correctly
  // It could be comma-separated format like "[a,b],[b,c]" or newline format
  if (graph.edges.includes('[') && graph.edges.includes(']')) {
    // Handle bracket notation format
    const edgeMatches = graph.edges.match(/\[([^\]]+)\]/g) || [];
    edgeCount = edgeMatches.length;
    
    edgeMatches.forEach(match => {
      // Remove brackets and split by comma
      const parts = match.substring(1, match.length - 1).split(',').map(p => p.trim());
      
      if (parts.length >= 2) {
        nodes.add(parts[0]);
        // For weighted graphs, parts[1] is the target node, otherwise it's the last part
        const targetNodeIndex = graph.weighted ? 1 : parts.length - 1;
        nodes.add(parts[targetNodeIndex]);
      }
    });
  } else {
    // Handle newline format
    const lines = graph.edges.split('\n').filter(line => line.trim().length > 0);
    edgeCount = lines.length;
    
    lines.forEach(line => {
      line = line.trim();
      if (line.length > 0) {
        const parts = line.split(/\s*->\s*|\s*--\s*|\s+/);
        if (parts.length >= 2) {
          nodes.add(parts[0]);
          // For weighted graphs, parts[1] is the target node, otherwise it's the last part
          const targetNodeIndex = graph.weighted ? 1 : parts.length - 1;
          nodes.add(parts[targetNodeIndex]);
        }
      }
    });
  }
  
  const nodeCount = nodes.size;
  
  // Create graph property icons
  const directedIcon = graph.directed ? 'fa-long-arrow-alt-right' : 'fa-exchange-alt';
  const weightedIcon = graph.weighted ? 'fa-weight-hanging' : 'fa-minus';
  const directedText = graph.directed ? 'Directed' : 'Undirected';
  const weightedText = graph.weighted ? 'Weighted' : 'Unweighted';
  
  return `
    <div class="saved-graph-item example-item" data-index="${index}">
      <div class="saved-graph-name">${graph.name}</div>
      <div class="saved-graph-details">${graph.edges}</div>
      <div class="graph-metadata">
        <div class="graph-property">
          <i class="fas fa-project-diagram"></i>
          <span class="property-text">Nodes:</span> ${nodeCount}
        </div>
        <div class="graph-property">
          <i class="fas fa-link"></i>
          <span class="property-text">Edges:</span> ${edgeCount}
        </div>
        <div class="graph-property">
          <i class="fas ${directedIcon}"></i>
          <span class="property-text">${directedText}</span>
        </div>
        <div class="graph-property">
          <i class="fas ${weightedIcon}"></i>
          <span class="property-text">${weightedText}</span>
        </div>
      </div>
    </div>
  `;
};
  
/**
 * Attach event listeners to all graph items
 */
const attachEventListeners = () => {
  // Section headers (collapsible)
  $$('.saved-section h4').forEach(header => {
    header.addEventListener('click', (event) => {
      const section = header.closest('.saved-section');
      const isExamplesSection = header.textContent.includes('Example');
      
      section.classList.toggle('collapsed');
  
      // Update collapsed state
      if (isExamplesSection) {
        examplesSectionCollapsed = section.classList.contains('collapsed');
      } else {
        savedSectionCollapsed = section.classList.contains('collapsed');
      }
    });
  });
  
  // Random graph generator inputs - prevent click propagation
  $$('.random-generator .random-params input').forEach(input => {
    input.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    
    // Validate input values on change
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      
      if (input.classList.contains('random-vertices')) {
        // Vertices validation
        let value = parseInt(input.value, 10);
        if (isNaN(value) || value < 3) value = 3;
        if (value > 15) value = 15;
        input.value = value;
        
        // Adjust edges if needed
        const edgesInput = input.closest('.random-params').querySelector('.random-edges');
        if (edgesInput) {
          let edgesValue = parseInt(edgesInput.value, 10);
          if (edgesValue < value) {
            edgesInput.value = value;
          }
          
          const maxEdges = value * (value - 1) / 2;
          if (edgesValue > maxEdges) {
            edgesInput.value = maxEdges;
          }
        }
      } else if (input.classList.contains('random-edges')) {
        // Edges validation
        let value = parseInt(input.value, 10);
        const verticesInput = input.closest('.random-params').querySelector('.random-vertices');
        const vertices = verticesInput ? parseInt(verticesInput.value, 10) : 5;
        
        // Validate edges based on vertices
        const minEdges = vertices;
        const maxEdges = vertices * (vertices - 1) / 2;
        
        if (isNaN(value) || value < minEdges) value = minEdges;
        if (value > maxEdges) value = maxEdges;
        
        input.value = value;
      }
    });
  });
  
  // Saved graph items
  $$('.saved-graph-item:not(.example-item)').forEach(item => {
    // Main item click
    item.addEventListener('click', event => {
      // Skip if clicking buttons or inputs
      if (event.target.tagName === 'BUTTON' || 
          event.target.tagName === 'INPUT' ||
          event.target.tagName === 'I') {
        return;
      }
      
      const id = item.getAttribute('data-id');
      const state = getState().ui.savedGraphs || {};
      
      // Toggle active state through state management
      if (state.activeItemId === id) {
        // If already active, just close it
        setState('ui.savedGraphs.activeItemId', null);
      } else {
        // Set active through state management
        setState('ui.savedGraphs.activeItemId', id);
        
        // Also load the graph
        handleLoadGraph(id);
      }
    });
    
    // Name element click for editing
    const nameElement = item.querySelector('.saved-graph-name');
    if (nameElement) {
      nameElement.addEventListener('click', event => {
        // Only handle click when item is active
        const state = getState().ui.savedGraphs || {};
        const id = item.getAttribute('data-id');
        
        if (state.activeItemId === id) {
          event.stopPropagation(); // Prevent triggering item click
          
          // Use state management for editing state
          setState('ui.savedGraphs.editingItemId', id);
        }
      });
    }
    
    // Name input events
    const nameInput = item.querySelector('.saved-graph-input');
    if (nameInput) {
      // Prevent click propagation
      nameInput.addEventListener('click', event => {
        event.stopPropagation();
      });
      
      // Save on blur
      nameInput.addEventListener('blur', event => {
        try {
          const id = item.getAttribute('data-id');
          const graph = loadGraph(id);
          
          if (graph) {
            const nameElement = item.querySelector('.saved-graph-name');
            const originalName = nameElement ? nameElement.textContent : '';
            const newName = nameInput.value.trim();
            
            // Check if name actually changed
            if (newName && newName !== originalName) {
              // Update name in localStorage and state
              graph.name = newName;
              // Update through state system
              setState('ui.savedGraphs.renamed', { id, name: newName });
              showNotification(`Name updated to "${newName}"`, 'success');
            }
            
            // Clear editing state
            setState('ui.savedGraphs.editingItemId', null);
          }
        } catch (error) {
          showNotification(`Error updating name: ${error.message}`, 'error');
          setState('ui.savedGraphs.editingItemId', null);
        }
      });
      
      // Save on Enter key
      nameInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          nameInput.blur();
        }
      });
    }
    
    // Buttons
    const state = getState().ui.savedGraphs || {};
    const id = item.getAttribute('data-id');
    const isActive = state.activeItemId === id;
    const isConfirmingDelete = state.confirmingDeleteId === id;
    
    if (isActive) {
      // Duplicate button
      const duplicateBtn = item.querySelector('.duplicate-btn');
      if (duplicateBtn && !isConfirmingDelete) {
        duplicateBtn.addEventListener('click', event => {
          event.stopPropagation();
          handleDuplicateGraph(id);
        });
      }
      
      // Remove button
      const removeBtn = item.querySelector('.remove-btn');
      if (removeBtn && !isConfirmingDelete) {
        removeBtn.addEventListener('click', event => {
          event.stopPropagation();
          
          // Use state management for delete confirmation
          setState('ui.savedGraphs.confirmingDeleteId', id);
        });
      }
      
      // Cancel delete button
      const cancelDeleteBtn = item.querySelector('.cancel-delete-btn');
      if (cancelDeleteBtn && isConfirmingDelete) {
        cancelDeleteBtn.addEventListener('click', event => {
          event.stopPropagation();
          
          // Clear confirmation state
          setState('ui.savedGraphs.confirmingDeleteId', null);
        });
      }
      
      // Confirm delete button
      const confirmDeleteBtn = item.querySelector('.confirm-delete-btn');
      if (confirmDeleteBtn && isConfirmingDelete) {
        confirmDeleteBtn.addEventListener('click', event => {
          event.stopPropagation();
          handleDeleteGraph(id);
        });
      }
    }
  });
  
  // Example graph items
  $$('.example-item').forEach(item => {
    item.addEventListener('click', event => {
      // Skip if clicking inputs directly
      if (event.target.tagName === 'INPUT') {
        return;
      }
      
      const index = parseInt(item.getAttribute('data-index'), 10);
      const examples = getExampleGraphs();
      
      if (index >= 0 && index < examples.length) {
        handleLoadExample(examples[index]);
      }
    });
  });
};

/**
 * Handle loading a saved graph
 * @param {string} id - Graph ID
 */
const handleLoadGraph = async (id) => {
  try {
    const graph = loadGraph(id);
    
    if (graph) {
      // Update UI state
      setState('graph.directed', graph.directed);
      setState('graph.weighted', graph.weighted);
      
      // Set as current graph
      setState('ui.savedGraphs.currentGraphId', graph.id);
      setState('ui.savedGraphs.isModified', false);
      
      // Store original data for change detection
      originalGraphData = {
        edges: graph.edges,
        directed: graph.directed,
        weighted: graph.weighted
      };
      
      // Update edge input
      const edgeInput = $('#edges');
      if (edgeInput) {
        edgeInput.value = graph.edges;
      }
      
      // Reset confirming delete state
      setState('ui.savedGraphs.confirmingDeleteId', null);
      
      // Signal that saved graph loading has started (for orbital animation)
      setState('ui.savedGraphLoaded', true);
      
      // Use the same calculation process as the Calculate button
      // Parse edges first to get node count for conditional loader behavior
      let nodeCount = 0;
      try {
        const parsedEdges = parseEdgeInput(graph.edges);
        
        // Calculate node count from edges
        const nodes = new Set();
        parsedEdges.forEach(edge => {
          nodes.add(edge.source);
          nodes.add(edge.target);
        });
        nodeCount = nodes.size || 50;
      } catch (error) {
        // Fall back to default behavior (full loader)
        nodeCount = 50; // Ensures full loader is used
      }
      
      // Show global loader with node count and wait for animations to complete
      showCalcLoader('Loading Graph...', nodeCount).then(() => {
        try {
          // Parse edges to update the graph state
          const parsedEdges = parseEdgeInput(graph.edges);
          
          // Update the graph state
          setState('graph.edges', parsedEdges);
          
          // Update loader progress
          updateLoaderProgress('Rendering Graph...');
          
          // Get the graph instance
          const graphInstance = getGraph();
          
          if (graphInstance) {
            // Clear existing graph
            graphInstance.clear();
            
            // Set graph properties
            graphInstance.directed = graph.directed;
            graphInstance.weighted = graph.weighted;
            
            // First, create a set of all unique nodes from the edges
            const nodeSet = new Set();
            parsedEdges.forEach(edge => {
              nodeSet.add(edge.source);
              nodeSet.add(edge.target);
            });
            
            // Add all nodes to the graph first
            nodeSet.forEach(nodeId => {
              graphInstance.addNode(nodeId, {
                label: nodeId,
                x: Math.random() * 10 - 5,
                y: Math.random() * 10 - 5,
                size: 8,
                color: '#ff5a1f'
              });
            });
            
            // Now add all edges
            parsedEdges.forEach(edge => {
              graphInstance.addEdge(edge.source, edge.target, { weight: edge.weight });
            });
            
            // Create a Graph model instance to use with renderGraph
            const graphModel = new Graph();
            graphModel.directed = graph.directed;
            graphModel.weighted = graph.weighted;
            
            // Add nodes and edges to the model
            nodeSet.forEach(nodeId => {
              graphModel.addNode({ id: nodeId });
            });
            
            parsedEdges.forEach(edge => {
              graphModel.addEdge(edge.source, edge.target, { weight: edge.weight });
            });
            
            // Render the graph using the proper model
            renderGraph(graphModel);
          }
          
          // Update loader for Euler path calculation
          updateLoaderProgress('Finding Euler Path...');
          
          // Calculate Euler path
          calculateEulerPath(false);
          
          // Don't switch to results tab automatically
          // Let the user stay on the saved tab
          
          // Update current graph section
          updateCurrentGraphSection();
          
          // Hide loader after processing is complete
          hideCalcLoader().then(() => {
            showNotification(`Loaded graph "${graph.name}"`, 'success');
          });
        } catch (innerError) {
          hideCalcLoader();
          showNotification(`Error: ${innerError.message}`, 'error');
        }
      }).catch((error) => {
        showNotification(`Error: ${error.message}`, 'error');
        hideCalcLoader();
      });
    } else {
      showNotification('Failed to load graph', 'error');
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
};

/**
 * Handle loading an example graph
 * @param {Object} example - Example graph object
 */
const handleLoadExample = (example) => {
  try {
    // Special handling for random generator
    if (example.isRandomGenerator) {
      // Find the random-generator item
      const randomItem = document.querySelector('.random-generator');
      
      if (randomItem) {
        // Get values from inputs
        const verticesInput = randomItem.querySelector('.random-vertices');
        const edgesInput = randomItem.querySelector('.random-edges');
        
        let vertices = 5;
        let edges = 8;
        
        if (verticesInput && edgesInput) {
          vertices = parseInt(verticesInput.value, 10) || 5;
          edges = parseInt(edgesInput.value, 10) || 8;
          
          // Validate values
          if (vertices < 3) vertices = 3;
          if (vertices > 15) vertices = 15;
          
          if (edges < vertices) edges = vertices;
          if (edges > vertices * (vertices - 1) / 2) {
            edges = vertices * (vertices - 1) / 2;
          }
        }
        
        // Generate random Euler graph
        const randomGraph = generateRandomEulerGraph(vertices, edges);
        handleRegularExample(randomGraph);
        return;
      }
    }
    
    // Regular example handling
    handleRegularExample(example);
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
};

/**
 * Handle loading a regular (non-random) example graph
 * @param {Object} example - Example graph object
 */
const handleRegularExample = async (example) => {
  // Update UI state
  setState('graph.directed', example.directed);
  setState('graph.weighted', example.weighted);
  
  // Reset current graph ID since examples aren't saved
  setState('ui.savedGraphs.currentGraphId', null);
  setState('ui.savedGraphs.isModified', false);
  
  // Clear original data
  originalGraphData = null;
  
  // Update edge input
  const edgeInput = $('#edges');
  if (edgeInput) {
    edgeInput.value = example.edges;
  }
  
  // Parse edges first to get node count for conditional loader behavior
  let nodeCount = 0;
  try {
    const parsedEdges = parseEdgeInput(example.edges);
    
    const nodes = new Set();
    parsedEdges.forEach(edge => {
      nodes.add(edge.source);
      nodes.add(edge.target);
    });
    nodeCount = nodes.size || 50;
  } catch (error) {
    nodeCount = 50;
  }
  
  showCalcLoader('Loading Example...', nodeCount).then(() => {
    try {
      const parsedEdges = parseEdgeInput(example.edges);
      setState('graph.edges', parsedEdges);
      updateLoaderProgress('Rendering Graph...');
      
      const graphInstance = getGraph();
      
      if (graphInstance) {
        graphInstance.clear();
        graphInstance.directed = example.directed;
        graphInstance.weighted = example.weighted;

        const nodeSet = new Set();
        parsedEdges.forEach(edge => {
          nodeSet.add(edge.source);
          nodeSet.add(edge.target);
        });

        nodeSet.forEach(nodeId => {
          graphInstance.addNode(nodeId, {
            label: nodeId,
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5,
            size: 8,
            color: '#ff5a1f'
          });
        });

        parsedEdges.forEach(edge => {
          graphInstance.addEdge(edge.source, edge.target, { weight: edge.weight });
        });

        const graphModel = new Graph();
        graphModel.directed = example.directed;
        graphModel.weighted = example.weighted;

        nodeSet.forEach(nodeId => {
          graphModel.addNode({ id: nodeId });
        });

        parsedEdges.forEach(edge => {
          graphModel.addEdge(edge.source, edge.target, { weight: edge.weight });
        });

        renderGraph(graphModel);
      }

      updateLoaderProgress('Finding Euler Path...');
      calculateEulerPath(false);
      updateCurrentGraphSection();
      hideCalcLoader().then(() => {
        showNotification(`Loaded example "${example.name}"`, 'success');
      });
    } catch (innerError) {
      hideCalcLoader();
      showNotification(`Error: ${innerError.message}`, 'error');
    }
  }).catch((error) => {
    showNotification(`Error: ${error.message}`, 'error');
    hideCalcLoader();
  });
};

/**
 * Handle deleting a saved graph
 * @param {string} id - Graph ID
 */
const handleDeleteGraph = (id) => {
  try {
    // Check if this is the current graph
    const currentGraphId = getState().ui.savedGraphs.currentGraphId;
    const wasCurrentGraph = (id === currentGraphId);
    
    if (deleteGraph(id)) {
      // Reset states through state management
      setState('ui.savedGraphs.activeItemId', null);
      setState('ui.savedGraphs.confirmingDeleteId', null);
      
      // If we deleted the current graph, reset that state too
      if (wasCurrentGraph) {
        setState('ui.savedGraphs.currentGraphId', null);
        setState('ui.savedGraphs.isModified', false);
        originalGraphData = null;
        updateCurrentGraphSection();
      }
      
      // Update UI
      renderSavedGraphs(savedGraphsList);
      showNotification('Graph deleted', 'success');
    } else {
      showNotification('Failed to delete graph', 'error');
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
};

/**
 * Handle duplicating a saved graph
 * @param {string} id - Graph ID
 */
const handleDuplicateGraph = (id) => {
  try {
    const newGraph = duplicateGraph(id);
    
    if (newGraph) {
      // Set the new graph as active via state management
      setState('ui.savedGraphs.activeItemId', newGraph.id);
      setState('ui.savedGraphs.confirmingDeleteId', null);
      
      // Update UI
      renderSavedGraphs(savedGraphsList);
      showNotification(`Created duplicate "${newGraph.name}"`, 'success');
      
      // Scroll to the new graph
      setTimeout(() => {
        const newItem = document.querySelector(`.saved-graph-item[data-id="${newGraph.id}"]`);
        if (newItem) {
          newItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      showNotification('Failed to duplicate graph', 'error');
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
};

/**
 * Update current graph section
 */
const updateCurrentGraphSection = () => {
  if (!currentGraphSection) {
    currentGraphSection = $('.save-form');
    if (!currentGraphSection) return;
  }
  
  const state = getState();
  const hasEdges = state && state.graph && state.graph.edges && state.graph.edges.length > 0;
  const currentGraphId = state.ui.savedGraphs.currentGraphId;
  
  // Clear current content
  while (currentGraphSection.firstChild) {
    currentGraphSection.removeChild(currentGraphSection.firstChild);
  }
  
  if (!hasEdges) {
    // No graph data - show default message
    currentGraphSection.innerHTML = `
      <h3><i class="fas fa-project-diagram"></i>Current Graph</h3>
      <p class="current-graph-message">Create or select a graph to begin</p>
      <button id="save" class="btn btn-primary btn-edge-action" style="display: none;"><i class="fas fa-save"></i> SAVE NEW GRAPH</button>
    `;
  } else if (currentGraphId) {
    // Has a current saved graph
    const graph = loadGraph(currentGraphId);
    
    if (graph) {
      // Calculate node count from edges (simplified version)
      const nodes = new Set();
      let edgeCount = 0;
      const liveDirected = state.graph?.directed ?? graph.directed;
      const liveWeighted = state.graph?.weighted ?? graph.weighted;
      
      if (graph.edges.includes('[') && graph.edges.includes(']')) {
        const edgeMatches = graph.edges.match(/\[([^\]]+)\]/g) || [];
        edgeCount = edgeMatches.length;
        
        edgeMatches.forEach(match => {
          const parts = match.substring(1, match.length - 1).split(',').map(p => p.trim());
          if (parts.length >= 2) {
            nodes.add(parts[0]);
            // For weighted graphs, parts[1] is the target node, otherwise it's the last part
            const targetNodeIndex = liveWeighted ? 1 : parts.length - 1;
            nodes.add(parts[targetNodeIndex]);
          }
        });
      }
      
      const nodeCount = nodes.size;
      
      // Create property icons
      const directedIcon = liveDirected ? 'fa-long-arrow-alt-right' : 'fa-exchange-alt';
      const weightedIcon = liveWeighted ? 'fa-weight-hanging' : 'fa-minus';
      
      currentGraphSection.innerHTML = `
        <h3><i class="fas fa-save"></i>Current Graph</h3>
        <div class="current-graph-info">
          <div class="current-graph-name">${graph.name}</div>
          <div class="current-graph-stats">
            <span class="graph-stat"><i class="fas fa-project-diagram"></i> ${nodeCount} nodes</span>
            <span class="graph-stat"><i class="fas fa-link"></i> ${edgeCount} edges</span>
            <span class="graph-stat"><i class="fas ${directedIcon}"></i> ${liveDirected ? 'Directed' : 'Undirected'}</span>
            <span class="graph-stat"><i class="fas ${weightedIcon}"></i> ${liveWeighted ? 'Weighted' : 'Unweighted'}</span>
          </div>
        </div>
        <div class="current-graph-actions">
          <button id="view-graph" class="btn btn-secondary btn-small" data-id="${graph.id}">VIEW DETAILS</button>
          <button id="save" class="btn btn-primary btn-edge-action"><i class="fas fa-save"></i> SAVE GRAPH</button>
        </div>
      `;
      
      // Add event listener to view graph button
      setTimeout(() => {
        const viewGraphBtn = $('#view-graph');
        if (viewGraphBtn) {
          viewGraphBtn.addEventListener('click', () => {
            const id = viewGraphBtn.getAttribute('data-id');
            if (id) {
              setState('ui.savedGraphs.activeItemId', id);
              
              // First make sure the saved graphs section is expanded
              const savedSection = document.querySelector('.saved-section:not(:first-child)');
              if (savedSection && savedSection.classList.contains('collapsed')) {
                // Expand the section
                savedSection.classList.remove('collapsed');
                savedSectionCollapsed = false;
              }
              
              // Scroll to the graph with a slight delay to allow for section expansion
              setTimeout(() => {
                const graphItem = document.querySelector(`.saved-graph-item[data-id="${id}"]`);
                if (graphItem) {
                  graphItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }, 200);
            }
          });
        }
      }, 0);
    } else {
      // Current graph not found (might have been deleted)
      setState('ui.savedGraphs.currentGraphId', null);
      currentGraphSection.innerHTML = `
        <h3><i class="fas fa-project-diagram"></i>Current Graph</h3>
        <p class="current-graph-message">New unsaved graph</p>
        <button id="save" class="btn btn-primary btn-edge-action"><i class="fas fa-save"></i> SAVE NEW GRAPH</button>
      `;
    }
  } else {
    // Has edges but no saved reference - new graph
    currentGraphSection.innerHTML = `
      <h3><i class="fas fa-project-diagram"></i>Current Graph</h3>
      <p class="current-graph-message">New unsaved graph</p>
      <button id="save" class="btn btn-primary btn-edge-action"><i class="fas fa-save"></i> SAVE NEW GRAPH</button>
    `;
  }
  
  // Re-attach save button event
  const saveButton = $('#save');
  if (saveButton) {
    saveButton.addEventListener('click', handleSave);
  }
};

/**
 * Check for graph changes
 */
const checkForGraphChanges = () => {
  const state = getState();
  const currentGraphId = state.ui.savedGraphs.currentGraphId;
  
  if (currentGraphId) {
    const graph = loadGraph(currentGraphId);
    
    if (graph && originalGraphData) {
      // Generate current edge string format for comparison
      let currentEdges = '';
      const edges = state.graph.edges;
      const weighted = state.graph.weighted;
      
      if (edges && edges.length > 0) {
        if (weighted) {
          currentEdges = edges.map(e => `[${e.source},${e.target},${e.weight}]`).join(',');
        } else {
          currentEdges = edges.map(e => `[${e.source},${e.target}]`).join(',');
        }
      }
      
      // Compare with original
      const hasChanged = 
        currentEdges !== originalGraphData.edges ||
        state.graph.directed !== originalGraphData.directed ||
        state.graph.weighted !== originalGraphData.weighted;
      
      // Update modification state
      setState('ui.savedGraphs.isModified', hasChanged);
    }
  }
  
  // Always update save button state when graph changes
  updateSaveButtonState();
  updateCurrentGraphSection();
}; 

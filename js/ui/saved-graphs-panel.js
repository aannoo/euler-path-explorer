/**
 * Saved Graphs Panel Module
 * Main orchestration for saved graphs functionality
 * Split from saved-graphs.js for better maintainability
 *
 * Migration from saved-graphs.js (1,450 lines) to modular structure:
 * - graph-cards.js (~250 lines) - UI card components
 * - import-export.js (~200 lines) - Import/export functionality
 * - saved-graphs-panel.js (~300 lines) - Main orchestration (this file)
 */

import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { getState, setState, subscribe } from '../core/state.js';
import { showNotification } from './notifications.js';
import {
  getSavedGraphs,
  getExampleGraphs,
  saveCurrentGraph,
  loadGraph,
  deleteGraph,
  duplicateGraph
} from '../core/storage.js';
import { parseEdgeInput } from '../graph/sigma-controller.js';
import { createSavedItemHTML, createExampleItemHTML, parseGraphStats } from './graph-cards.js';
import { exportGraphToJSON, importGraphFromJSON, createImportInput } from './import-export.js';

// Module state
let savedGraphsList = null;
let currentGraphSection = null;
let originalGraphData = null;
let examplesSectionCollapsed = false;
let savedSectionCollapsed = false;

/**
 * Initialize saved graphs panel
 * @returns {Object} Panel API
 */
export function initializeSavedGraphs() {
  savedGraphsList = $('#saved-graphs-list');
  currentGraphSection = $('.save-form');
  const saveButton = $('#save');

  // Initialize state
  initializeState();

  if (!savedGraphsList) {
    return { update: () => {} };
  }

  // Set up save button
  if (saveButton) {
    saveButton.addEventListener('click', handleSave);
    updateSaveButtonState();
  }

  // Initial render
  renderSavedGraphs();
  updateCurrentGraphSection();

  // Set up subscriptions
  setupSubscriptions();

  return {
    update: () => {
      renderSavedGraphs();
      updateCurrentGraphSection();
    }
  };
}

/**
 * Initialize saved graphs state
 */
function initializeState() {
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
  }
}

/**
 * Set up state subscriptions
 */
function setupSubscriptions() {
  subscribe('ui.savedGraphs.activeItemId', (activeId) => {
    renderSavedGraphs();
    if (activeId) {
      handleGraphLoad(activeId);
    }
  });

  subscribe('ui.savedGraphs.confirmingDeleteId', () => {
    renderSavedGraphs();
  });

  subscribe('ui.savedGraphs.editingItemId', (editingId) => {
    if (editingId) {
      setTimeout(() => focusEditInput(editingId), 10);
    }
  });

  subscribe('ui.activeTab', (activeTab) => {
    if (activeTab === 'saved') {
      updateSaveButtonState();
      updateCurrentGraphSection();
      checkForGraphChanges();
    }
  });

  // Listen for graph changes
  ['graph.edges', 'graph.directed', 'graph.weighted'].forEach(path => {
    subscribe(path, checkForGraphChanges);
  });
}

/**
 * Handle graph load from active item
 */
function handleGraphLoad(activeId) {
  const graph = loadGraph(activeId);
  if (graph) {
    setState('ui.savedGraphs.currentGraphId', activeId);
    setState('ui.savedGraphs.isModified', false);
    originalGraphData = {
      edges: graph.edges,
      directed: graph.directed,
      weighted: graph.weighted
    };
    updateCurrentGraphSection();
  }
}

/**
 * Focus edit input for renaming
 */
function focusEditInput(editingId) {
  const nameInput = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-input`);
  const nameDisplay = document.querySelector(`.saved-graph-item[data-id="${editingId}"] .saved-graph-name`);

  if (nameInput && nameDisplay) {
    nameDisplay.style.display = 'none';
    nameInput.style.display = 'block';
    nameInput.focus();
    nameInput.select();
  }
}

/**
 * Handle save button click
 */
function handleSave() {
  try {
    const state = getState();
    const currentGraphId = state.ui.savedGraphs?.currentGraphId;
    let graph = null;

    if (currentGraphId) {
      const existingGraph = loadGraph(currentGraphId);
      if (existingGraph) {
        graph = saveCurrentGraph(existingGraph.name);
        if (graph) {
          deleteGraph(currentGraphId);
        }
      } else {
        graph = saveCurrentGraph();
      }
    } else {
      graph = saveCurrentGraph();
    }

    if (graph) {
      setState('ui.savedGraphs.currentGraphId', graph.id);
      setState('ui.savedGraphs.activeItemId', graph.id);
      setState('ui.savedGraphs.isModified', false);

      originalGraphData = {
        edges: graph.edges,
        directed: graph.directed,
        weighted: graph.weighted
      };

      renderSavedGraphs();
      updateCurrentGraphSection();
      showNotification(`Graph saved as "${graph.name}"`, 'success');

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
}

/**
 * Render saved graphs list
 */
function renderSavedGraphs() {
  if (!savedGraphsList) return;

  savedGraphsList.innerHTML = '';

  const examples = getExampleGraphs();
  const savedGraphs = getSavedGraphs();
  const sortedSavedGraphs = [...savedGraphs].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Auto-collapse examples if there are saved graphs
  if (savedGraphs.length > 0) {
    examplesSectionCollapsed = true;
  }

  // Example Graphs section
  const examplesHTML = `
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
  savedGraphsList.insertAdjacentHTML('beforeend', examplesHTML);

  // Saved Graphs section
  const savedHTML = `
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
  savedGraphsList.insertAdjacentHTML('beforeend', savedHTML);

  attachEventListeners();
}

/**
 * Attach event listeners to graph items
 */
function attachEventListeners() {
  // Section headers - toggle collapse
  const sectionHeaders = savedGraphsList.querySelectorAll('.saved-section h4');
  sectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.saved-section');
      section.classList.toggle('collapsed');
    });
  });

  // Graph items - click to select/load
  const graphItems = savedGraphsList.querySelectorAll('.saved-graph-item');
  graphItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;

      const id = item.dataset.id;
      const index = item.dataset.index;

      if (id) {
        handleSavedGraphClick(id);
      } else if (index !== undefined) {
        handleExampleClick(parseInt(index));
      }
    });
  });

  // Action buttons
  attachActionButtonListeners();
}

/**
 * Handle saved graph item click
 */
function handleSavedGraphClick(id) {
  const currentActiveId = getState().ui.savedGraphs?.activeItemId;

  if (currentActiveId === id) {
    // Already active - load the graph
    const graph = loadGraph(id);
    if (graph) {
      applyGraphToEditor(graph);
    }
  } else {
    // Set as active
    setState('ui.savedGraphs.activeItemId', id);
    setState('ui.savedGraphs.confirmingDeleteId', null);
  }
}

/**
 * Handle example graph click
 */
function handleExampleClick(index) {
  const examples = getExampleGraphs();
  const example = examples[index];

  if (example) {
    applyGraphToEditor(example);
    showNotification(`Loaded example: ${example.name}`, 'info');
  }
}

/**
 * Apply graph data to editor
 */
function applyGraphToEditor(graph) {
  const edgesInput = $('#edges');
  const directedInput = $('#directed');
  const weightedInput = $('#weighted');

  if (edgesInput) edgesInput.value = graph.edges;
  if (directedInput) directedInput.value = graph.directed ? 'true' : 'false';
  if (weightedInput) weightedInput.value = graph.weighted ? 'true' : 'false';

  setState('graph.directed', graph.directed);
  setState('graph.weighted', graph.weighted);

  // Trigger calculation
  const calculateBtn = $('#calculate');
  if (calculateBtn) {
    calculateBtn.click();
  }
}

/**
 * Attach action button listeners
 */
function attachActionButtonListeners() {
  // Duplicate buttons
  savedGraphsList.querySelectorAll('.duplicate-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.saved-graph-item');
      const id = item?.dataset.id;
      if (id) {
        const newGraph = duplicateGraph(id);
        if (newGraph) {
          renderSavedGraphs();
          showNotification(`Duplicated as "${newGraph.name}"`, 'success');
        }
      }
    });
  });

  // Remove buttons
  savedGraphsList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.saved-graph-item');
      const id = item?.dataset.id;
      if (id) {
        setState('ui.savedGraphs.confirmingDeleteId', id);
      }
    });
  });

  // Confirm delete buttons
  savedGraphsList.querySelectorAll('.confirm-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.saved-graph-item');
      const id = item?.dataset.id;
      if (id) {
        deleteGraph(id);
        setState('ui.savedGraphs.activeItemId', null);
        setState('ui.savedGraphs.confirmingDeleteId', null);
        renderSavedGraphs();
        showNotification('Graph deleted', 'info');
      }
    });
  });

  // Cancel delete buttons
  savedGraphsList.querySelectorAll('.cancel-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setState('ui.savedGraphs.confirmingDeleteId', null);
    });
  });
}

/**
 * Update save button state
 */
function updateSaveButtonState() {
  const state = getState();
  const hasEdges = state?.graph?.edges?.length > 0;
  const isModified = state?.ui?.savedGraphs?.isModified;
  const currentGraphId = state?.ui?.savedGraphs?.currentGraphId;

  const saveButton = $('#save');
  if (saveButton) {
    saveButton.style.display = hasEdges ? 'block' : 'none';

    if (currentGraphId && isModified) {
      saveButton.innerHTML = '<i class="fas fa-save"></i> UPDATE GRAPH';
    } else if (currentGraphId) {
      saveButton.innerHTML = '<i class="fas fa-save"></i> SAVE GRAPH';
    } else {
      saveButton.innerHTML = '<i class="fas fa-save"></i> SAVE NEW GRAPH';
    }
  }
}

/**
 * Update current graph section display
 */
function updateCurrentGraphSection() {
  // Implementation for current graph info display
}

/**
 * Check for graph changes
 */
function checkForGraphChanges() {
  if (!originalGraphData) return;

  const state = getState();
  const edgesInput = $('#edges');
  const currentEdges = edgesInput?.value || '';
  const currentDirected = state?.graph?.directed;
  const currentWeighted = state?.graph?.weighted;

  const isModified = (
    currentEdges !== originalGraphData.edges ||
    currentDirected !== originalGraphData.directed ||
    currentWeighted !== originalGraphData.weighted
  );

  if (isModified !== state?.ui?.savedGraphs?.isModified) {
    setState('ui.savedGraphs.isModified', isModified);
    updateSaveButtonState();
  }
}

// Re-export for backward compatibility
export { initializeSavedGraphs as default };

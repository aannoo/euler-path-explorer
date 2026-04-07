/**
 * Graph Cards UI Module
 * UI components for displaying saved and example graph cards
 * Split from saved-graphs.js for better maintainability
 */

import { getState } from '../core/state.js';

/**
 * Create HTML for a saved graph item card
 * @param {Object} graph - Graph object
 * @returns {string} HTML string
 */
export function createSavedItemHTML(graph) {
  const state = getState().ui.savedGraphs || {};
  const isActive = graph.id === state.activeItemId;
  const isConfirmingDelete = graph.id === state.confirmingDeleteId;

  // Calculate node count from edges
  const { nodeCount, edgeCount } = parseGraphStats(graph);

  // Create action buttons HTML
  const actionsHTML = createActionsHTML(isActive, isConfirmingDelete);

  // Create property icons
  const directedIcon = graph.directed ? 'fa-long-arrow-alt-right' : 'fa-exchange-alt';
  const weightedIcon = graph.weighted ? 'fa-weight-hanging' : 'fa-minus';
  const directedText = graph.directed ? 'Directed' : 'Undirected';
  const weightedText = graph.weighted ? 'Weighted' : 'Unweighted';

  // Format date
  const dateDisplay = formatDate(graph.date);

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
}

/**
 * Create HTML for an example graph item card
 * @param {Object} graph - Graph object
 * @param {number} index - Example index
 * @returns {string} HTML string
 */
export function createExampleItemHTML(graph, index) {
  // Special handling for random generator
  if (graph.isRandomGenerator) {
    return createRandomGeneratorHTML(graph, index);
  }

  // Calculate stats
  const { nodeCount, edgeCount } = parseGraphStats(graph);

  // Property icons
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
}

/**
 * Create HTML for random generator card
 * @param {Object} graph - Graph object
 * @param {number} index - Example index
 * @returns {string} HTML string
 */
function createRandomGeneratorHTML(graph, index) {
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

/**
 * Create actions HTML based on state
 * @param {boolean} isActive - Is card active
 * @param {boolean} isConfirmingDelete - Is confirming delete
 * @returns {string} HTML string
 */
function createActionsHTML(isActive, isConfirmingDelete) {
  if (!isActive) return '';

  if (isConfirmingDelete) {
    return `
      <div class="saved-graph-actions">
        <div class="confirmation-message">Are you sure you want to delete this graph?</div>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-saved-action cancel-delete-btn"><i class="fas fa-times"></i> CANCEL</button>
          <button class="btn btn-warning btn-saved-action confirm-delete-btn"><i class="fas fa-trash"></i> DELETE</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="saved-graph-actions">
      <div class="action-buttons">
        <button class="btn btn-secondary btn-saved-action duplicate-btn"><i class="fas fa-copy"></i> DUPLICATE</button>
        <button class="btn btn-secondary btn-saved-action remove-btn"><i class="fas fa-trash"></i> REMOVE</button>
      </div>
    </div>
  `;
}

/**
 * Parse graph statistics (node and edge count)
 * @param {Object} graph - Graph object
 * @returns {Object} { nodeCount, edgeCount }
 */
export function parseGraphStats(graph) {
  const nodes = new Set();
  let edgeCount = 0;

  if (!graph.edges) {
    return { nodeCount: 0, edgeCount: 0 };
  }

  if (graph.edges.includes('[') && graph.edges.includes(']')) {
    // Handle bracket notation format
    const edgeMatches = graph.edges.match(/\[([^\]]+)\]/g) || [];
    edgeCount = edgeMatches.length;

    edgeMatches.forEach(match => {
      const parts = match.substring(1, match.length - 1).split(',').map(p => p.trim());
      if (parts.length >= 2) {
        nodes.add(parts[0]);
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
          const targetNodeIndex = graph.weighted ? 1 : parts.length - 1;
          nodes.add(parts[targetNodeIndex]);
        }
      }
    });
  }

  return { nodeCount: nodes.size, edgeCount };
}

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';

  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Create section header HTML
 * @param {string} title - Section title
 * @param {string} icon - FontAwesome icon class
 * @param {boolean} collapsed - Is section collapsed
 * @returns {string} HTML string
 */
export function createSectionHeaderHTML(title, icon, collapsed) {
  return `
    <div class="saved-section ${collapsed ? 'collapsed' : ''}">
      <h4><i class="fas ${icon}"></i> ${title}</h4>
      <div class="saved-graphs-items">
  `;
}

/**
 * Close section HTML
 * @returns {string} HTML string
 */
export function closeSectionHTML() {
  return `
      </div>
    </div>
  `;
}

/**
 * Import/Export Module
 * Graph import and export functionality
 * Split from saved-graphs.js for better maintainability
 */

import { getState, setState } from '../core/state.js';
import { showNotification } from './notifications.js';
import { saveCurrentGraph, loadGraph, getSavedGraphs } from '../core/storage.js';

/**
 * Export graph to JSON file
 * @param {Object} graph - Graph object to export
 */
export function exportGraphToJSON(graph) {
  if (!graph) {
    showNotification('No graph to export', 'error');
    return;
  }

  try {
    const exportData = {
      name: graph.name,
      edges: graph.edges,
      directed: graph.directed,
      weighted: graph.weighted,
      date: graph.date || new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graph.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`Exported "${graph.name}"`, 'success');
  } catch (error) {
    console.error('Export error:', error);
    showNotification('Failed to export graph', 'error');
  }
}

/**
 * Import graph from JSON file
 * @param {File} file - File to import
 * @returns {Promise<Object|null>} Imported graph or null
 */
export async function importGraphFromJSON(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate required fields
        if (!data.edges) {
          showNotification('Invalid graph file: missing edges', 'error');
          resolve(null);
          return;
        }

        // Create graph object
        const graph = {
          id: Date.now().toString(),
          name: data.name || file.name.replace('.json', ''),
          edges: data.edges,
          directed: data.directed || false,
          weighted: data.weighted || false,
          date: new Date().toISOString()
        };

        // Save to storage
        const saved = saveImportedGraph(graph);
        if (saved) {
          showNotification(`Imported "${graph.name}"`, 'success');
          resolve(graph);
        } else {
          showNotification('Failed to save imported graph', 'error');
          resolve(null);
        }
      } catch (error) {
        console.error('Import error:', error);
        showNotification('Invalid JSON file', 'error');
        resolve(null);
      }
    };

    reader.onerror = () => {
      showNotification('Failed to read file', 'error');
      resolve(null);
    };

    reader.readAsText(file);
  });
}

/**
 * Save an imported graph to localStorage
 * @param {Object} graph - Graph object
 * @returns {boolean} Success
 */
function saveImportedGraph(graph) {
  try {
    const savedGraphs = getSavedGraphs();
    savedGraphs.push(graph);
    localStorage.setItem('euler_saved_graphs', JSON.stringify(savedGraphs));
    return true;
  } catch (error) {
    console.error('Error saving imported graph:', error);
    return false;
  }
}

/**
 * Export all saved graphs to a single JSON file
 */
export function exportAllGraphs() {
  const savedGraphs = getSavedGraphs();

  if (savedGraphs.length === 0) {
    showNotification('No saved graphs to export', 'error');
    return;
  }

  try {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      graphs: savedGraphs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `euler_graphs_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`Exported ${savedGraphs.length} graphs`, 'success');
  } catch (error) {
    console.error('Export all error:', error);
    showNotification('Failed to export graphs', 'error');
  }
}

/**
 * Import multiple graphs from a backup file
 * @param {File} file - Backup file
 * @returns {Promise<number>} Number of graphs imported
 */
export async function importAllGraphs(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.graphs || !Array.isArray(data.graphs)) {
          showNotification('Invalid backup file format', 'error');
          resolve(0);
          return;
        }

        let importCount = 0;
        const savedGraphs = getSavedGraphs();

        data.graphs.forEach(graph => {
          // Generate new ID to avoid conflicts
          const newGraph = {
            ...graph,
            id: Date.now().toString() + '_' + importCount,
            date: new Date().toISOString()
          };

          savedGraphs.push(newGraph);
          importCount++;
        });

        localStorage.setItem('euler_saved_graphs', JSON.stringify(savedGraphs));
        showNotification(`Imported ${importCount} graphs`, 'success');
        resolve(importCount);
      } catch (error) {
        console.error('Import all error:', error);
        showNotification('Invalid backup file', 'error');
        resolve(0);
      }
    };

    reader.onerror = () => {
      showNotification('Failed to read backup file', 'error');
      resolve(0);
    };

    reader.readAsText(file);
  });
}

/**
 * Create file input for import
 * @param {Function} onImport - Callback with imported graph
 * @returns {HTMLInputElement} File input element
 */
export function createImportInput(onImport) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.style.display = 'none';

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const graph = await importGraphFromJSON(file);
      if (graph && onImport) {
        onImport(graph);
      }
    }
    input.value = '';
  });

  return input;
}

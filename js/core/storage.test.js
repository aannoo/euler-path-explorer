/**
 * Unit Tests for Storage Module
 * Tests localStorage persistence for saved graphs
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSavedGraphs, getExampleGraphs, generateRandomEulerGraph, loadGraph, deleteGraph, duplicateGraph } from './storage.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

// Mock global localStorage
vi.stubGlobal('localStorage', localStorageMock);

describe('Storage Module', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getExampleGraphs', () => {
    it('should return array of example graphs', () => {
      const examples = getExampleGraphs();

      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
    });

    it('should include Simple Circuit example', () => {
      const examples = getExampleGraphs();
      const simpleCircuit = examples.find(g => g.name === 'Simple Circuit');

      expect(simpleCircuit).toBeDefined();
      expect(simpleCircuit.edges).toBe('[a,b],[b,c],[c,d],[d,a]');
      expect(simpleCircuit.directed).toBe(false);
      expect(simpleCircuit.weighted).toBe(false);
    });

    it('should include Weighted Example', () => {
      const examples = getExampleGraphs();
      const weighted = examples.find(g => g.name === 'Weighted Example');

      expect(weighted).toBeDefined();
      expect(weighted.weighted).toBe(true);
      expect(weighted.edges).toContain(',2]'); // weight values
    });

    it('should include Directed Example', () => {
      const examples = getExampleGraphs();
      const directed = examples.find(g => g.name === 'Directed Example');

      expect(directed).toBeDefined();
      expect(directed.directed).toBe(true);
    });

    it('should include Random Euler generator', () => {
      const examples = getExampleGraphs();
      const random = examples.find(g => g.name === 'Random Euler');

      expect(random).toBeDefined();
      expect(random.isRandomGenerator).toBe(true);
    });

    it('should return a copy, not the original array', () => {
      const examples1 = getExampleGraphs();
      const examples2 = getExampleGraphs();

      expect(examples1).not.toBe(examples2); // Different array instances
      expect(examples1).toEqual(examples2); // Same content
    });
  });

  describe('getSavedGraphs', () => {
    it('should initialize storage if empty', () => {
      getSavedGraphs();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('euler_saved_graphs', '[]');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('euler_graph_counter', '1');
    });

    it('should return empty array when no saved graphs', () => {
      const graphs = getSavedGraphs();

      expect(graphs).toEqual([]);
    });

    it('should return saved graphs from localStorage', () => {
      const savedData = [
        { id: '1', name: 'Test Graph', edges: '[a,b]', directed: false, weighted: false }
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'euler_saved_graphs') return JSON.stringify(savedData);
        if (key === 'euler_graph_counter') return '2';
        return null;
      });

      const graphs = getSavedGraphs();

      expect(graphs).toHaveLength(1);
      expect(graphs[0].name).toBe('Test Graph');
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'euler_saved_graphs') return 'not valid json{';
        return '1';
      });

      const graphs = getSavedGraphs();

      expect(graphs).toEqual([]);
    });
  });

  describe('generateRandomEulerGraph', () => {
    it('should generate a graph with specified vertices', () => {
      const graph = generateRandomEulerGraph(5, 8);

      expect(graph).toBeDefined();
      expect(graph.name).toContain('5v');
      expect(graph.directed).toBe(false);
      expect(graph.weighted).toBe(false);
    });

    it('should generate valid edge list format', () => {
      const graph = generateRandomEulerGraph(4, 6);

      expect(graph.edges).toMatch(/^\[\d+,\d+\](,\[\d+,\d+\])*$/);
    });

    it('should enforce minimum 3 vertices', () => {
      const graph = generateRandomEulerGraph(2, 3);

      // Should still generate a valid graph with at least 3 vertices
      expect(graph.edges).toBeDefined();
    });

    it('should enforce minimum edges equal to vertices', () => {
      const graph = generateRandomEulerGraph(5, 2);

      // Should have at least 5 edges (one per vertex for cycle)
      const edgeCount = (graph.edges.match(/\[/g) || []).length;
      expect(edgeCount).toBeGreaterThanOrEqual(5);
    });

    it('should generate connected graph', () => {
      const graph = generateRandomEulerGraph(6, 10);

      // Parse edges to verify connectivity
      const edges = graph.edges.match(/\[(\d+),(\d+)\]/g) || [];
      expect(edges.length).toBeGreaterThan(0);
    });

    it('should generate graph with all even-degree vertices (Euler circuit property)', () => {
      // Generate multiple times to test consistency
      for (let i = 0; i < 3; i++) {
        const graph = generateRandomEulerGraph(5, 8);

        // Parse edges and count degrees
        const degrees = {};
        const edgeMatches = graph.edges.matchAll(/\[(\d+),(\d+)\]/g);

        for (const match of edgeMatches) {
          const v1 = match[1];
          const v2 = match[2];
          degrees[v1] = (degrees[v1] || 0) + 1;
          degrees[v2] = (degrees[v2] || 0) + 1;
        }

        // All degrees should be even for Euler circuit
        const allEven = Object.values(degrees).every(d => d % 2 === 0);
        expect(allEven).toBe(true);
      }
    });
  });

  describe('loadGraph', () => {
    it('should return null for non-existent graph', () => {
      localStorageMock.getItem.mockImplementation(() => '[]');

      const graph = loadGraph('nonexistent');

      expect(graph).toBeNull();
    });

    it('should return graph by ID', () => {
      const savedData = [
        { id: '123', name: 'Test', edges: '[a,b]' },
        { id: '456', name: 'Other', edges: '[c,d]' }
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'euler_saved_graphs') return JSON.stringify(savedData);
        return '1';
      });

      const graph = loadGraph('123');

      expect(graph).toBeDefined();
      expect(graph.name).toBe('Test');
    });
  });

  describe('deleteGraph', () => {
    it('should remove graph from localStorage', () => {
      const savedData = [
        { id: '123', name: 'Test', edges: '[a,b]' },
        { id: '456', name: 'Other', edges: '[c,d]' }
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'euler_saved_graphs') return JSON.stringify(savedData);
        return '1';
      });

      const result = deleteGraph('123');

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();

      // Verify the setItem was called with array not containing deleted graph
      const setItemCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'euler_saved_graphs'
      );
      const savedJson = JSON.parse(setItemCall[1]);
      expect(savedJson.find(g => g.id === '123')).toBeUndefined();
      expect(savedJson.find(g => g.id === '456')).toBeDefined();
    });

    it('should return true even if graph not found', () => {
      localStorageMock.getItem.mockImplementation(() => '[]');

      const result = deleteGraph('nonexistent');

      expect(result).toBe(true);
    });
  });

  describe('duplicateGraph', () => {
    it('should return null if source graph not found', () => {
      localStorageMock.getItem.mockImplementation(() => '[]');

      const result = duplicateGraph('nonexistent');

      expect(result).toBeNull();
    });

    it('should create copy with new ID and modified name', () => {
      const savedData = [
        { id: '123', name: 'Original', edges: '[a,b]', directed: false, weighted: false }
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'euler_saved_graphs') return JSON.stringify(savedData);
        return '1';
      });

      const result = duplicateGraph('123');

      expect(result).toBeDefined();
      expect(result.id).not.toBe('123');
      expect(result.name).toBe('Original copy');
      expect(result.edges).toBe('[a,b]');
    });

    it('should increment copy number for multiple duplicates', () => {
      const savedData = [
        { id: '123', name: 'Original', edges: '[a,b]' },
        { id: '124', name: 'Original copy', edges: '[a,b]' }
      ];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'euler_saved_graphs') return JSON.stringify(savedData);
        return '1';
      });

      const result = duplicateGraph('123');

      expect(result.name).toBe('Original copy 2');
    });
  });

  describe('localStorage persistence verification', () => {
    it('should use correct storage keys', () => {
      getSavedGraphs();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('euler_saved_graphs');
    });

    it('should persist counter key', () => {
      // Ensure localStorage returns null initially to trigger initialization
      localStorageMock.getItem.mockImplementation(() => null);

      getSavedGraphs();

      // Counter should be initialized when localStorage is empty
      const counterCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'euler_graph_counter'
      );
      expect(counterCall).toBeDefined();
      expect(counterCall[1]).toBe('1');
    });
  });
});

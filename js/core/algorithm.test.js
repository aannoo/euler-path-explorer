/**
 * Unit Tests for Algorithm Module
 * Tests Euler path detection, Chinese Postman algorithm, and helper functions
 */

import { describe, it, expect } from 'vitest';
import { findEulerPath, chinesePostmanAlgorithm, buildAdjacencyList, getExplanation } from './algorithm.js';

describe('buildAdjacencyList', () => {
  it('should build adjacency list from edges for undirected graph', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' }
    ];
    const result = buildAdjacencyList(edges, false);

    expect(result.a).toBeDefined();
    expect(result.b).toBeDefined();
    expect(result.c).toBeDefined();
    // Undirected: a->b and b->a should both exist
    expect(result.a.some(e => e.vertex === 'b')).toBe(true);
    expect(result.b.some(e => e.vertex === 'a')).toBe(true);
  });

  it('should build adjacency list for directed graph', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' }
    ];
    const result = buildAdjacencyList(edges, true);

    // Directed: only forward edges
    expect(result.a.some(e => e.vertex === 'b')).toBe(true);
    expect(result.b.some(e => e.vertex === 'a')).toBe(false);
  });

  it('should handle weighted edges', () => {
    const edges = [
      { source: 'a', target: 'b', weight: 5 },
      { source: 'b', target: 'c', weight: 3 }
    ];
    const result = buildAdjacencyList(edges, false);

    const edgeAB = result.a.find(e => e.vertex === 'b');
    expect(edgeAB.weight).toBe(5);
  });

  it('should default weight to 1 if not specified', () => {
    const edges = [{ source: 'a', target: 'b' }];
    const result = buildAdjacencyList(edges, false);

    const edgeAB = result.a.find(e => e.vertex === 'b');
    expect(edgeAB.weight).toBe(1);
  });

  it('should handle empty edge array', () => {
    const result = buildAdjacencyList([], false);
    expect(Object.keys(result)).toHaveLength(0);
  });
});

describe('findEulerPath', () => {
  describe('Empty and trivial graphs', () => {
    it('should handle empty graph', () => {
      const result = findEulerPath({});

      expect(result.hasPath).toBe(false);
      expect(result.hasCircuit).toBe(false);
      expect(result.path).toEqual([]);
      expect(result.explanation).toBe('Graph is empty');
    });

    it('should handle single vertex with no edges', () => {
      const graph = { 'a': [] };
      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(true);
      expect(result.hasCircuit).toBe(true);
      expect(result.path).toEqual(['a']);
    });
  });

  describe('Euler Circuit detection (all even degrees)', () => {
    it('should find Euler circuit in triangle graph', () => {
      // Triangle: a-b-c-a (all vertices have degree 4 in undirected adjacency list)
      // In undirected graph, each edge appears twice (once per direction)
      const graph = {
        'a': [{ vertex: 'b', weight: 1 }, { vertex: 'c', weight: 1 }],
        'b': [{ vertex: 'a', weight: 1 }, { vertex: 'c', weight: 1 }],
        'c': [{ vertex: 'a', weight: 1 }, { vertex: 'b', weight: 1 }]
      };
      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(true);
      expect(result.hasCircuit).toBe(true);
      // Path visits each edge once in each direction (6 edges total) + return = 7 vertices
      expect(result.path.length).toBe(7);
      expect(result.path[0]).toBe(result.path[result.path.length - 1]); // Circuit: starts and ends same
    });

    it('should reject disconnected graphs even when every vertex has even degree', () => {
      const graph = {
        'a': [{ vertex: 'b', weight: 1 }, { vertex: 'c', weight: 1 }],
        'b': [{ vertex: 'a', weight: 1 }, { vertex: 'c', weight: 1 }],
        'c': [{ vertex: 'a', weight: 1 }, { vertex: 'b', weight: 1 }],
        'd': [{ vertex: 'e', weight: 1 }, { vertex: 'f', weight: 1 }],
        'e': [{ vertex: 'd', weight: 1 }, { vertex: 'f', weight: 1 }],
        'f': [{ vertex: 'd', weight: 1 }, { vertex: 'e', weight: 1 }]
      };

      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(false);
      expect(result.hasCircuit).toBe(false);
      expect(result.path).toEqual([]);
      expect(result.explanation).toContain('not connected');
    });

    it('should find Euler circuit in square graph', () => {
      // Square: a-b-c-d-a
      const graph = {
        'a': [{ vertex: 'b', weight: 1 }, { vertex: 'd', weight: 1 }],
        'b': [{ vertex: 'a', weight: 1 }, { vertex: 'c', weight: 1 }],
        'c': [{ vertex: 'b', weight: 1 }, { vertex: 'd', weight: 1 }],
        'd': [{ vertex: 'c', weight: 1 }, { vertex: 'a', weight: 1 }]
      };
      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(true);
      expect(result.hasCircuit).toBe(true);
    });
  });

  describe('Euler Path detection (exactly 2 odd degree vertices)', () => {
    it('should find Euler path in simple path graph', () => {
      // Path: a-b-c (undirected, so 4 edges total: a->b, b->a, b->c, c->b)
      // a has degree 1, b has degree 2, c has degree 1 (odd: a, c)
      const graph = {
        'a': [{ vertex: 'b', weight: 1 }],
        'b': [{ vertex: 'a', weight: 1 }, { vertex: 'c', weight: 1 }],
        'c': [{ vertex: 'b', weight: 1 }]
      };
      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(true);
      expect(result.hasCircuit).toBe(false);
      // Path traverses 4 edges (each edge in both directions) = 5 vertices
      expect(result.path.length).toBe(5);
    });

    it('should find Euler path starting from specified vertex', () => {
      const graph = {
        'a': [{ vertex: 'b', weight: 1 }],
        'b': [{ vertex: 'a', weight: 1 }, { vertex: 'c', weight: 1 }],
        'c': [{ vertex: 'b', weight: 1 }]
      };
      const result = findEulerPath(graph, 'a');

      expect(result.hasPath).toBe(true);
      expect(result.path[0]).toBe('a');
    });
  });

  describe('No Euler Path (more than 2 odd degree vertices)', () => {
    it('should detect no Euler path when 4 vertices have odd degree', () => {
      // Graph where each vertex has odd degree (1 edge each = degree 1)
      // Star graph with center having degree 3
      const graph = {
        'center': [{ vertex: 'a', weight: 1 }, { vertex: 'b', weight: 1 }, { vertex: 'c', weight: 1 }],
        'a': [{ vertex: 'center', weight: 1 }],
        'b': [{ vertex: 'center', weight: 1 }],
        'c': [{ vertex: 'center', weight: 1 }]
      };
      // center has degree 3 (odd), a, b, c each have degree 1 (odd) = 4 odd vertices
      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(false);
      expect(result.hasCircuit).toBe(false);
      expect(result.path).toEqual([]);
    });
  });

  describe('Classic examples', () => {
    it('should solve Königsberg Bridge problem (no solution)', () => {
      // Königsberg: 4 odd-degree vertices
      const graph = {
        'A': [{ vertex: 'B', weight: 1 }, { vertex: 'B', weight: 1 }, { vertex: 'C', weight: 1 }, { vertex: 'C', weight: 1 }, { vertex: 'D', weight: 1 }],
        'B': [{ vertex: 'A', weight: 1 }, { vertex: 'A', weight: 1 }, { vertex: 'D', weight: 1 }],
        'C': [{ vertex: 'A', weight: 1 }, { vertex: 'A', weight: 1 }, { vertex: 'D', weight: 1 }],
        'D': [{ vertex: 'A', weight: 1 }, { vertex: 'B', weight: 1 }, { vertex: 'C', weight: 1 }]
      };
      const result = findEulerPath(graph);

      expect(result.hasPath).toBe(false);
      expect(result.explanation).toContain('more than two vertices have odd degree');
    });
  });
});

describe('chinesePostmanAlgorithm', () => {
  it('should handle empty graph', () => {
    const result = chinesePostmanAlgorithm({});

    expect(result.hasPath).toBe(false);
    expect(result.isChinesePostman).toBe(true);
    expect(result.explanation).toBe('Graph is empty');
  });

  it('should find tour in graph already having Euler circuit', () => {
    const graph = {
      'a': [{ vertex: 'b', weight: 2 }, { vertex: 'c', weight: 3 }],
      'b': [{ vertex: 'a', weight: 2 }, { vertex: 'c', weight: 4 }],
      'c': [{ vertex: 'a', weight: 3 }, { vertex: 'b', weight: 4 }]
    };
    const result = chinesePostmanAlgorithm(graph);

    expect(result.hasPath).toBe(true);
    expect(result.isChinesePostman).toBe(true);
    expect(result.totalWeight).toBe(9); // 2+3+4 = 9
    expect(result.duplicatedEdges).toHaveLength(0);
  });

  it('should add duplicate edges to create valid tour', () => {
    // Path a-b-c (odd vertices a and c)
    const graph = {
      'a': [{ vertex: 'b', weight: 5 }],
      'b': [{ vertex: 'a', weight: 5 }, { vertex: 'c', weight: 3 }],
      'c': [{ vertex: 'b', weight: 3 }]
    };
    const result = chinesePostmanAlgorithm(graph);

    expect(result.hasPath).toBe(true);
    expect(result.isChinesePostman).toBe(true);
    // Should add edges to make it traversable
  });

  it('should calculate correct total weight', () => {
    const graph = {
      'a': [{ vertex: 'b', weight: 10 }, { vertex: 'c', weight: 20 }],
      'b': [{ vertex: 'a', weight: 10 }, { vertex: 'c', weight: 30 }],
      'c': [{ vertex: 'a', weight: 20 }, { vertex: 'b', weight: 30 }]
    };
    const result = chinesePostmanAlgorithm(graph);

    expect(result.totalWeight).toBe(60); // 10+20+30 = 60
  });
});

describe('getExplanation', () => {
  it('should return explanation for null result', () => {
    const result = getExplanation(null);
    expect(result).toBe('Unable to determine if an Euler path exists.');
  });

  it('should explain no path case', () => {
    const result = {
      hasPath: false,
      hasCircuit: false,
      explanation: 'No Euler path exists because more than two vertices have odd degree.'
    };
    const explanation = getExplanation(result);

    expect(explanation).toContain('odd degree');
  });

  it('should explain disconnected graph case', () => {
    const result = {
      hasPath: false,
      hasCircuit: false,
      explanation: 'Graph is not connected - Euler paths require all edges to be in a single connected component.'
    };
    const explanation = getExplanation(result);

    expect(explanation).toContain('connected component');
  });

  it('should explain circuit case', () => {
    const result = {
      hasPath: true,
      hasCircuit: true,
      explanation: 'An Euler circuit exists because all vertices have even degree.',
      path: ['a', 'b', 'c', 'a']
    };
    const explanation = getExplanation(result);

    expect(explanation).toContain('circuit');
    expect(explanation).toContain('even degree');
  });

  it('should explain path case (not circuit)', () => {
    const result = {
      hasPath: true,
      hasCircuit: false,
      explanation: 'An Euler path exists because exactly two vertices have odd degree.',
      path: ['a', 'b', 'c']
    };
    const explanation = getExplanation(result);

    expect(explanation).toContain('starts and ends at different vertices');
  });

  it('should explain Chinese Postman result', () => {
    const result = {
      hasPath: true,
      hasCircuit: true,
      explanation: 'Adding duplicate edges.',
      isChinesePostman: true,
      totalWeight: 100,
      duplicatedEdges: [{ source: 'a', target: 'b', weight: 5 }]
    };
    const explanation = getExplanation(result);

    expect(explanation).toContain('duplicate');
    expect(explanation).toContain('100');
  });
});

describe('Integration tests', () => {
  it('should correctly process edge input through full pipeline', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'a' }
    ];

    const graph = buildAdjacencyList(edges, false);
    const result = findEulerPath(graph);
    const explanation = getExplanation(result);

    expect(result.hasPath).toBe(true);
    expect(result.hasCircuit).toBe(true);
    expect(explanation).toContain('circuit');
  });

  it('should handle weighted graph through Chinese Postman', () => {
    const edges = [
      { source: 'a', target: 'b', weight: 5 },
      { source: 'b', target: 'c', weight: 3 },
      { source: 'c', target: 'a', weight: 7 }
    ];

    const graph = buildAdjacencyList(edges, false);
    const result = findEulerPath(graph, null, true); // isWeighted = true

    expect(result.isChinesePostman).toBe(true);
    expect(result.totalWeight).toBe(15); // 5+3+7
  });
});

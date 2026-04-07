/**
 * Unit tests for sigma-controller parsing helpers
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../utils/dom.js', () => ({
  $: vi.fn(),
  $$: vi.fn(() => [])
}));

vi.mock('../core/state.js', () => ({
  getState: vi.fn(),
  setState: vi.fn(),
  subscribe: vi.fn(() => () => {})
}));

vi.mock('./model.js', () => ({
  Graph: class {
    constructor() {
      this.directed = false;
      this.weighted = false;
    }
  }
}));

vi.mock('./sigma-facade.js', () => ({
  SigmaCore: { initialize: vi.fn(), destroy: vi.fn() },
  SigmaRenderer: { render: vi.fn(), setDirected: vi.fn(), applyLayout: vi.fn(), enforceCameraBoundaries: vi.fn() },
  SigmaLayout: { init: vi.fn(), get: vi.fn(), pause: vi.fn(), resume: vi.fn() },
  SigmaSelection: {
    getNodes: vi.fn(),
    getEdges: vi.fn(),
    deleteSelected: vi.fn(),
    deleteNode: vi.fn(),
    deleteEdge: vi.fn()
  },
  SigmaProperties: { setBulkNodeProps: vi.fn(), setBulkEdgeProps: vi.fn() },
  SigmaAnimation: { highlightPath: vi.fn(), animatePath: vi.fn() },
  SigmaExport: { exportImage: vi.fn() }
}));

vi.mock('../ui/init.js', () => ({
  showNotification: vi.fn()
}));

vi.mock('../ui/loader.js', () => ({
  showCalcLoader: vi.fn(),
  hideCalcLoader: vi.fn(),
  updateLoaderProgress: vi.fn(),
  cancelLoading: vi.fn()
}));

import { parseEdgeInput } from './sigma-controller.js';

describe('parseEdgeInput', () => {
  it('should parse valid bracket edges', () => {
    const result = parseEdgeInput('[node_1,node_2,2]');

    expect(result).toEqual([
      { source: 'node_1', target: 'node_2', weight: 2 }
    ]);
  });

  it('should reject self-loops in bracket format', () => {
    expect(() => parseEdgeInput('[a,a]')).toThrow('self-loops are not allowed');
  });

  it('should reject invalid vertex names in bracket format', () => {
    expect(() => parseEdgeInput('[bad-name,a]')).toThrow('can only contain letters, numbers, and underscores');
  });
});

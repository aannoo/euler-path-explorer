import { describe, it, expect, beforeEach, vi } from 'vitest';

let getState;
let setState;
let subscribe;

const loadStateModule = async () => {
  vi.resetModules();
  ({ getState, setState, subscribe } = await import('./state.js'));
};

describe('State Module', () => {
  beforeEach(async () => {
    await loadStateModule();
  });

  it('returns cloned state snapshots', () => {
    const graph = getState('graph');
    graph.directed = true;
    graph.edges.push({ source: 'a', target: 'b' });

    expect(getState('graph')).toEqual({
      directed: false,
      weighted: false,
      edges: []
    });
  });

  it('returns undefined for unknown paths', () => {
    expect(getState('graph.missing.value')).toBeUndefined();
  });

  it('creates nested paths when setting missing state branches', () => {
    setState('ui.panel.filters.search', 'triangle');

    expect(getState('ui.panel.filters.search')).toBe('triangle');
    expect(getState('ui.panel')).toEqual({
      filters: {
        search: 'triangle'
      }
    });
  });

  it('ignores empty paths in setState', () => {
    const before = getState();

    setState('', 'ignored');

    expect(getState()).toEqual(before);
  });

  it('notifies exact-path subscribers with cloned values', () => {
    const callback = vi.fn();
    subscribe('graph.directed', callback);

    setState('graph.directed', true);

    expect(callback).toHaveBeenCalledWith(true);
  });

  it('notifies parent subscribers when child paths change', () => {
    const callback = vi.fn();
    subscribe('ui.savedGraphs', callback);

    setState('ui.savedGraphs.activeItemId', 'graph-1');

    expect(callback).toHaveBeenCalledWith({
      activeItemId: 'graph-1',
      editingItemId: null,
      confirmingDeleteId: null,
      isModified: false,
      currentGraphId: null
    });
  });

  it('unsubscribe removes listeners cleanly', () => {
    const callback = vi.fn();
    const unsubscribe = subscribe('graph.weighted', callback);

    unsubscribe();
    setState('graph.weighted', true);

    expect(callback).not.toHaveBeenCalled();
  });
});

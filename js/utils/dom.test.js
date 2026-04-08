import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, $$, cached, clearCache } from './dom.js';

describe('DOM Utils', () => {
  const firstNode = { id: 'first' };
  const secondNode = { id: 'second' };
  let querySelector;
  let querySelectorAll;

  beforeEach(() => {
    querySelector = vi.fn((selector) => {
      if (selector === '#first') return firstNode;
      return null;
    });

    querySelectorAll = vi.fn((selector) => {
      if (selector === '.item') return [firstNode, secondNode];
      return [];
    });

    vi.stubGlobal('document', {
      querySelector,
      querySelectorAll
    });

    clearCache();
  });

  it('selects a single element with $', () => {
    expect($('#first')).toBe(firstNode);
    expect(querySelector).toHaveBeenCalledWith('#first');
  });

  it('returns an array copy with $$', () => {
    expect($$('.item')).toEqual([firstNode, secondNode]);
    expect(Array.isArray($$('.item'))).toBe(true);
  });

  it('caches lookup results until cleared', () => {
    expect(cached('#first')).toBe(firstNode);
    expect(cached('#first')).toBe(firstNode);
    expect(querySelector).toHaveBeenCalledTimes(1);

    clearCache();
    expect(cached('#first')).toBe(firstNode);
    expect(querySelector).toHaveBeenCalledTimes(2);
  });

  it('caches missing elements too', () => {
    expect(cached('#missing')).toBeNull();
    expect(cached('#missing')).toBeNull();
    expect(querySelector).toHaveBeenCalledTimes(1);
  });
});

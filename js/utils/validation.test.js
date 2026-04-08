import { describe, it, expect } from 'vitest';
import {
  validateVertex,
  validateVertices,
  validateEdge,
  validateEdges,
  validateGraphName,
  formatValidationError
} from './validation.js';

describe('Validation Utils', () => {
  describe('validateVertex', () => {
    it('rejects blank names', () => {
      expect(validateVertex('   ')).toEqual({
        valid: false,
        message: 'Vertex name cannot be empty'
      });
    });

    it('rejects names longer than ten characters', () => {
      expect(validateVertex('abcdefghijk')).toEqual({
        valid: false,
        message: 'Vertex name cannot exceed 10 characters'
      });
    });

    it('accepts alphanumeric and underscore names', () => {
      expect(validateVertex('node_10')).toEqual({
        valid: true,
        message: ''
      });
    });
  });

  describe('validateVertices', () => {
    it('reports duplicate vertices before invalid name errors', () => {
      expect(validateVertices(['a', 'b', 'a', 'bad-name'])).toEqual({
        valid: false,
        message: 'Duplicate vertices found: a',
        invalidVertices: ['bad-name', 'a']
      });
    });

    it('reports invalid vertex names when there are no duplicates', () => {
      expect(validateVertices(['ok', 'bad-name'])).toEqual({
        valid: false,
        message: 'Invalid vertex names: bad-name',
        invalidVertices: ['bad-name']
      });
    });
  });

  describe('validateEdge', () => {
    it('parses directed edges', () => {
      expect(validateEdge('a->b', ['a', 'b'])).toEqual({
        valid: true,
        message: '',
        from: 'a',
        to: 'b',
        bidirectional: false
      });
    });

    it('rejects invalid formats', () => {
      expect(validateEdge('a=>b', ['a', 'b'])).toEqual({
        valid: false,
        message: 'Invalid edge format. Use A-B, A->B, or A<->B',
        from: '',
        to: '',
        bidirectional: false
      });
    });

    it('rejects missing vertices when a vertex list is provided', () => {
      expect(validateEdge('a-c', ['a', 'b'])).toEqual({
        valid: false,
        message: 'Vertex "c" does not exist',
        from: 'a',
        to: 'c',
        bidirectional: true
      });
    });
  });

  describe('validateEdges', () => {
    it('collects duplicate undirected edges', () => {
      expect(validateEdges(['a-b', 'b-a'], ['a', 'b'])).toEqual({
        valid: false,
        message: '1 invalid edge(s) found',
        invalidEdges: [{ edge: 'b-a', reason: 'Duplicate edge' }]
      });
    });

    it('allows reversed directed edges as distinct', () => {
      expect(validateEdges(['a->b', 'b->a'], ['a', 'b'])).toEqual({
        valid: true,
        message: '',
        invalidEdges: []
      });
    });

    it('skips empty edge entries while validating the rest', () => {
      expect(validateEdges(['   ', 'a-b'], ['a', 'b'])).toEqual({
        valid: true,
        message: '',
        invalidEdges: []
      });
    });
  });

  describe('validateGraphName', () => {
    it('trims valid names', () => {
      expect(validateGraphName('  Euler Run  ')).toEqual({
        valid: true,
        message: '',
        trimmed: 'Euler Run'
      });
    });

    it('rejects short names after trimming', () => {
      expect(validateGraphName('  ab ')).toEqual({
        valid: false,
        message: 'Graph name must be at least 3 characters',
        trimmed: 'ab'
      });
    });

    it('rejects unsupported characters', () => {
      expect(validateGraphName('Euler!')).toEqual({
        valid: false,
        message: 'Graph name can only contain letters, numbers, spaces, hyphens, and underscores',
        trimmed: 'Euler!'
      });
    });
  });

  describe('formatValidationError', () => {
    it('returns blank output for valid results', () => {
      expect(formatValidationError({ valid: true })).toBe('');
    });

    it('formats edge details on separate lines', () => {
      expect(formatValidationError({
        valid: false,
        message: '2 invalid edge(s) found',
        invalidEdges: [
          { edge: 'a-a', reason: 'Self-loops are not allowed' },
          { edge: 'a-c', reason: 'Vertex "c" does not exist' }
        ]
      })).toBe(
        '2 invalid edge(s) found:\n• a-a: Self-loops are not allowed\n• a-c: Vertex "c" does not exist'
      );
    });

    it('appends invalid vertex names to the message', () => {
      expect(formatValidationError({
        valid: false,
        message: 'Invalid vertex names: bad-name',
        invalidVertices: ['bad-name']
      })).toBe('Invalid vertex names: bad-name (bad-name)');
    });
  });
});

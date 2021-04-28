import { Graph, alg } from '../../lib';

const isAcyclic = alg.isAcyclic;

describe('alg.isAcyclic', function () {
  it('returns true if the graph has no cycles', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'c']);
    expect(isAcyclic(g)).toBe(true);
  });

  it('returns false if the graph has at least one cycle', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'c', 'a']);
    expect(isAcyclic(g)).toBe(false);
  });

  it('returns false if the graph has a cycle of 1 node', function () {
    const g = new Graph();
    g.setPath(['a', 'a']);
    expect(isAcyclic(g)).toBe(false);
  });

  it('rethrows non-CycleException errors', function () {
    expect(function () {
      isAcyclic(undefined as any);
    }).toThrow();
  });
});

import _ from 'lodash';
import { Graph, alg } from '../../lib';

const prim = alg.prim;

describe('alg.prim', function () {
  it('returns an empty graph for an empty input', function () {
    const source = new Graph();

    const g = prim(source, weightFn(source));
    expect(g.nodeCount()).toEqual(0);
    expect(g.edgeCount()).toEqual(0);
  });

  it('returns a single node graph for a graph with a single node', function () {
    const source = new Graph();
    source.setNode('a');

    const g = prim(source, weightFn(source));
    expect(g.nodes()).toEqual(['a']);
    expect(g.edgeCount()).toEqual(0);
  });

  it('returns a deterministic result given an optimal solution', function () {
    const source = new Graph();
    source.setEdge('a', 'b', 1);
    source.setEdge('b', 'c', 2);
    source.setEdge('b', 'd', 3);
    // This edge should not be in the min spanning tree
    source.setEdge('c', 'd', 20);
    // This edge should not be in the min spanning tree
    source.setEdge('c', 'e', 60);
    source.setEdge('d', 'e', 1);

    const g = prim(source, weightFn(source));
    expect(_.sortBy(g.neighbors('a'))).toEqual(['b']);
    expect(_.sortBy(g.neighbors('b'))).toEqual(['a', 'c', 'd']);
    expect(_.sortBy(g.neighbors('c'))).toEqual(['b']);
    expect(_.sortBy(g.neighbors('d'))).toEqual(['b', 'e']);
    expect(_.sortBy(g.neighbors('e'))).toEqual(['d']);
  });

  it('throws an Error for unconnected graphs', function () {
    const source = new Graph();
    source.setNode('a');
    source.setNode('b');

    expect(function () {
      prim(source, weightFn(source));
    }).toThrow();
  });
});

function weightFn(g) {
  return function (edge) {
    return g.edge(edge);
  };
}

import _ from 'lodash';
import { Graph, alg } from '../../lib';

const topsort = alg.topsort;

describe('alg.topsort', function () {
  it('returns an empty array for an empty graph', function () {
    expect(topsort(new Graph())).toHaveLength(0);
  });

  it('sorts nodes such that earlier nodes have directed edges to later nodes', function () {
    const g = new Graph();
    g.setPath(['b', 'c', 'a']);
    expect(topsort(g)).toEqual(['b', 'c', 'a']);
  });

  it('works for a diamond', function () {
    const g = new Graph();
    g.setPath(['a', 'b', 'd']);
    g.setPath(['a', 'c', 'd']);

    const result = topsort(g);
    expect(_.indexOf(result, 'a')).toEqual(0);
    expect(_.indexOf(result, 'b')).toBeLessThan(_.indexOf(result, 'd'));
    expect(_.indexOf(result, 'c')).toBeLessThan(_.indexOf(result, 'd'));
    expect(_.indexOf(result, 'd')).toEqual(3);
  });

  it('throws CycleException if there is a cycle #1', function () {
    const g = new Graph();
    g.setPath(['b', 'c', 'a', 'b']);
    expect(function () {
      topsort(g);
    }).toThrow(alg.CycleException);
  });

  it('throws CycleException if there is a cycle #2', function () {
    const g = new Graph();
    g.setPath(['b', 'c', 'a', 'b']);
    g.setEdge('b', 'd');
    expect(function () {
      topsort(g);
    }).toThrow(alg.CycleException);
  });

  it('throws CycleException if there is a cycle #3', function () {
    const g = new Graph();
    g.setPath(['b', 'c', 'a', 'b']);
    g.setNode('d');
    expect(function () {
      topsort(g);
    }).toThrow(alg.CycleException);
  });
});

import { Graph, alg } from '../../lib';
import { tests } from './all-shortest-paths.helper';

const dijkstraAll = alg.dijkstraAll;

describe('alg.dijkstraAll', function () {
  tests(dijkstraAll);

  it('throws an Error if it encounters a negative edge weight', function () {
    const g = new Graph();
    g.setEdge('a', 'b', 1);
    g.setEdge('a', 'c', -2);
    g.setEdge('b', 'd', 3);
    g.setEdge('c', 'd', 3);

    expect(function () {
      dijkstraAll(g, weight(g));
    }).toThrow();
  });
});

function weight(g) {
  return function (e) {
    return g.edge(e);
  };
}

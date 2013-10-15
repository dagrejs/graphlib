var assert = require('../assert'),
    Digraph = require('../..').Digraph,
    dijkstraAll = require('../..').alg.dijkstraAll,
    allShortestPaths = require('./allShortestPaths-test');

describe('alg.dijkstraAll', function() {
  allShortestPaths(dijkstraAll);

  it('throws an Error if it encounters a negative edge weight', function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 2, 1);
    g.addEdge(null, 1, 3, -2);
    g.addEdge(null, 2, 4, 3);
    g.addEdge(null, 3, 4, 3);

    function w(e) { return g.edge(e); }

    assert.throws(function() { dijkstraAll(g, w); });
  });
});

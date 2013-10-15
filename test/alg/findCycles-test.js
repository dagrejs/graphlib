var assert = require('chai').assert,
    Digraph = require('../..').Digraph,
    Graph = require('../..').Graph,
    findCycles = require('../..').alg.findCycles;

describe('alg.findCycles', function() {
  it('returns an empty array for an empty graph', function() {
    assert.deepEqual(findCycles(new Digraph()), []);
  });

  it('returns an empty array if the graph has no cycles', function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);

    assert.deepEqual(sort(findCycles(g)), []);
  });

  it('returns a single entry for a cycle of 1 edge', function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 1);

    assert.deepEqual(sort(findCycles(g)), [[1, 2]]);
  });

  it('returns a single entry for a triangle', function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);
    g.addEdge(null, 3, 1);

    assert.deepEqual(sort(findCycles(g)), [[1, 2, 3]]);
  });

  it('returns multiple entries for multiple cycles', function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addNode(5);
    g.addNode(6);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 1);
    g.addEdge(null, 3, 4);
    g.addEdge(null, 4, 5);
    g.addEdge(null, 5, 3);

    assert.deepEqual(sort(findCycles(g)), [[1, 2], [3, 4, 5]]);
  });

  it('throws an Error for undirected graphs', function() {
    assert.throws(function() { findCycles(new Graph()); });
  });
});

// A helper that sorts components and their contents
function sort(cmpts) {
  cmpts.forEach(function(cmpt) {
    cmpt.sort(function(lhs, rhs) { return lhs - rhs; });
  });
  cmpts.sort(function(lhs, rhs) { return lhs[0] - rhs[0]; });
  return cmpts;
}

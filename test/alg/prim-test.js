var assert = require('../assert'),
    Graph = require('../..').Graph,
    prim = require('../..').alg.prim;

function edgeWeight(g) {
  return function(e) {
    return g.hasEdge(e) ? g.edge(e) : Number.POSITIVE_INFINITY;
  };
}

describe('alg.prim', function() {
  it('returns an empty graph for an empty input', function() {
    var source = new Graph();

    var g = prim(source, edgeWeight(source));
    assert.equal(g.order(), 0);
    assert.equal(g.size(), 0);
  });

  it('returns a single node graph for a graph with a single node', function() {
    var source = new Graph();
    source.addNode(1);

    var g = prim(source, edgeWeight(source));
    assert.deepEqual(g.nodes(), [1]);
    assert.equal(g.size(), 0);
  });

  it('returns a deterministic result given an optimal solution', function() {
    var source = new Graph();
    source.addNode(1);
    source.addNode(2);
    source.addNode(3);
    source.addNode(4);
    source.addNode(5);
    source.addEdge(null, 1, 2, 1);
    source.addEdge(null, 2, 3, 2);
    source.addEdge(null, 2, 4, 3);
    source.addEdge(null, 3, 4, 20); // This edge should not be in the min spanning tree
    source.addEdge(null, 3, 5, 60); // This edge should not be in the min spanning tree
    source.addEdge(null, 4, 5, 1);

    var g = prim(source, edgeWeight(source));
    assert.deepEqual(g.neighbors(1).sort(), [2]);
    assert.deepEqual(g.neighbors(2).sort(), [1, 3, 4]);
    assert.deepEqual(g.neighbors(3).sort(), [2]);
    assert.deepEqual(g.neighbors(4).sort(), [2, 5]);
    assert.deepEqual(g.neighbors(5).sort(), [4]);
  });

  it('throws an Error for unconnected graphs', function() {
    var source = new Graph();
    source.addNode(1);
    source.addNode(2);

    assert.throws(function() { prim(source, edgeWeight(source)); });
  });
});

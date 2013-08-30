var assert = require("chai").assert,
    Digraph = require("../../lib/Digraph"),
    tarjan = require("../../").alg.tarjan;

describe("alg.tarjan", function() {
  it("returns an empty array for an empty graph", function() {
    assert.deepEqual(tarjan(new Digraph()), []);
  });

  it("returns single node components if the graph has no strongly connected components", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);

    assert.deepEqual(sort(tarjan(g)), [[1], [2], [3]]);
  });

  it("returns a single component for a cycle of 1 edge", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 1);

    assert.deepEqual(sort(tarjan(g)), [[1, 2]]);
  });

  it("returns a single component for a triangle", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);
    g.addEdge(null, 3, 1);

    assert.deepEqual(sort(tarjan(g)), [[1, 2, 3]]);
  });

  it("can find multiple components", function() {
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

    assert.deepEqual(sort(tarjan(g)), [[1, 2], [3, 4, 5], [6]]);
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

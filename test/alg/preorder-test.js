var assert = require("../assert"),
    Graph = require("../..").Graph,
    Digraph = require("../..").Digraph,
    preorder = require("../..").alg.preorder;

describe("alg.preorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.addNode(1);
    assert.deepEqual(collect(g, 1), [1]);
  });

  it("works for an undirected tree", function() {
    var g = new Graph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addNode(5);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 1, 3);
    g.addEdge(null, 3, 4);
    g.addEdge(null, 3, 5);

    var result = collect(g, 1);
    assert.sameMembers(result, [1, 2, 3, 4, 5]);
    assert.lengthOf(result, 5);
    assert.isTrue(result.indexOf(1) < result.indexOf(2));
    assert.isTrue(result.indexOf(1) < result.indexOf(3));
    assert.isTrue(result.indexOf(3) < result.indexOf(4));
    assert.isTrue(result.indexOf(3) < result.indexOf(5));
  });

  it("fails for an undirected graph that is not a tree", function() {
    var g = new Graph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);
    g.addEdge(null, 3, 1);

    assert.throws(function() { collect(g, 1); });
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.addNode(1);
    assert.throws(function() { collect(g, 2); });
  });

  it("fails if the graph is directed", function() {
    var g = new Digraph();
    g.addNode(1);
    assert.throws(function() { collect(g, 1); });
  });
});

function collect(g, root) {
  var us = [];
  preorder(g, root, function(u) { us.push(u); });
  return us;
}

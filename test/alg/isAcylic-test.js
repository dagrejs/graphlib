var assert = require("chai").assert,
    Digraph = require("../..").Digraph,
    Graph = require("../..").Graph,
    isAcyclic = require("../..").alg.isAcyclic;

describe("alg.isAcylic", function() {
  it("returns `true` if the graph has no cycles", function() {
    var g = new Digraph();
    g.addNode("a");
    g.addNode("b");
    g.addNode("c");
    g.addEdge(null, "b", "c");
    g.addEdge(null, "c", "a");
    assert.isTrue(isAcyclic(g));
  });

  it("returns `false` if the graph has at least one cycle", function() {
    var g = new Digraph();
    g.addNode("a");
    g.addNode("b");
    g.addNode("c");
    g.addEdge(null, "b", "c");
    g.addEdge(null, "c", "a");
    g.addEdge(null, "a", "b");
    assert.isFalse(isAcyclic(g));
  });

  it("throws an Error for undirected graphs", function() {
    assert.throws(function() { isAcyclic(new Graph()); });
  });
});

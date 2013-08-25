var assert = require("chai").assert,
    Graph = require("../../lib/Graph"),
    isAcyclic = require("../../lib/alg/isAcyclic");

describe("alg.isAcylic", function() {
  it("returns `true` if the graph has no cycles", function() {
    var g = new Graph();
    g.addNode("a");
    g.addNode("b");
    g.addNode("c");
    g.addEdge(null, "b", "c");
    g.addEdge(null, "c", "a");
    assert.isTrue(isAcyclic(g));
  });

  it("returns `false` if the graph has at least one cycle", function() {
    var g = new Graph();
    g.addNode("a");
    g.addNode("b");
    g.addNode("c");
    g.addEdge(null, "b", "c");
    g.addEdge(null, "c", "a");
    g.addEdge(null, "a", "b");
    assert.isFalse(isAcyclic(g));
  });
});

var assert = require("chai").assert,
    Digraph = require("../../lib/Digraph"),
    topsort = require("../../lib/alg/topsort");

describe("alg.topsort", function() {
  it("sorts nodes such that earlier nodes have directed edges to later nodes", function() {
    var g = new Digraph();
    g.addNode("a");
    g.addNode("b");
    g.addNode("c");
    g.addEdge(null, "b", "c");
    g.addEdge(null, "c", "a");
    assert.deepEqual(topsort(g), ["b", "c", "a"]);
  });

  it("throws CycleException if there is a cycle", function() {
    var g = new Digraph();
    g.addNode("a");
    g.addNode("b");
    g.addNode("c");
    g.addEdge(null, "b", "c");
    g.addEdge(null, "c", "a");
    g.addEdge(null, "a", "b");
    assert.throws(function() { topsort(g); }, topsort.CycleException);
  });
});

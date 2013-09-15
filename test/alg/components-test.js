var assert = require("../assert"),
    Graph = require("../..").Graph,
    Digraph = require("../..").Digraph,
    components = require("../..").alg.components;

describe("alg.components", function() {
  it("returns `[]` for an empty graph", function() {
    assert.deepEqual(components(new Graph()), []);
  });

  it("returns `[[a], [b]]` when `a` and `b` are not connected by a path", function() {
    var graph = new Graph();
    graph.addNode("a");
    graph.addNode("b");
    assert.deepEqual(components(graph), [["a"], ["b"]]);
  });

  it("returns `[[a, b]]` when `a` and `b` are connected", function() {
    var graph = new Graph();
    graph.addNode("a");
    graph.addNode("b");
    graph.addEdge(null, "a", "b");
    assert.deepEqual(components(graph), [["a", "b"]]);
  });

  it("returns `[[a, b, c]]` for a graph `a -> b -> c`", function() {
    var graph = new Graph();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addEdge(null, "a", "b");
    graph.addEdge(null, "b", "c");
    assert.deepEqual(components(graph), [["a", "b", "c"]]);
  });

  it("throws an Error if used with a directed graph", function() {
    assert.throws(function() { components(new Digraph()); });
  });
});

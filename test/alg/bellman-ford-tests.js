var expect = require("../chai").expect,
  Graph = require("../..").Graph,
  bellmanFord = require("../..").alg.bellmanFord,
  shortestPathsTests = require("./shortest-paths-tests.js");

describe("alg.bellmanFord", function(){
  shortestPathsTests(bellmanFord);

  it("Works with negative weight edges on the graph", function() {
    var g = new Graph();
    g.setEdge("a", "b", -1);
    g.setEdge("a", "c", 4);
    g.setEdge("b", "c", 3);
    g.setEdge("b", "d", 2);
    g.setEdge("b", "e", 2);
    g.setEdge("d", "c", 5);
    g.setEdge("d", "b", 1);
    g.setEdge("e", "d", -3);

    expect(bellmanFord(g, "a", weightFn(g))).to.eql({
      a: { distance: 0 },
      b: { distance: -1, predecessor: "a" },
      c: { distance: 2, predecessor: "b" },
      d: { distance: -2, predecessor: "e" },
      e: { distance: 1, predecessor: "b" }
    });
  });

  it("Throws an error if the graph contains a negative weight cycle", function() {
    var g = new Graph();
    g.setEdge("a", "b", 1);
    g.setEdge("b", "c", 3);
    g.setEdge("c", "d", -5);
    g.setEdge("d", "e", 4);
    g.setEdge("d", "b", 1);
    g.setEdge("c", "f", 8);

    expect(function() { bellmanFord(g, "a", weightFn(g)); } ).to.throw();
  });
});


function weightFn(g) {
  return function(e) {
    return g.edge(e);
  };
}

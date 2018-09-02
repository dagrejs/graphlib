var expect = require("../chai").expect,
  Graph = require("../..").Graph,
  dijkstra = require("../..").alg.dijkstra,
  shortestPathsTests = require("./shortest-paths-tests.js");

describe("alg.dijkstra", function() {
  shortestPathsTests(dijkstra);

  it("throws an Error if it encounters a negative edge weight", function() {
    var g = new Graph();
    g.setEdge("a", "b",  1);
    g.setEdge("a", "c", -2);
    g.setEdge("b", "d",  3);
    g.setEdge("c", "d",  3);

    expect(function() { dijkstra(g, "a", weightFn(g)); }).to.throw();
  });
});

function weightFn(g) {
  return function(e) {
    return g.edge(e);
  };
}

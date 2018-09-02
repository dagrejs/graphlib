var expect = require("../chai").expect,
  Graph = require("../..").Graph,
  alg = require("../..").alg;

module.exports = tests;

function tests(algorithm) {
  describe( "Shortest Path Algorithms", function() {
    it("assigns distance 0 for the source node", function() {
      var g = new Graph();
      g.setNode("source");
      expect(algorithm(g, "source")).to.eql({ source: { distance: 0 } });
    });

    it("returns Number.POSITIVE_INFINITY for unconnected nodes", function() {
      var g = new Graph();
      g.setNode("a");
      g.setNode("b");
      expect(algorithm(g, "a")).to.eql({
        a: { distance: 0 },
        b: { distance: Number.POSITIVE_INFINITY }
      });
    });

    it("returns the distance and path from the source node to other nodes", function() {
      var g = new Graph();
      g.setPath(["a", "b", "c"]);
      g.setEdge("b", "d");
      expect(algorithm(g, "a")).to.eql({
        a: { distance: 0 },
        b: { distance: 1, predecessor: "a" },
        c: { distance: 2, predecessor: "b" },
        d: { distance: 2, predecessor: "b" }
      });
    });

    it("works for undirected graphs", function() {
      var g = new Graph({ directed: false });
      g.setPath(["a", "b", "c"]);
      g.setEdge("b", "d");
      expect(algorithm(g, "a")).to.eql({
        a: { distance: 0 },
        b: { distance: 1, predecessor: "a" },
        c: { distance: 2, predecessor: "b" },
        d: { distance: 2, predecessor: "b" }
      });
    });

    it("uses an optionally supplied weight function", function() {
      var g = new Graph();
      g.setEdge("a", "b", 1);
      g.setEdge("a", "c", 2);
      g.setEdge("b", "d", 3);
      g.setEdge("c", "d", 3);

      expect(algorithm(g, "a", weightFn(g))).to.eql({
        a: { distance: 0 },
        b: { distance: 1, predecessor: "a" },
        c: { distance: 2, predecessor: "a" },
        d: { distance: 4, predecessor: "b" }
      });
    });

    it("uses an optionally supplied edge function", function() {
      var g = new Graph();
      g.setPath(["a", "c", "d"]);
      g.setEdge("b", "c");

      expect(algorithm(g, "d", undefined, function(e) { return g.inEdges(e); })).to.eql({
        a: { distance: 2, predecessor: "c" },
        b: { distance: 2, predecessor: "c" },
        c: { distance: 1, predecessor: "d" },
        d: { distance: 0 }
      });
    });
  });
}

// Test shortestPaths() function
describe("alg.shortestPaths", function() {
  tests(alg.shortestPaths);

  it("uses dijkstra if no weightFn is provided", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c"]);
    g.setEdge("b", "d", -10);

    expect(alg.shortestPaths(g, "a")).to.eql(alg.dijkstra(g, "a"));
  });

  it("uses bellman-ford if the graph contains a negative edge", function() {
    var g = new Graph();
    g.setEdge("a", "b", 10);
    g.setEdge("b", "c", 8);
    g.setEdge("a", "d", -3);
    g.setEdge("d", "c", 2);

    expect(alg.shortestPaths(g, "a", weightFn(g))).to.eql(alg.bellmanFord(g, "a", weightFn(g)));
  });
});

function weightFn(g) {
  return function(e) {
    return g.edge(e);
  };
}

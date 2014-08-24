var expect = require("../chai").expect,
    Digraph = require("../..").Digraph,
    util = require("../..").util,
    floydWarshall = require("../..").alg.floydWarshall,
    allShortestPathsTest = require("./all-shortest-paths-test");

describe("alg.floydWarshall", function() {
  allShortestPathsTest.tests(floydWarshall);

  it("handles negative weights", function() {
    var g = new Digraph();
    g.setEdge("a", "b", 1);
    g.setEdge("a", "c", -2);
    g.setEdge("b", "d", 3);
    g.setEdge("c", "d", 3);

    expect(floydWarshall(g, util.LABEL_WEIGHT_FUNC)).to.eql({
      a: {
        a: { distance: 0 },
        b: { distance: 1, predecessor: "a" },
        c: { distance: -2, predecessor: "a" },
        d: { distance: 1, predecessor: "c" }
      },
      b: {
        a: { distance: Number.POSITIVE_INFINITY },
        b: { distance: 0 },
        c: { distance: Number.POSITIVE_INFINITY },
        d: { distance: 3, predecessor: "b" }
      },
      c: {
        a: { distance: Number.POSITIVE_INFINITY },
        b: { distance: Number.POSITIVE_INFINITY },
        c: { distance: 0 },
        d: { distance: 3, predecessor: "c" }
      },
      d: {
        a: { distance: Number.POSITIVE_INFINITY },
        b: { distance: Number.POSITIVE_INFINITY },
        c: { distance: Number.POSITIVE_INFINITY },
        d: { distance: 0 }
      }
    });
  });

  it("does include negative weight self edges", function() {
    var g = new Digraph();
    g.setEdge("a", "a", -1);

    // In the case of a negative cycle the distance is not well-defined beyond
    // having a negative value along the diagonal.
    expect(floydWarshall(g, util.LABEL_WEIGHT_FUNC)).to.eql({
      a: {
        a: { distance: -2, predecessor: "a" }
      }
    });
  });
});

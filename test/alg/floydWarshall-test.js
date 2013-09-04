var assert = require("../assert"),
    Digraph = require("../..").Digraph,
    floydWarshall = require("../..").alg.floydWarshall,
    allShortestPaths = require("./allShortestPaths-test");

describe("alg.floydWarshall", function() {
  allShortestPaths(floydWarshall);

  it("handles negative weights", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 2, 1);
    g.addEdge(null, 1, 3, -2);
    g.addEdge(null, 2, 4, 3);
    g.addEdge(null, 3, 4, 3);

    function w(e) { return g.edge(e); }

    assert.deepEqual(floydWarshall(g, w), {
      1: {
        1: { distance: 0 },
        2: { distance: 1, predecessor: 1 },
        3: { distance: -2, predecessor: 1 },
        4: { distance: 1, predecessor: 3 }
      },
      2: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: 0 },
        3: { distance: Number.POSITIVE_INFINITY },
        4: { distance: 3, predecessor: 2 }
      },
      3: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: Number.POSITIVE_INFINITY },
        3: { distance: 0 },
        4: { distance: 3, predecessor: 3 }
      },
      4: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: Number.POSITIVE_INFINITY },
        3: { distance: Number.POSITIVE_INFINITY },
        4: { distance: 0 }
      }
    });
  });

  it("does include negative weight self edges", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addEdge(null, 1, 1, -1);

    function w(e) { return g.edge(e); }

    assert.deepEqual(alg(g), { 1: { 1: { distance: -2, predecessor: 1 } }});
  });
});

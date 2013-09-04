var assert = require("chai").assert,
    Digraph = require("../..").Digraph,
    Graph = require("../..").Graph;

module.exports = allShortestPaths;

// Mixin for testing shortest path algorithms
function allShortestPaths(alg) {
  it("returns 0 for the node itself", function() {
    var g = new Digraph();
    g.addNode(1);
    assert.deepEqual(alg(g), { 1: { 1: { distance: 0 } }});
  });

  it("returns 0 for the node itself when there are self edges", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addEdge(null, 1, 1);
    assert.deepEqual(alg(g), { 1: { 1: { distance: 0 } }});
  });

  it("returns Number.POSITIVE_INFINITY for unconnected nodes", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    assert.deepEqual(alg(g), {
      1: {
        1: { distance: 0 },
        2: { distance: Number.POSITIVE_INFINITY }
      },
      2: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: 0 }
      }
    });
  });

  it("returns the distance and path from all nodes to other nodes", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);
    assert.deepEqual(alg(g), {
      1: {
        1: { distance: 0 },
        2: { distance: 1, predecessor: 1 },
        3: { distance: 2, predecessor: 2 }
      },
      2: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: 0 },
        3: { distance: 1, predecessor: 2 }
      },
      3: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: Number.POSITIVE_INFINITY },
        3: { distance: 0 }
      }
    });
  });

  it("uses an optionally supplied weight function", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2, 2);
    g.addEdge(null, 2, 3, 3);

    function w(e) { return g.edge(e); }

    assert.deepEqual(alg(g, w), {
      1: {
        1: { distance: 0 },
        2: { distance: 2, predecessor: 1 },
        3: { distance: 5, predecessor: 2 }
      },
      2: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: 0 },
        3: { distance: 3, predecessor: 2 }
      },
      3: {
        1: { distance: Number.POSITIVE_INFINITY },
        2: { distance: Number.POSITIVE_INFINITY },
        3: { distance: 0 }
      }
    });
  });

  it("uses an optionally supplied incident function", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);

    assert.deepEqual(alg(g, undefined, function(e) { return g.inEdges(e); }), {
      1: {
        1: { distance: 0 },
        2: { distance: Number.POSITIVE_INFINITY },
        3: { distance: Number.POSITIVE_INFINITY }
      },
      2: {
        1: { distance: 1, predecessor: 2 },
        2: { distance: 0 },
        3: { distance: Number.POSITIVE_INFINITY }
      },
      3: {
        1: { distance: 2, predecessor: 2 },
        2: { distance: 1, predecessor: 3 },
        3: { distance: 0 }
      }
    });
  });

  it("works with undirected graphs", function() {
    var g = new Graph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 2, 1);
    g.addEdge(null, 2, 3, 2);
    g.addEdge(null, 3, 1, 4);
    g.addEdge(null, 2, 4, 6);

    function w(e) { return g.edge(e); }

    assert.deepEqual(alg(g, w), {
      1: {
        1: { distance: 0 },
        2: { distance: 1, predecessor: 1 },
        3: { distance: 3, predecessor: 2 },
        4: { distance: 7, predecessor: 2 },
      },
      2: {
        1: { distance: 1, predecessor: 2 },
        2: { distance: 0 },
        3: { distance: 2, predecessor: 2 },
        4: { distance: 6, predecessor: 2 },
      },
      3: {
        1: { distance: 3, predecessor: 2 },
        2: { distance: 2, predecessor: 3 },
        3: { distance: 0 },
        4: { distance: 8, predecessor: 2 },
      },
      4: {
        1: { distance: 7, predecessor: 2 },
        2: { distance: 6, predecessor: 4 },
        3: { distance: 8, predecessor: 2 },
        4: { distance: 0 },
      }
    });
  });
}

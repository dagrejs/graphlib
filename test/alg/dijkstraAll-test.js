var assert = require("chai").assert,
    Digraph = require("../..").Digraph,
    dijkstraAll = require("../..").alg.dijkstraAll;

describe("alg.dijkstraAll", function() {
  it("returns 0 for the node itself", function() {
    var g = new Digraph();
    g.addNode(1);
    assert.deepEqual(dijkstraAll(g), { 1: { 1: { distance: 0 } }});
  });

  it("returns Number.POSITIVE_INFINITY for unconnected nodes", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    assert.deepEqual(dijkstraAll(g), {
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
    assert.deepEqual(dijkstraAll(g), {
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

    assert.deepEqual(dijkstraAll(g, w), {
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

    assert.deepEqual(dijkstraAll(g, undefined, function(e) { return g.inEdges(e); }), {
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

  it("throws an Error if it encounters a negative edge weight", function() {
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

    assert.throws(function() { dijkstraAll(g, w); });
  });
});

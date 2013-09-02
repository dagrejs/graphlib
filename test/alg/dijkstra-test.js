var assert = require("chai").assert,
    Digraph = require("../..").Digraph,
    Graph = require("../..").Graph,
    dijkstra = require("../..").alg.dijkstra;

describe("alg.dijkstra", function() {
  it("returns 0 for the node itself", function() {
    var g = new Digraph();
    g.addNode(1);
    assert.deepEqual(dijkstra(g, 1), { 1: { distance: 0 } });
  });

  it("returns Number.POSITIVE_INFINITY for unconnected nodes", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    assert.deepEqual(dijkstra(g, 1), {
      1: { distance: 0 },
      2: { distance: Number.POSITIVE_INFINITY }
    });
  });

  it("returns the distance and path from the source node to other nodes", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);
    g.addEdge(null, 2, 4);
    assert.deepEqual(dijkstra(g, 1), {
      1: { distance: 0 },
      2: { distance: 1, predecessor: 1 },
      3: { distance: 2, predecessor: 2 },
      4: { distance: 2, predecessor: 2 }
    });
  });

  it("works for undirected graphs", function() {
    var g = new Graph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 2);
    g.addEdge(null, 2, 3);
    g.addEdge(null, 2, 4);
    assert.deepEqual(dijkstra(g, 1), {
      1: { distance: 0 },
      2: { distance: 1, predecessor: 1 },
      3: { distance: 2, predecessor: 2 },
      4: { distance: 2, predecessor: 2 }
    });
  });

  it("uses an optionally supplied weight function", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 2, 1);
    g.addEdge(null, 1, 3, 2);
    g.addEdge(null, 2, 4, 3);
    g.addEdge(null, 3, 4, 3);

    function w(e) { return g.edge(e); }

    assert.deepEqual(dijkstra(g, 1, w), {
      1: { distance: 0 },
      2: { distance: 1, predecessor: 1 },
      3: { distance: 2, predecessor: 1 },
      4: { distance: 4, predecessor: 2 }
    });
  });

  it("uses an optionally supplied incident function", function() {
    var g = new Digraph();
    g.addNode(1);
    g.addNode(2);
    g.addNode(3);
    g.addNode(4);
    g.addEdge(null, 1, 3);
    g.addEdge(null, 2, 3);
    g.addEdge(null, 3, 4);

    assert.deepEqual(dijkstra(g, 4, undefined, function(e) { return g.inEdges(e); }), {
      1: { distance: 2, predecessor: 3 },
      2: { distance: 2, predecessor: 3 },
      3: { distance: 1, predecessor: 4 },
      4: { distance: 0 }
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

    assert.throws(function() { dijkstra(g, 1, w); });
  });
});

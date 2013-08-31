var assert = require("chai").assert,
    Digraph = require("..").Digraph;

describe("Digraph", function() {
  var g;

  beforeEach(function() {
    g = new Digraph();
  });

  describe("new Digraph()", function() {
    it("has no nodes", function() {
      assert.equal(g.order(), 0);
      assert.lengthOf(g.nodes(), 0);
    });

    it("has no edges", function() {
      assert.equal(g.size(), 0);
      assert.lengthOf(g.edges(), 0);
    });
  });

  describe("subgraph", function() {
    it("returns a graph containing a subset of nodes", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u); });
      g.addEdge("a", 1, 2);
      g.addEdge("b", 2, 3);

      var subgraph = g.subgraph([1, 2]);
      assert.deepEqual(subgraph.nodes().sort(), [1, 2]);
      assert.deepEqual(subgraph.edges(), ["a"]);
    });

    it("includes each node's value in the subgraph", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u, "V" + u); });
      g.addEdge("a", 1, 2);
      g.addEdge("b", 2, 3);

      var subgraph = g.subgraph([1, 2]);
      assert.equal(subgraph.node(1), "V1");
      assert.equal(subgraph.node(2), "V2");
    });

    it("includes each edge's value in the subgraph", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u); });
      g.addEdge("a", 1, 2, "VA");
      g.addEdge("b", 2, 3);

      var subgraph = g.subgraph([1, 2]);
      assert.equal(subgraph.edge("a"), "VA");
    });
  });

  describe("order", function() {
    it("returns the number of nodes in the graph", function() {
      var g = new Digraph();
      g.addNode("a");
      g.addNode("b");
      assert.equal(g.order(), 2);
    });
  });

  describe("size", function() {
    it("returns the number of edges in the graph", function() {
      var g = new Digraph();
      g.addNode("a");
      g.addNode("b");

      g.addEdge(null, "a", "b");
      assert.equal(g.size(), 1);

      g.addEdge(null, "a", "b");
      assert.equal(g.size(), 2);
    });
  });

  describe("graph", function() {
    it("returns undefined if a value has not been set", function() {
      assert.isUndefined(g.graph());
    });

    it("sets the value for the graph if called with a single argument", function() {
      g.graph("test");
      assert.equal(g.graph(), "test");
    });
  });

  describe("node", function() {
    it("throws if the node isn't in the graph", function() {
      assert.throws(function() { g.node(1); });
    });

    it("has an undefined value if no value was assigned to the node", function() {
      g.addNode(1);
      assert.isUndefined(g.node(1));
    });

    it("returns the node's value if one was set", function() {
      var value = { abc: 123 };
      g.addNode(1, value);
      assert.strictEqual(g.node(1), value);
    });

    it("sets the value for the node if called with two arguments", function() {
      g.addNode(1);
      g.node(1, "abc");
      assert.equal(g.node(1), "abc");
    });
  });

  describe("sources", function() {
    it("returns all nodes for a graph with no edges", function() {
      var g = new Digraph();
      g.addNode("a");
      g.addNode("b");
      g.addNode("c");
      assert.deepEqual(g.sources().sort(), ["a", "b", "c"]);
    });

    it("returns only nodes that have no in-edges", function() {
      var g = new Digraph();
      g.addNode("a");
      g.addNode("b");
      g.addNode("c");
      g.addEdge(null, "a", "b");
      assert.deepEqual(g.sources().sort(), ["a", "c"]);
    });
  });

  describe("sinks", function() {
    it("returns all nodes for a graph with no edges", function() {
      var g = new Digraph();
      g.addNode("a");
      g.addNode("b");
      g.addNode("c");
      assert.deepEqual(g.sinks().sort(), ["a", "b", "c"]);
    });

    it("returns only nodes that have no out-edges", function() {
      var g = new Digraph();
      g.addNode("a");
      g.addNode("b");
      g.addNode("c");
      g.addEdge(null, "a", "b");
      assert.deepEqual(g.sinks().sort(), ["b", "c"]);
    });
  });

  describe("edge", function() {
    it("throws if the edge isn't in the graph", function() {
      assert.throws(function() { g.edge(3); });
    });

    it("has the nodes that are incident on the edge", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2);
      assert.equal(g.source(3), 1);
      assert.equal(g.target(3), 2);
    });

    it("has an undefined value if no value was assigned to the edge", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2);
      assert.isUndefined(g.edge(3));
    });

    it("returns the edge's value if one was set", function() {
      var value = { abc: 123 };
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2, value);
      assert.strictEqual(g.edge(3), value);
    });

    it("sets the value for the edge if called with 2 arguments", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2);
      g.edge(3, "abc");
      assert.equal(g.edge(3), "abc");
    });
  });

  describe("edges", function() {
    it("returns all edges with no arguments", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 2, 1);

      assert.deepEqual(g.edges().sort(), ["A", "B", "C"]);
    });

    it("throws an error if called with one argument", function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 2, 1);
      g.addEdge("D", 2, 3);

      assert.throws(function() { g.edges(1); });
    });

    it("throws an error if called with two arguments", function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 2, 1);
      g.addEdge("D", 2, 3);

      assert.throws(function() { g.edges(1, 2); });
    });
  });

  describe("outEdges", function() {
    it("returns all out edges from a source", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 1, 1);
      g.addEdge("D", 2, 1);
      g.addEdge("E", 2, 2);

      assert.deepEqual(g.outEdges(1).sort(), ["A", "B", "C"]);
      assert.deepEqual(g.outEdges(2).sort(), ["D", "E"]);
    });

    it("optionally returns all out edges from a source filtered by target", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 1, 1);
      g.addEdge("D", 2, 1);
      g.addEdge("E", 2, 2);

      assert.deepEqual(g.outEdges(1, 1).sort(), ["C"]);
      assert.deepEqual(g.outEdges(1, 2).sort(), ["A", "B"]);
      assert.deepEqual(g.outEdges(2, 1).sort(), ["D"]);
      assert.deepEqual(g.outEdges(2, 2).sort(), ["E"]);
    });
  });

  describe("inEdges", function() {
    it("returns all in edges to a target", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 1, 1);
      g.addEdge("D", 2, 1);
      g.addEdge("E", 2, 2);

      assert.deepEqual(g.inEdges(1).sort(), ["C", "D"]);
      assert.deepEqual(g.inEdges(2).sort(), ["A", "B", "E"]);
    });

    it("optionally returns all in edges to a target filtered by source", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 1, 1);
      g.addEdge("D", 2, 1);
      g.addEdge("E", 2, 2);

      assert.deepEqual(g.inEdges(1, 1).sort(), ["C"]);
      assert.deepEqual(g.inEdges(1, 2).sort(), ["D"]);
      assert.deepEqual(g.inEdges(2, 1).sort(), ["A", "B"]);
      assert.deepEqual(g.inEdges(2, 2).sort(), ["E"]);
    });
  });

  describe("incidentEdges", function() {
    it("returns all edges incident on a particular node", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 1, 1);
      g.addEdge("D", 2, 1);
      g.addEdge("E", 2, 2);

      assert.deepEqual(g.incidentEdges(1).sort(), ["A", "B", "C", "D"]);
      assert.deepEqual(g.incidentEdges(2).sort(), ["A", "B", "D", "E"]);
    });

    it("optionally returns all edges between two nodes regardless of direction", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);
      g.addEdge("B", 1, 2);
      g.addEdge("C", 1, 1);
      g.addEdge("D", 2, 1);
      g.addEdge("E", 2, 2);

      assert.deepEqual(g.incidentEdges(1, 1).sort(), ["C"]);
      assert.deepEqual(g.incidentEdges(1, 2).sort(), ["A", "B", "D"]);
      assert.deepEqual(g.incidentEdges(2, 1).sort(), g.incidentEdges(1, 2));
      assert.deepEqual(g.incidentEdges(2, 2).sort(), ["E"]);
    });
  });

  describe("equals", function() {
    it("returns `true` if both graphs are empty", function() {
      assert.isTrue(new Digraph().equals(new Digraph()));
    });

    it("returns `true` if both graphs have the same nodes", function() {
      var g1 = new Digraph();
      g1.addNode("A", 123);
      g1.addNode("B", 456);
      var g2 = g1.subgraph(["A", "B"]);
      assert.isTrue(g1.equals(g2));
    });

    it("returns `false` if both graphs have different nodes", function() {
      var g1 = new Digraph();
      g1.addNode("A", 123);
      var g2 = new Digraph();
      g2.addNode("B", 456);
      assert.isFalse(g1.equals(g2));
    });

    it("returns `false` if other graph has a strict superset of nodes", function() {
      var g1 = new Digraph();
      g1.addNode("A", 123);
      var g2 = g1.subgraph(["A"]);
      g2.addNode("B", "456");
      assert.isFalse(g1.equals(g2));
    });

    it("returns `false` if both graphs have different node values", function() {
      var g1 = new Digraph();
      g1.addNode("A", 123);
      var g2 = new Digraph();
      g2.addNode("A", 456);
      assert.isFalse(g1.equals(g2));
    });

    it("returns `true` if both graphs have the same edges", function() {
      var g1 = new Digraph();
      g1.addNode("A");
      g1.addNode("B");
      g1.addEdge("AB", "A", "B", 123);
      var g2 = g1.subgraph(["A", "B"]);
      assert.isTrue(g1.equals(g2));
    });

    it("returns `false` if both graphs have different edges", function() {
      var g1 = new Digraph();
      g1.addNode("A");
      g1.addNode("B");
      g1.addEdge("AB", "A", "B", 123);
      var g2 = new Digraph();
      g2.addNode("A");
      g2.addNode("B");
      g2.addEdge("BA", "B", "A", 123);
      assert.isFalse(g1.equals(g2));
    });

    it("returns `false` if other graph has a strict superset of edges", function() {
      var g1 = new Digraph();
      g1.addNode("A");
      g1.addNode("B");
      g1.addEdge("AB", "A", "B", 123);
      var g2 = g1.subgraph(["A", "B"]);
      g2.addEdge("BA", "B", "A", 456);
      assert.isFalse(g1.equals(g2));
    });

    it("returns `false` if both graphs have different edge values", function() {
      var g1 = new Digraph();
      g1.addNode("A");
      g1.addNode("B");
      g1.addEdge("AB", "A", "B", 123);
      var g2 = new Digraph();
      g2.addNode("A");
      g2.addNode("B");
      g2.addEdge("AB", "A", "B", 456);
      assert.isFalse(g1.equals(g2));
    });
  });

  describe("toString", function() {
    it("returns a string representatoin of the graph", function() {
      // Just make sure we don't throw an Error
      g.addNode("a");
      g.addNode("b");
      g.addEdge(null, "a", "b");
      g.toString();
    });
  });

  describe("addNode", function() {
    it("adds a new node to the graph", function() {
      g.addNode(1);

      assert.deepEqual(g.nodes(), [1]);

      assert.lengthOf(g.successors(1), 0);
      assert.lengthOf(g.predecessors(1), 0);
      assert.lengthOf(g.neighbors(1), 0);
    });
  });

  describe("delNode", function() {
    it("removes the node from the graph", function() {
      g.addNode(1);
      g.addNode(2);
      g.delNode(1);
      assert.deepEqual(g.nodes(), [2]);
    });

    it("removes out edges", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("1 -> 2", 1, 2);
      g.delNode(1);
      assert.lengthOf(g.predecessors(2), 0);
    });

    it("removes in edges", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("2 -> 1", 2, 1);
      g.delNode(1);
      assert.lengthOf(g.successors(2), 0);
    });
  });

  describe("addEdge", function() {
    it("adds a new edge to the graph", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("a", 1, 2);

      assert.deepEqual(g.edges(), ["a"]);

      assert.deepEqual(g.successors(1), [2]);
      assert.deepEqual(g.predecessors(2), [1]);
      assert.deepEqual(g.neighbors(1), [2]);
      assert.deepEqual(g.neighbors(2), [1]);
    });

    it("assigns an arbitrary edge id if the given id is null", function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addEdge(null, 1, 2);
      g.addEdge(null, 2, 3);

      assert.deepEqual(g.successors(1), [2]);
      assert.deepEqual(g.successors(2), [3]);
    });
  });

  describe("delEdge", function() {
    it("removes the specified edge from the graph", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("a", 1, 2);
      g.delEdge("a");

      assert.lengthOf(g.edges(), 0);

      assert.lengthOf(g.successors(1), 0);
      assert.lengthOf(g.predecessors(1), 0);
      assert.lengthOf(g.neighbors(1), 0);
    });
  });
});

var assert = require("./assert"),
    Digraph = require("..").Digraph,
    filter = require("..").filter;

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

  describe("filterNodes", function() {
    it("creates a graph containing only nodes where the filter is true", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u); });

      var g2 = g.filterNodes(filter.nodesFromList([1, 2]));
      assert.deepEqual(g2.nodes().sort(), [1, 2]);
    });

    it("creates a graph of type Digraph", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u); });
      assert.instanceOf(g.filterNodes(filter.all()), Digraph);
    });

    it("includes the values of the filtered nodes", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u, "V" + u); });

      var g2 = g.filterNodes(filter.nodesFromList([1, 2]));
      assert.equal(g2.node(1), "V1");
      assert.equal(g2.node(2), "V2");
    });

    it("includes edges that are are incident with nodes in the filtered set", function() {
      var g = new Digraph();
      [1,2,3].forEach(function(u) { g.addNode(u); });
      g.addEdge("a", 1, 2, "VA");
      g.addEdge("b", 2, 3);

      var g2 = g.filterNodes(filter.nodesFromList([1, 2]));
      assert.isTrue(g2.hasEdge("a"));
      assert.equal(g2.edge("a"), "VA");
    });
  });

  describe("asUndirected", function() {
    var g;

    beforeEach(function() {
      g = new Digraph();
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addNode(4);
      g.addEdge("A", 1, 2, "A");
      g.addEdge("B", 2, 3, "B");
      g.addEdge("C", 3, 4, "C");
      g.addEdge("D", 4, 1, "D");
      g.addEdge("E", 4, 2, "E");
    });

    it("returns an undirected graph", function() {
      assert.isFalse(g.asUndirected().isDirected());
    });

    it("has the same nodes", function() {
      assert.deepEqual(g.asUndirected().nodes().sort(), [1, 2, 3, 4]);
    });

    it("has the same size", function() {
      assert.equal(g.asUndirected().size(), 5);
    });

    it("preserves edge ids", function() {
      var ug = g.asUndirected();
      assert.deepEqual(ug.incidentNodes("A").sort(), [1, 2]);
      assert.deepEqual(ug.incidentNodes("B").sort(), [2, 3]);
      assert.deepEqual(ug.incidentNodes("C").sort(), [3, 4]);
      assert.deepEqual(ug.incidentNodes("D").sort(), [1, 4]);
      assert.deepEqual(ug.incidentNodes("E").sort(), [2, 4]);
    });

    it("preserves edge labels", function() {
      var ug = g.asUndirected();
      assert.equal(ug.edge(ug.incidentEdges(1, 2)[0]), "A");
      assert.equal(ug.edge(ug.incidentEdges(2, 3)[0]), "B");
      assert.equal(ug.edge(ug.incidentEdges(3, 4)[0]), "C");
      assert.equal(ug.edge(ug.incidentEdges(4, 1)[0]), "D");
      assert.equal(ug.edge(ug.incidentEdges(4, 2)[0]), "E");
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

  describe("isDirected", function() {
    it("always returns true", function() {
      assert.isTrue(new Digraph().isDirected());
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
      assert.deepEqual(g.incidentNodes(3), [1, 2]);
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

      var e1 = g.addEdge(null, 1, 2);
      assert.isDefined(e1);
      assert.isTrue(g.hasEdge(e1));

      var e2 = g.addEdge(null, 2, 3);
      assert.isDefined(e2);
      assert.isTrue(g.hasEdge(e2));

      assert.sameMembers(g.successors(1), [2]);
      assert.sameMembers(g.successors(2), [3]);
    });

    it("assigns an arbitrary edge id if the given id is undefined", function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);

      var e1 = g.addEdge(undefined, 1, 2);
      assert.isDefined(e1);
      assert.isTrue(g.hasEdge(e1));

      var e2 = g.addEdge(undefined, 2, 3);
      assert.isDefined(e2);
      assert.isTrue(g.hasEdge(e2));

      assert.sameMembers(g.successors(1), [2]);
      assert.sameMembers(g.successors(2), [3]);
    });

    it("avoids id collisions when given id is null", function() {
      g.addNode(1);
      g.addNode(2);

      // We use this assert in case the internal id scheme changes...
      assert.equal(g.addEdge(null, 1, 2), "_1");

      // This would be the next id assigned by the graph
      g.addEdge("_2", 1, 2);

      assert.equal(g.addEdge(null, 1, 2), "_3");
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

var _ = require("lodash"),
    expect = require("./chai").expect,
    Graph = require("..").Graph;

describe("Graph", function() {
  var g;

  beforeEach(function() {
    g = new Graph();
  });

  describe("initial state", function() {
    it("has no nodes", function() {
      expect(g.nodeCount()).to.equal(0);
    });

    it("has no edges", function() {
      expect(g.edgeCount()).to.equal(0);
    });

    it("has no attributes", function() {
      expect(g.attrs).to.eql({});
    });
  });

  describe("node", function() {
    it("creates the node if it isn't part of the graph", function() {
      g.node("a");
      expect(g.hasNode("a")).to.be.true;
      expect(g.node("a")).to.eql({});
      expect(g.nodeCount()).to.equal(1);
    });

    it("is idempotent", function() {
      expect(g.node("a")).to.equal(g.node("a"));
      expect(g.nodeCount()).to.equal(1);
    });

    it("creates the node with default attributes, if set", function() {
      g.nodeAttrDefs.foo = 1;
      expect(g.node("a").foo).to.equal(1);
    });

    it("uses the stringified form of the id", function() {
      expect(g.node("1")).to.equal(g.node(1));
    });
  });

  describe("nodes", function() {
    it("is empty if there are no nodes in the graph", function() {
      expect(g.nodes()).to.eql([]);
    });

    it("returns the ids of nodes in the graph", function() {
      g.node("a");
      g.node("b");
      expect(_.sortBy(g.nodes())).to.eql(["a", "b"]);
    });
  });

  describe.only("edge", function() {
    it("creates the edge if it isn't part of the graph", function() {
      g.node("a");
      g.node("b");
      var ab = g.edge("a", "b");
      expect(ab).to.eql({});
      expect(g.hasEdge("a", "b")).to.be.true;
      expect(g.edge("a", "b")).to.eql(ab);
      expect(g.edgeCount()).to.equal(1);
    });

    it("creates the nodes for the edge if they are not part of the graph", function() {
      g.edge("a", "b");
      expect(g.hasNode("a")).to.be.true;
      expect(g.hasNode("b")).to.be.true;
      expect(g.nodeCount()).to.equal(2);
    });

    it("is idempotent", function() {
      expect(g.edge("a", "b")).to.equal(g.edge("a", "b"));
      expect(g.edgeCount()).to.equal(1);
    });

    it("creates the node with default attributes, if set", function() {
      g.edgeAttrDefs.foo = 1;
      expect(g.edge("a", "b").foo).to.equal(1);
    });

    it("uses the stringified form of the id", function() {
      expect(g.edge("1", "2")).to.equal(g.edge(1, 2));
    });

    it("treats edges in opposite directions as distinct in a digraph", function() {
      expect(g.edge("a", "b")).to.not.equal(g.edge("b", "a"));
    });

    it("doesn't create multi-edges in a simple graph", function() {
      g.edge("a", "b", "foo");
      expect(g.hasEdge("a", "b", "foo")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("allows multi-edges to be created in a multigraph", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b", "foo");
      g.edge("a", "b", "bar");
      expect(g.hasEdge("a", "b", "foo")).to.be.true;
      expect(g.hasEdge("a", "b", "bar")).to.be.true;
      expect(g.edgeCount()).to.equal(2);
    });
  });

  describe("edgeKey", function() {
    it("returns a key that can be used to uniquely identify an edge", function() {
      var ab = g.edge("a", "b"),
          abKey = g.edgeKey("a", "b");
      expect(g.edge(abKey)).to.equal(ab);
      expect(g.hasEdge(abKey)).to.be.true;
    });
  });

  describe("edges", function() {
    it("is empty if there are no edges in the graph", function() {
      expect(g.edges()).to.eql([]);
    });

    it("returns the keys for edges in the graph", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(_.sortBy(g.edges()))
        .to.eql(_.sortBy([ g.edgeKey("a", "b"), g.edgeKey("b", "c") ]));
    });
  });

  describe("successors", function() {
    it("returns the successors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      expect(_.sortBy(g.successors("n1"))).to.eql(["n1", "n2"]);
    });
  });

  describe("predecessors", function() {
    it("returns the predecessors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      expect(_.sortBy(g.predecessors("n1"))).to.eql(["n1", "n3"]);
    });
  });

  describe("inEdges", function() {
    it("returns the edges that point at the specified node", function() {
      g.setEdge("n1", "n2", "n1n2");
      g.setEdge("n3", "n2", "n3n2");
      g.setEdge("n3", "n4");
      var edges = sortEdges(g.inEdges("n2"));
      expect(edges).to.eql([{ v: "n1", w: "n2", label: "n1n2" },
                            { v: "n3", w: "n2", label: "n3n2" }]);
    });
  });

  describe("outEdges", function() {
    it("returns the edges that start at the specified node", function() {
      g.setEdge("n1", "n2", "n1n2");
      g.setEdge("n1", "n3", "n1n3");
      g.setEdge("n2", "n3", "n2n3");
      var edges = sortEdges(g.outEdges("n1"));
      expect(edges).to.eql([{ v: "n1", w: "n2", label: "n1n2" },
                            { v: "n1", w: "n3", label: "n1n3" }]);
    });
  });

  describe("hasNode", function() {
    it("returns false if the node is not in the graph", function() {
      expect(g.hasNode("node-not-in-graph")).to.be.false;
    });
  });

  describe("getNode", function() {
    it("returns undefined if the node is not in the graph", function() {
      expect(g.getNode("node-not-in-graph")).to.be.undefined;
    });
  });

  describe("setNodes", function() {
    it("creates the nodes if they are not part of the graph", function() {
      g.setNodes(["a", "b", "c"], "label");
      expect(g.getNode("a")).to.equal("label");
      expect(g.getNode("b")).to.equal("label");
      expect(g.getNode("c")).to.equal("label");
      expect(g.nodeCount()).to.equal(3);
    });

    it("replaces nodes values if the node is in the graph", function() {
      g.setNode("b", "old-label");
      g.setNodes(["a", "b", "c"], "new-label");
      expect(g.getNode("a")).to.equal("new-label");
      expect(g.getNode("b")).to.equal("new-label");
      expect(g.getNode("c")).to.equal("new-label");
    });

    it("does not replace node labels if the label is not specified", function() {
      g.setNode("b", "label");
      g.setNodes(["a", "b", "c"]);
      expect(g.getNode("a")).to.be.undefined;
      expect(g.getNode("b")).to.equal("label");
      expect(g.getNode("c")).to.be.undefined;
    });

    it("is chainable", function() {
      var g2 = g.setNode("key", "label");
      expect(g).to.equal(g2);
    });
  });

  describe("setDefaultNodeLabel", function() {
    it("assigns the default value for created nodes", function() {
      g.setDefaultNodeLabel(1);
      g.setNode("a");
      g.setNode("b");
      expect(g.getNode("a")).to.equal(1);
      expect(g.getNode("b")).to.equal(1);
    });

    it("can use a function to create the default value", function() {
      g.setDefaultNodeLabel(function(v) { return v + "-label"; });
      g.setNode("a");
      g.setNode("b");
      expect(g.getNode("a")).to.equal("a-label");
      expect(g.getNode("b")).to.equal("b-label");
    });

    it("is chainable", function() {
      var g2 = g.setDefaultNodeLabel(function() {});
      expect(g).to.equal(g2);
    });
  });

  describe("removeNode", function() {
    it("does nothing if the node is not part of the graph", function() {
      var removed;
      g._onRemoveNode = function(v) { removed = v; };
      g.removeNode("key");
      expectEmptyGraph(g);
      expect(removed).to.be.undefined;
    });

    it("removes the node if it is part of the graph", function() {
      var removed;
      g._onRemoveNode = function(v) { removed = v; };
      g.setNode("key", "label");
      g.removeNode("key");
      expectEmptyGraph(g);
      expect(removed).to.equal("key");
    });

    it("removes all incident in-edges", function() {
      g.setEdge("n1", "n2");
      g.removeNode("n2");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
      expectSingleNodeGraph(g, "n1", undefined);
    });

    it("removes all incident out-edges", function() {
      g.setEdge("n1", "n2");
      g.removeNode("n1");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
      expectSingleNodeGraph(g, "n2", undefined);
    });

    it("decrements edge count once when deleting a self-loop", function() {
      g.setEdge("n1", "n1");
      g.removeNode("n1");
      expect(g.edgeCount()).to.equal(0);
    });

    it("is chainable", function() {
      var g2 = g.removeNode("key");
      expect(g).to.equal(g2);
    });
  });

  describe("successors", function() {
    it("returns undefined if the node is not in the graph", function() {
      expect(g.successors("node-not-in-graph")).to.be.undefined;
    });
  });

  describe("predecessors", function() {
    it("returns undefined if the node is not in the graph", function() {
      expect(g.predecessors("node-not-in-graph")).to.be.undefined;
    });
  });

  describe("neighbors", function() {
    it("returns the neighbors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      expect(_.sortBy(g.neighbors("n1"))).to.eql(["n1", "n2", "n3"]);
    });

    it("returns undefined if the node is not in the graph", function() {
      expect(g.neighbors("node-not-in-graph")).to.be.undefined;
    });
  });

  describe("inEdges", function() {
    it("returns undefined if the node is not in the graph", function() {
      expect(g.inEdges("node-not-in-graph")).to.be.undefined;
    });

    it("does not allow changes through the returned edge object", function() {
      g.setEdge("n1", "n2", "label");
      var edge = g.inEdges("n2")[0];
      edge.label = "foo";
      expect(g.getEdge("n1", "n2")).to.equal("label");
    });
  });

  describe("outEdges", function() {
    it("returns undefined if the node is not in the graph", function() {
      expect(g.outEdges("node-not-in-graph")).to.be.undefined;
    });

    it("does not allow changes through the returned edge object", function() {
      g.setEdge("n1", "n2", "label");
      var edge = g.outEdges("n1")[0];
      edge.label = "foo";
      expect(g.getEdge("n1", "n2")).to.equal("label");
    });
  });

  describe("nodeEdges", function() {
    it("returns the edges incident on a node", function() {
      g.setEdge("n1", "n1", "l1");
      g.setEdge("n1", "n2", "l2");
      g.setEdge("n2", "n3", "l3");
      g.setEdge("n3", "n1", "l4");

      var result = _.sortBy(g.nodeEdges("n1"), ["v", "w"]);
      expect(result).to.eql([{ v: "n1", w: "n1", label: "l1" },
                             { v: "n1", w: "n2", label: "l2" },
                             { v: "n3", w: "n1", label: "l4" }]);
    });

    it("returns undefined if the node is not in the graph", function() {
      expect(g.nodeEdges("node-not-in-graph")).to.be.undefined;
    });

    it("does not allow changes through the returned edge object", function() {
      g.setEdge("n1", "n2", "label");
      var edge = g.nodeEdges("n1")[0];
      edge.label = "foo";
      expect(g.getEdge("n1", "n2")).to.equal("label");
    });
  });

  describe("setEdge", function() {
    it("creates the edge if it does not exist", function() {
      g.setNode("n1");
      g.setNode("n2");
      g.setEdge("n1", "n2", "label");
      expectSingleEdgeGraph(g, "n1", "n2", "label");
    });

    it("creates the incident nodes if they don't exist", function() {
      g.setEdge("n1", "n2", "label");
      expect(g.hasNode("n1")).to.be.true;
      expect(g.hasNode("n2")).to.be.true;
      expectSingleEdgeGraph(g, "n1", "n2", "label");
    });

    it("replaces the edge's label if the edge is part of the graph", function() {
      g.setEdge("n1", "n2", "old");
      g.setEdge("n1", "n2", "new");
      expectSingleEdgeGraph(g, "n1", "n2", "new");
    });

    it("does not replace an edge label if the label is not specified", function() {
      g.setEdge("n1", "n2", "label");
      g.setEdge("n1", "n2");
      expectSingleEdgeGraph(g, "n1", "n2", "label");
    });

    it("can remove a label by explicitly setting it to undefined", function() {
      g.setEdge("n1", "n2", "label");
      g.setEdge("n1", "n2", undefined);
      expect(g.hasEdge("n1", "n2")).to.be.true;
      expect(g.getEdge("n1", "n2")).to.be.undefined;
    });

    it("coerces the edge's node ids to strings", function() {
      g.setEdge(1, 2);
      expect(g.edges()).to.eql([{ v: "1", w: "2" }]);
    });

    it("preserves the label's type", function() {
      g.setEdge("a", "bool", false);
      g.setEdge("a", "number", 1234);
      g.setEdge("an", "object", { foo: "bar" });

      expect(g.getEdge("a", "bool")).to.be.false;
      expect(g.getEdge("a", "number")).to.equal(1234);
      expect(g.getEdge("an", "object")).to.eql({ foo: "bar" });
    });

    it("is chainable", function() {
      var g2 = g.setEdge("n1", "n2");
      expect(g).to.equal(g2);
    });
  });

  describe("setPath", function() {
    it("creates nodes as needed", function() {
      g.setPath(["a", "b", "c"]);
      expect(g.hasNode("a")).to.be.true;
      expect(g.hasNode("b")).to.be.true;
      expect(g.hasNode("c")).to.be.true;
      expect(g.nodeCount()).to.equal(3);
    });

    it("creates open paths", function() {
      g.setPath(["a", "b", "c"], "label");
      expect(g.hasEdge("a", "b")).to.be.true;
      expect(g.hasEdge("b", "c")).to.be.true;
      expect(g.hasEdge("c", "a")).to.be.false;
    });

    it("sets the labels for the edges in the path", function() {
      g.setPath(["a", "b", "c"], "label");
      expect(g.getEdge("a", "b")).to.equal("label");
      expect(g.getEdge("b", "c")).to.equal("label");
    });

    it("replaces labels for existing edges in the path", function() {
      g.setEdge("a", "b", "label");
      g.setPath(["a", "b", "c"], "new-label");
      expect(g.getEdge("a", "b")).to.equal("new-label");
      expect(g.getEdge("b", "c")).to.equal("new-label");
    });

    it("does not set labels if the label is not specified", function() {
      g.setEdge("a", "b", "label");
      g.setPath(["a", "b", "c"]);
      expect(g.getEdge("a", "b")).to.equal("label");
      expect(g.getEdge("b", "c")).to.be.undefined;
    });

    it("is chainable", function() {
      var g2 = g.setPath(["a", "b", "c"]);
      expect(g).to.equal(g2);
    });
  });

  describe("setDefaultEdgeLabel", function() {
    it("assigns the default value for created edges", function() {
      g.setDefaultEdgeLabel(1);
      g.setEdge("a", "b");
      expect(g.getEdge("a", "b")).to.equal(1);
    });

    it("can use a function to create the default value", function() {
      g.setDefaultEdgeLabel(function(edge) {
        return edge.v + "->" + edge.w;
      });
      g.setEdge("a", "b");
      expect(g.getEdge("a", "b")).to.equal("a->b");
    });

    it("is chainable", function() {
      var g2 = g.setDefaultEdgeLabel(function() {});
      expect(g).to.equal(g2);
    });
  });

  describe("removeEdge", function() {
    it("does nothing if the edge is not in the graph", function() {
      g.setNode("n1");
      g.setNode("n2");
      g.removeEdge("n1", "n2");
      expect(g.edgeCount()).to.equal(0);
      expect(g.nodeCount()).to.equal(2);

      g.removeEdge("n2", "n3");
      expect(g.edgeCount()).to.equal(0);
      expect(g.nodeCount()).to.equal(2);

      g.removeEdge("n3", "n1");
      expect(g.edgeCount()).to.equal(0);
      expect(g.nodeCount()).to.equal(2);
    });

    it("removes the edge if it is in the graph", function() {
      g.setEdge("n1", "n2");
      g.removeEdge("n1", "n2");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("doesn't remove other edges incident on the nodes", function() {
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      g.removeEdge("n1", "n2");
      expect(g.hasEdge("n1", "n2")).to.be.false;
      expect(g.edgeCount()).to.equal(2);
    });

    it("is chainable", function() {
      var g2 = g.removeEdge("n1", "n2");
      expect(g).to.equal(g2);
    });
  });

  describe("copy", function() {
    it("creates a shallow copy of the input graph", function() {
      g.setGraph("foo");
      g.setNode("n1", "label");

      var copy = g.copy();
      expect(copy.constructor).to.equal(g.constructor);
      expect(copy.getGraph()).to.equal(g.getGraph());
      expectSingleNodeGraph(g, "n1", "label");

      copy.setNode("n1", "new-label");
      expect(g.getNode("n1")).to.equal("label");
    });
  });

  describe("filterNodes", function() {
    it("copies all nodes if the predicate is always true", function() {
      g.setGraph("foo");
      g.setNode("n1", "lab1");
      g.setNode("n2", "lab2");
      g.setEdge("n1", "n2", "n1-n2");

      var copy = g.filterNodes(function() { return true; });
      expect(copy.constructor).to.equal(g.constructor);
      expect(copy.getGraph()).to.equal(g.getGraph());
      expect(copy.getNode("n1")).to.equal("lab1");
      expect(copy.getNode("n2")).to.equal("lab2");
      expect(copy.getEdge("n1", "n2")).to.equal("n1-n2");
      expect(copy.nodeCount()).to.equal(2);
      expect(copy.edgeCount()).to.equal(1);
    });

    it("removes nodes and incident edges for filtered-out nodes", function() {
      g.setNode("n1", "lab1");
      g.setNode("n2", "lab2");
      g.setEdge("n1", "n2", "n1-n2");

      var copy = g.filterNodes(function(u) { return u !== "n2"; });
      expectSingleNodeGraph(copy, "n1", "lab1");
      expect(copy.edgeCount()).to.equal(0);
    });

    it("allows filtering by label", function() {
      g.setNode("n1", "lab1");
      g.setNode("n2", "lab2");

      var copy = g.filterNodes(function(_, label) { return label !== "lab2"; });
      expectSingleNodeGraph(copy, "n1", "lab1");
    });

    it("preserves incident edges for preserved nodes", function() {
      g.setNode("n1", "lab1");
      g.setNode("n2", "lab2");
      g.setNode("n3", "lab3");
      g.setEdge("n1", "n2", "n1-n2");
      g.setEdge("n2", "n3", "n2-n3");

      var copy = g.filterNodes(function(v) { return v !== "n3"; });
      expect(copy.edges()).to.have.length(1);
      expect(copy.edges()[0]).to.eql({ v: "n1", w: "n2", label: "n1-n2" });
    });

    it("does not allow changes to the original graph", function() {
      g.setGraph("foo");
      g.setNode("n1", "lab1");

      var copy = g.filterNodes(function() { return true; });
      copy.setNode("n1", "new-lab");
      expect(g.getNode("n1")).to.equal("lab1");
      copy.setGraph("bar");
      expect(g.getGraph()).to.equal("foo");
    });
  });
});

function expectEmptyGraph(g) {
  expect(g.nodeIds()).to.be.empty;
  expect(g.nodeCount()).to.equal(0);
  expect(g.edges()).to.be.empty;
  expect(g.edgeCount()).to.equal(0);
}
exports.expectEmptyGraph = expectEmptyGraph;

function expectSingleNodeGraph(g, key, label) {
  expect(g.getNode(key)).to.equal(label);
  expect(g.hasNode(key)).to.be.true;
  expect(g.nodes()).to.eql([{ v: key, label: label }]);
  expect(g.nodeIds()).to.eql([key]);
  expect(g.nodeCount()).to.equal(1);
}
exports.expectSingleNodeGraph = expectSingleNodeGraph;

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.edges().length).to.equal(1);
  expect(g.edges()[0]).to.eql({ v: v, w: w, label: label });
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.edgeCount()).to.equal(1);
}
exports.expectSingleEdgeGraph = expectSingleEdgeGraph;

function sortEdges(edges) {
  return _.sortBy(edges, function(edge) { return edge.v; });
}

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
      expect(g.graph()).to.eql({});
    });

    it("defaults to a simple directed graph", function() {
      expect(g.isDirected()).to.be.true;
      expect(g.isCompound()).to.be.false;
      expect(g.isMultigraph()).to.be.false;
    });

    it("can be set to undirected", function() {
      var g = new Graph({ directed: false });
      expect(g.isDirected()).to.be.false;
    });

    it("can be set to a compound graph", function() {
      var g = new Graph({ compound: true });
      expect(g.isCompound()).to.be.true;
    });

    it("can be set to a mulitgraph", function() {
      var g = new Graph({ multigraph: true });
      expect(g.isMultigraph()).to.be.true;
    });
  });

  describe("graph", function() {
    it("can be used to get and set properties for the graph", function() {
      g.graph().foo = 1;
      expect(g.graph().foo).to.equal(1);
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

  describe("sources", function() {
    it("returns nodes in the graph that have no in-edges", function() {
      g.path("a", "b", "c");
      g.node("d");
      expect(_.sortBy(g.sources())).to.eql(["a", "d"]);
    });
  });

  describe("sinks", function() {
    it("returns nodes in the graph that have no out-edges", function() {
      g.path("a", "b", "c");
      g.node("d");
      expect(_.sortBy(g.sinks())).to.eql(["c", "d"]);
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
      g.nodeAttrDefs().foo = 1;
      expect(g.node("a").foo).to.equal(1);
    });

    it("uses the stringified form of the id", function() {
      expect(g.node("1")).to.equal(g.node(1));
    });
  });

  describe("removeNode", function() {
    it("does nothing if the node is not in the graph", function() {
      expect(g.nodeCount()).to.equal(0);
      g.removeNode("a");
      expect(g.hasNode("a")).to.be.false;
      expect(g.nodeCount()).to.equal(0);
    });

    it("removes the node if it is in the graph", function() {
      g.node("a");
      g.removeNode("a");
      expect(g.hasNode("a")).to.be.false;
      expect(g.nodeCount()).to.equal(0);
    });

    it("is idempotent", function() {
      g.node("a");
      g.removeNode("a");
      g.removeNode("a");
      expect(g.hasNode("a")).to.be.false;
      expect(g.nodeCount()).to.equal(0);
    });

    it("removes edges incident on the node", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      g.removeNode("b");
      expect(g.edgeCount()).to.equal(0);
    });

    it("removes parent / child relationships for the node", function() {
      var g = new Graph({ compound: true });
      g.setParent("c", "b");
      g.setParent("b", "a");
      g.removeNode("b");
      expect(g.parent("b")).to.be.undefined;
      expect(g.children("b")).to.be.undefined;
      expect(g.children("a")).to.not.include("b");
      expect(g.parent("c")).to.be.undefined;
    });
  });

  describe("setParent", function() {
    beforeEach(function() {
      g = new Graph({ compound: true });
    });

    it("throws if the graph is not compound", function() {
      expect(function() { new Graph().setParent("a", "parent"); }).to.throw();
    });

    it("creates the parent if it does not exist", function() {
      g.node("a");
      g.setParent("a", "parent");
      expect(g.hasNode("parent")).to.be.true;
      expect(g.parent("a")).to.equal("parent");
    });

    it("creates the child if it does not exist", function() {
      g.node("parent");
      g.setParent("a", "parent");
      expect(g.hasNode("a")).to.be.true;
      expect(g.parent("a")).to.equal("parent");
    });

    it("has the parent as undefined if it has never been invoked", function() {
      g.node("a");
      expect(g.parent("a")).to.be.undefined;
    });

    it("moves the node from the previous parent", function() {
      g.setParent("a", "parent");
      g.setParent("a", "parent2");
      expect(g.parent("a")).to.equal("parent2");
      expect(g.children("parent")).to.eql([]);
      expect(g.children("parent2")).to.eql(["a"]);
    });

    it("removes the parent if the parent is undefined", function() {
      g.setParent("a", "parent");
      g.setParent("a", undefined);
      expect(g.parent("a")).to.be.undefined;
      expect(_.sortBy(g.children())).to.eql(["a", "parent"]);
    });

    it("removes the parent if no parent was specified", function() {
      g.setParent("a", "parent");
      g.setParent("a");
      expect(g.parent("a")).to.be.undefined;
      expect(_.sortBy(g.children())).to.eql(["a", "parent"]);
    });

    it("is idempotent to remove a parent", function() {
      g.setParent("a", "parent");
      g.setParent("a");
      g.setParent("a");
      expect(g.parent("a")).to.be.undefined;
      expect(_.sortBy(g.children())).to.eql(["a", "parent"]);
    });

    it("preserves the tree invariant", function() {
      g.setParent("c", "b");
      g.setParent("b", "a");
      expect(function() { g.setParent("a", "c"); }).to.throw();
    });
  });

  describe("parent", function() {
    beforeEach(function() {
      g = new Graph({ compound: true });
    });

    it("returns undefined if the node is not in the graph", function() {
      expect(g.parent("a")).to.be.undefined;
    });

    it("defaults to undefined for new nodes", function() {
      g.node("a");
      expect(g.parent("a")).to.be.undefined;
    });

    it("returns the current parent assignment", function() {
      g.node("a");
      g.node("parent");
      g.setParent("a", "parent");
      expect(g.parent("a")).to.equal("parent");
    });
  });

  describe("children", function() {
    beforeEach(function() {
      g = new Graph({ compound: true });
    });

    it("returns undefined if the node is not in the graph", function() {
      expect(g.children("a")).to.be.undefined;
    });

    it("defaults to en empty list for new nodes", function() {
      g.node("a");
      expect(g.children("a")).to.eql([]);
    });

    it("returns children for the node", function() {
      g.setParent("a", "parent");
      g.setParent("b", "parent");
      expect(_.sortBy(g.children("parent"))).to.eql(["a", "b"]);
    });

    it("returns all nodes without a parent when the parent is not set", function() {
      g.node("a");
      g.node("b");
      g.node("c");
      g.node("parent");
      g.setParent("a", "parent");
      expect(_.sortBy(g.children())).to.eql(["b", "c", "parent"]);
      expect(_.sortBy(g.children(undefined))).to.eql(["b", "c", "parent"]);
    });
  });

  describe("predecessors", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.predecessors("a")).to.be.undefined;
    });

    it("returns the predecessors of a node", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      g.edge("a", "a");
      expect(_.sortBy(g.predecessors("a"))).to.eql(["a"]);
      expect(_.sortBy(g.predecessors("b"))).to.eql(["a"]);
      expect(_.sortBy(g.predecessors("c"))).to.eql(["b"]);
    });
  });

  describe("successors", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.successors("a")).to.be.undefined;
    });

    it("returns the successors of a node", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      g.edge("a", "a");
      expect(_.sortBy(g.successors("a"))).to.eql(["a", "b"]);
      expect(_.sortBy(g.successors("b"))).to.eql(["c"]);
      expect(_.sortBy(g.successors("c"))).to.eql([]);
    });
  });

  describe("neighbors", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.neighbors("a")).to.be.undefined;
    });

    it("returns the neighbors of a node", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      g.edge("a", "a");
      expect(_.sortBy(g.neighbors("a"))).to.eql(["a", "b"]);
      expect(_.sortBy(g.neighbors("b"))).to.eql(["a", "c"]);
      expect(_.sortBy(g.neighbors("c"))).to.eql(["b"]);
    });
  });

  describe("edges", function() {
    it("is empty if there are no edges in the graph", function() {
      expect(g.edges()).to.eql([]);
    });

    it("returns the keys for edges in the graph", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(_.sortBy(g.edges()), ["v", "w"]).to.eql([
        { v: "a", w: "b" },
        { v: "b", w: "c" }
      ]);
    });
  });

  describe("path", function() {
    it("creates a path of mutiple edges", function() {
      g.path("a", "b", "c");
      expect(g.hasEdge("a", "b")).to.be.true;
      expect(g.hasEdge("b", "c")).to.be.true;
    });

    it("returns the segments of the path", function() {
      var segments = g.path("a", "b", "c");
      expect(segments).to.have.length(2);
      expect(segments[0]).to.equal(g.edge("a", "b"));
      expect(segments[1]).to.equal(g.edge("b", "c"));
    });
  });

  describe("edge", function() {
    it("creates the edge if it isn't part of the graph", function() {
      g.node("a");
      g.node("b");
      var ab = g.edge("a", "b");
      expect(ab).to.eql({});
      expect(g.hasEdge("a", "b")).to.be.true;
      expect(g.hasEdge({ v: "a", w: "b" })).to.be.true;
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
      g.edgeAttrDefs().foo = 1;
      expect(g.edge("a", "b").foo).to.equal(1);
    });

    it("uses the stringified form of the id", function() {
      expect(g.edge("1", "2")).to.equal(g.edge(1, 2));
    });

    it("treats edges in opposite directions as distinct in a digraph", function() {
      expect(g.edge("a", "b")).to.not.equal(g.edge("b", "a"));
    });

    it("handles undirected graph edges", function() {
      var g = new Graph({ multigraph: true, directed: false });
      expect(g.edge("a", "b")).to.equal(g.edge("b", "a"));
      expect(g.edge("a", "b", "foo")).to.equal(g.edge("b", "a", "foo"));
      expect(g.edge("a", "b")).to.not.equal(g.edge("b", "a", "foo"));
    });

    it("doesn't create multi-edges in a simple graph", function() {
      g.edge("a", "b", "foo");
      expect(g.hasEdge("a", "b", "foo")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("allows multi-edges to be created in a multigraph #1", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b").value = 0;
      g.edge("a", "b", "foo").value = 1;
      g.edge("a", "b", "bar").value = 2;
      expect(g.edge("a", "b")).to.eql({ value: 0 });
      expect(g.edge("a", "b", "foo")).to.eql({ value: 1 });
      expect(g.edge("a", "b", "bar")).to.eql({ value: 2 });
      expect(g.hasEdge("a", "b")).to.be.true;
      expect(g.hasEdge("a", "b", "foo")).to.be.true;
      expect(g.hasEdge("a", "b", "bar")).to.be.true;
      expect(g.edgeCount()).to.equal(3);
    });

    it("allows multi-edges to be created in a multigraph #2", function() {
      var g = new Graph({ multigraph: true });
      g.edge({ v: "a", w: "b" }).value = 0;
      g.edge({ v: "a", w: "b", name: "foo" }).value = 1;
      g.edge({ v: "a", w: "b", name: "bar" }).value = 2;
      expect(g.edge({ v: "a", w: "b"})).to.eql({ value: 0 });
      expect(g.edge({ v: "a", w: "b", name: "foo" })).to.eql({ value: 1 });
      expect(g.edge({ v: "a", w: "b", name: "bar" })).to.eql({ value: 2 });
      expect(g.hasEdge({ v: "a", w: "b" })).to.be.true;
      expect(g.hasEdge({ v: "a", w: "b", name: "foo" })).to.be.true;
      expect(g.hasEdge({ v: "a", w: "b", name: "bar" })).to.be.true;
      expect(g.edgeCount()).to.equal(3);
    });
  });

  describe("removeEdge", function() {
    it("has no effect if the edge is not in the graph", function() {
      g.removeEdge("a", "b");
      expect(g.hasEdge("a", "b")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("can remove an edge by edgeObj", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b", "foo");
      g.removeEdge({ v: "a", w: "b", name: "foo" });
      expect(g.hasEdge("a", "b", "foo")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("can remove an edge by separate ids", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b", "foo");
      g.removeEdge("a", "b", "foo");
      expect(g.hasEdge("a", "b", "foo")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("correctly removes neighbors", function() {
      g.edge("a", "b");
      g.removeEdge("a", "b");
      expect(g.successors("a")).to.eql([]);
      expect(g.neighbors("a")).to.eql([]);
      expect(g.predecessors("b")).to.eql([]);
      expect(g.neighbors("b")).to.eql([]);
    });

    it("correctly decrements neighbor counts", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "foo");
      g.removeEdge("a", "b");
      expect(g.hasEdge("a", "b", "foo"));
      expect(g.successors("a")).to.eql(["b"]);
      expect(g.neighbors("a")).to.eql(["b"]);
      expect(g.predecessors("b")).to.eql(["a"]);
      expect(g.neighbors("b")).to.eql(["a"]);
    });
  });

  describe("inEdges", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.inEdges("a")).to.be.undefined;
    });

    it("returns the edges that point at the specified node", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(g.inEdges("a")).to.eql([]);
      expect(g.inEdges("b")).to.eql([{ v: "a", w: "b" }]);
      expect(g.inEdges("c")).to.eql([{ v: "b", w: "c" }]);
    });

    it("works for multigraphs", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "bar");
      g.edge("a", "b", "foo");
      expect(g.inEdges("a")).to.eql([]);
      expect(_.sortBy(g.inEdges("b"), "name")).to.eql([
        { v: "a", w: "b", name: "bar" },
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
    });

    it("can return only edges from a specified node", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "foo");
      g.edge("a", "c");
      g.edge("b", "c");
      g.edge("z", "a");
      g.edge("z", "b");
      expect(g.inEdges("a", "b")).to.eql([]);
      expect(_.sortBy(g.inEdges("b", "a"), "name")).to.eql([
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
    });
  });

  describe("outEdges", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.outEdges("a")).to.be.undefined;
    });

    it("returns all edges that this node points at", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(g.outEdges("a")).to.eql([{ v: "a", w: "b" }]);
      expect(g.outEdges("b")).to.eql([{ v: "b", w: "c" }]);
      expect(g.outEdges("c")).to.eql([]);
    });

    it("works for multigraphs", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "bar");
      g.edge("a", "b", "foo");
      expect(_.sortBy(g.outEdges("a"), "name")).to.eql([
        { v: "a", w: "b", name: "bar" },
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
      expect(g.outEdges("b")).to.eql([]);
    });

    it("can return only edges to a specified node", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "foo");
      g.edge("a", "c");
      g.edge("b", "c");
      g.edge("z", "a");
      g.edge("z", "b");
      expect(_.sortBy(g.outEdges("a", "b"), "name")).to.eql([
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
      expect(g.outEdges("b", "a")).to.eql([]);
    });
  });

  describe("nodeEdges", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.nodeEdges("a")).to.be.undefined;
    });

    it("returns all edges that this node points at", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(g.nodeEdges("a")).to.eql([{ v: "a", w: "b" }]);
      expect(_.sortBy(g.nodeEdges("b"), ["v", "w"]))
        .to.eql([{ v: "a", w: "b" }, { v: "b", w: "c" }]);
      expect(g.nodeEdges("c")).to.eql([{ v: "b", w: "c" }]);
    });

    it("works for multigraphs", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "bar");
      g.edge("a", "b", "foo");
      expect(_.sortBy(g.nodeEdges("a"), "name")).to.eql([
        { v: "a", w: "b", name: "bar" },
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
      expect(_.sortBy(g.nodeEdges("b"), "name")).to.eql([
        { v: "a", w: "b", name: "bar" },
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
    });

    it("can return only edges between specific nodes", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b");
      g.edge("a", "b", "foo");
      g.edge("a", "c");
      g.edge("b", "c");
      g.edge("z", "a");
      g.edge("z", "b");
      expect(_.sortBy(g.nodeEdges("a", "b"), "name")).to.eql([
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
      expect(_.sortBy(g.nodeEdges("b", "a"), "name")).to.eql([
        { v: "a", w: "b", name: "foo" },
        { v: "a", w: "b" }
      ]);
    });
  });
});

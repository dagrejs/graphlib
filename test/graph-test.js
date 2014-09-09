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

  describe("allNodes", function() {
    it("is empty if there are no nodes in the graph", function() {
      expect(g.allNodes()).to.eql([]);
    });

    it("returns the ids of nodes in the graph", function() {
      g.node("a");
      g.node("b");
      expect(_.sortBy(g.allNodes())).to.eql(["a", "b"]);
    });
  });

  describe("nodes", function() {
    it("creates the nodes in the list", function() {
      g.nodes("a", "b", "c");
      expect(g.hasNode("a"));
      expect(g.hasNode("b"));
      expect(g.hasNode("c"));
    });

    it("returns the list of nodes", function() {
      var vs = g.nodes("a", "b", "c");
      expect(vs).to.have.length(3);
      expect(vs[0]).to.equal(g.node("a"));
      expect(vs[1]).to.equal(g.node("b"));
      expect(vs[2]).to.equal(g.node("c"));
    });

    it("returns the original node attrs if it already existed", function() {
      var b = g.node("b"),
          vs = g.nodes("a", "b", "c");
      expect(vs[1]).to.equal(b);
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

  describe("allEdges", function() {
    it("is empty if there are no edges in the graph", function() {
      expect(g.allEdges()).to.eql([]);
    });

    it("returns the keys for edges in the graph", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(_.sortBy(g.allEdges()))
        .to.eql(_.sortBy([ g.edgeKey("a", "b"), g.edgeKey("b", "c") ]));
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
      g.edge("a", "b", "foo");
      g.edge("a", "b", "bar");
      expect(g.hasEdge("a", "b", "foo")).to.be.true;
      expect(g.hasEdge("a", "b", "bar")).to.be.true;
      expect(g.edgeCount()).to.equal(2);
    });

    it("allows multi-edges to be created in a multigraph #2", function() {
      var g = new Graph({ multigraph: true });
      g.edge(g.edgeKey("a", "b", "foo"));
      g.edge(g.edgeKey("a", "b", "bar"));
      expect(g.hasEdge("a", "b", "foo")).to.be.true;
      expect(g.hasEdge("a", "b", "bar")).to.be.true;
      expect(g.edgeCount()).to.equal(2);
    });
  });

  describe("removeEdge", function() {
    it("has no effect if the edge is not in the graph", function() {
      g.removeEdge("a", "b");
      expect(g.hasEdge("a", "b")).to.be.false;
      expect(g.edgeCount()).to.equal(0);
    });

    it("can remove an edge by key", function() {
      var g = new Graph({ multigraph: true });
      g.edge("a", "b", "foo");
      g.removeEdge(g.edgeKey("a", "b", "foo"));
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
  });

  describe("edgeKey", function() {
    it("returns a key that can be used to uniquely identify an edge", function() {
      var ab = g.edge("a", "b"),
          abKey = g.edgeKey("a", "b");
      expect(g.edge(abKey)).to.equal(ab);
      expect(g.hasEdge(abKey)).to.be.true;
    });

    it("also generates multi-edge keys", function() {
      var g = new Graph({ multigraph: true }),
          ab = g.edge("a", "b", "foo"),
          abKey = g.edgeKey("a", "b", "foo");
      expect(g.edge(abKey)).to.equal(ab);
      expect(g.hasEdge(abKey)).to.be.true;
    });

    it("can be reversed", function() {
      var e = g.edgeKey("a", "b", "foo");
      expect(g.edgeKeyParts(e)).to.eql({ v: "a", w: "b", name: "foo" });
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
      expect(g.inEdges("b")).to.eql([ g.edgeKey("a", "b") ]);
      expect(g.inEdges("c")).to.eql([ g.edgeKey("b", "c") ]);
    });
  });

  describe("outEdges", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.outEdges("a")).to.be.undefined;
    });

    it("returns all edges that this node points at", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(g.outEdges("a")).to.eql([ g.edgeKey("a", "b") ]);
      expect(g.outEdges("b")).to.eql([ g.edgeKey("b", "c") ]);
      expect(g.outEdges("c")).to.eql([]);
    });
  });

  describe("edges", function() {
    it("returns undefined for a node that is not in the graph", function() {
      expect(g.edges("a")).to.be.undefined;
    });

    it("returns all edges that this node points at", function() {
      g.edge("a", "b");
      g.edge("b", "c");
      expect(g.edges("a")).to.eql([ g.edgeKey("a", "b") ]);
      expect(_.sortBy(g.edges("b")))
        .to.eql(_.sortBy([ g.edgeKey("a", "b"), g.edgeKey("b", "c") ]));
      expect(g.edges("c")).to.eql([ g.edgeKey("b", "c") ]);
    });
  });
});

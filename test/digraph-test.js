var _ = require("lodash"),
    expect = require("./chai").expect,
    baseGraphTest = require("./base-graph-test");

var Digraph = require("..").Digraph;

exports.tests = tests;

tests(Digraph);

function tests(GraphConstructor) {
  describe("Digraph", function() {
    var g;

    beforeEach(function() {
      g = new GraphConstructor();
    });

    // Inject base graph tests
    baseGraphTest.tests(GraphConstructor);

    describe("isDirected", function() {
      it("always returns true", function() {
        expect(g.isDirected()).to.be.true;
      });
    });

    describe("sources", function() {
      it("returns the nodes in the graph with no in edges", function() {
        g.setEdge("n1", "n2");
        g.setEdge("n2", "n3");
        g.setEdge("n4", "n3");
        g.setNode("n5");
        expect(_.sortBy(g.sources())).to.eql(["n1", "n4", "n5"]);
      });

      it("recognizes a new source when in-edges are removed", function() {
        g.setEdge("n1", "n1");
        g.setEdge("n1", "n2");
        expect(g.sources()).to.be.empty;

        g.removeEdge("n1", "n2");
        expect(g.sources()).to.eql(["n2"]);
      });
    });

    describe("sinks", function() {
      it("returns the nodes in the graph with no out edges", function() {
        g.setEdge("n1", "n2");
        g.setEdge("n3", "n2");
        g.setEdge("n3", "n4");
        g.setNode("n5");
        expect(_.sortBy(g.sinks())).to.eql(["n2", "n4", "n5"]);
      });

      it("recognizes a new sink when out-edges are removed", function() {
        g.setEdge("n2", "n2");
        g.setEdge("n1", "n2");
        expect(g.sinks()).to.be.empty;

        g.removeEdge("n1", "n2");
        expect(g.sinks()).to.eql(["n1"]);
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

    describe("copy", function() {
      it("creates a shallow copy of the input graph", function() {
        g.setNode("n1", "label");
        g.setEdge("n2", "n3", "n2n3");

        var copy = g.copy();
        expect(copy.nodeCount()).to.equal(3);
        expect(copy.getNode("n1")).to.equal(g.getNode("n1"));
        expectSingleEdgeGraph(copy, "n2", "n3", "n2n3");

        copy.setEdge("n2", "n3", "new-n2n3");
        expect(g.getEdge("n2", "n3")).to.equal("n2n3");
      });

      it("copies a single node graph", function() {
        g.setNode("n1", "label");

        var copy = g.copy();
        baseGraphTest.expectSingleNodeGraph(g, "n1", "label");

        copy.setNode("n1", "new-label");
        expect(g.getNode("n1")).to.equal("label");
      });
    });
  });
}

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.edges()).to.eql([{ v: v, w: w, label: label }]);
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.edgeCount()).to.equal(1);
  if (v !== w) {
    expect(g.sources()).to.include(v);
    expect(g.sources()).to.not.include(w);
    expect(g.sinks()).to.include(w);
    expect(g.sinks()).to.not.include(v);
  }
}

function sortEdges(edges) {
  return _.sortBy(edges, function(edge) { return edge.v; });
}

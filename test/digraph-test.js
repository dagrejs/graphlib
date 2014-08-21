var expect = require("./chai").expect,
    baseGraphTest = require("./base-graph-test");

var Digraph = require("..").Digraph;

describe("Digraph", function() {
  var g;

  beforeEach(function() {
    g = new Digraph();
  });

  // Inject base graph tests
  baseGraphTest.tests(Digraph);

  describe("graphSources", function() {
    it("returns the nodes in the graph with no in edges", function() {
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n4", "n3");
      g.set("n5");
      expect(g.graphSources().sort()).to.eql(["n1", "n4", "n5"]);
    });

    it("recognizes a new source when in-edges are removed", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      expect(g.graphSources()).to.be.empty;

      g.removeEdge("n1", "n2");
      expect(g.graphSources()).to.eql(["n2"]);
    });
  });

  describe("graphSinks", function() {
    it("returns the nodes in the graph with no out edges", function() {
      g.setEdge("n1", "n2");
      g.setEdge("n3", "n2");
      g.setEdge("n3", "n4");
      g.set("n5");
      expect(g.graphSinks().sort()).to.eql(["n2", "n4", "n5"]);
    });

    it("recognizes a new sink when out-edges are removed", function() {
      g.setEdge("n2", "n2");
      g.setEdge("n1", "n2");
      expect(g.graphSinks()).to.be.empty;

      g.removeEdge("n1", "n2");
      expect(g.graphSinks()).to.eql(["n1"]);
    });
  });

  describe("successors", function() {
    it("returns the successors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      expect(g.successors("n1").sort()).to.eql(["n1", "n2"]);
    });
  });

  describe("predecessors", function() {
    it("returns the predecessors of a node", function() {
      g.setEdge("n1", "n1");
      g.setEdge("n1", "n2");
      g.setEdge("n2", "n3");
      g.setEdge("n3", "n1");
      expect(g.predecessors("n1").sort()).to.eql(["n1", "n3"]);
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
      g.set("n1", "label");
      g.setEdge("n2", "n3", "n2n3");

      var copy = g.copy();
      expect(copy.graphNodeCount).to.equal(3);
      expect(copy.get("n1")).to.equal(g.get("n1"));
      expectSingleEdgeGraph(copy, "n2", "n3", "n2n3");

      copy.setEdge("n2", "n3", "new-n2n3");
      expect(g.getEdge("n2", "n3")).to.equal("n2n3");
    });

    it("copies a single node graph", function() {
      g.set("n1", "label");

      var copy = g.copy();
      baseGraphTest.expectSingleNodeGraph(g, "n1", "label");

      copy.set("n1", "new-label");
      expect(g.get("n1")).to.equal("label");
    });
  });
});

function expectSingleEdgeGraph(g, v, w, label) {
  expect(g.graphEdges()).to.eql([{ v: v, w: w, label: label }]);
  expect(g.getEdge(v, w)).to.equal(label);
  expect(g.hasEdge(v, w)).to.be.true;
  expect(g.graphEdgeCount).to.equal(1);
  if (v !== w) {
    expect(g.graphSources()).to.include(v);
    expect(g.graphSources()).to.not.include(w);
    expect(g.graphSinks()).to.include(w);
    expect(g.graphSinks()).to.not.include(v);
  }
}

function sortEdges(edges) {
  return edges.sort(function(e1, e2) {
    if (e1.v < e2.v) return -1;
    if (e1.v > e2.v) return 1;
    return 0;
  });
}

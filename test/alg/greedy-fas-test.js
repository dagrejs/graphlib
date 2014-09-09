var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    greedyFAS = require("../..").alg.greedyFAS,
    findCycles = require("../..").alg.findCycles;

describe("alg.greedyFAS", function() {
  var g;

  beforeEach(function() {
    g = new Graph();
  });

  it("returns the empty set for empty graphs", function() {
    expect(greedyFAS(g)).to.eql([]);
  });

  it("returns the empty set for single-node graphs", function() {
    g.node("a");
    expect(greedyFAS(g)).to.eql([]);
  });

  it("returns an empty set if the input graph is acyclic", function() {
    var g = new Graph();
    g.edge("a", "b");
    g.edge("b", "c");
    g.edge("b", "d");
    g.edge("a", "e");
    expect(greedyFAS(g)).to.eql([]);
  });

  it("returns a single edge with a simple cycle", function() {
    var g = new Graph();
    g.edge("a", "b");
    g.edge("b", "a");
    checkFAS(g, greedyFAS(g));
  });

  it("returns a single edge in a 4-node cycle", function() {
    var g = new Graph();
    g.edge("n1", "n2");
    g.path("n2", "n3", "n4", "n5", "n2");
    g.edge("n3", "n5");
    g.edge("n4", "n2");
    g.edge("n4", "n6");
    checkFAS(g, greedyFAS(g));
  });

  it("returns two edges for two 4-node cycles", function() {
    var g = new Graph();
    g.edge("n1", "n2");
    g.path("n2", "n3", "n4", "n5", "n2");
    g.edge("n3", "n5");
    g.edge("n4", "n2");
    g.edge("n4", "n6");
    g.path("n6", "n7", "n8", "n9", "n6");
    g.edge("n7", "n9");
    g.edge("n8", "n6");
    g.edge("n8", "n10");
    checkFAS(g, greedyFAS(g));
  });

  it("works with arbitrarily weighted edges", function() {
    // Our algorithm should also work for graphs with multi-edges, a graph
    // where more than one edge can be pointing in the same direction between
    // the same pair of incident nodes. We try this by assigning weights to
    // our edges representing the number of edges from one node to the other.

    var g1 = new Graph();
    g1.edge("n1", "n2").weight = 2;
    g1.edge("n2", "n1").weight = 1;
    expect(greedyFAS(g1, weightFn(g1))).to.eql([{v: "n2", w: "n1"}]);

    var g2 = new Graph();
    g2.edge("n1", "n2").weight = 1;
    g2.edge("n2", "n1").weight = 2;
    expect(greedyFAS(g2, weightFn(g2))).to.eql([{v: "n1", w: "n2"}]);
  });
});

function checkFAS(g, fas) {
  var n = g.nodeCount(),
      m = g.edgeCount();
  _.each(fas, function(edge) {
    g.removeEdge(edge.v, edge.w);
  });
  expect(findCycles(g)).to.eql([]);
  // The more direct m/2 - n/6 fails for the simple cycle A <-> B, where one
  // edge must be reversed, but the performance bound implies that only 2/3rds
  // of an edge can be reversed. I'm using floors to acount for this.
  expect(fas.length).to.be.lte(Math.floor(m/2) - Math.floor(n/6));
}

function weightFn(g) {
  return function(edge) {
    return g.edge(edge).weight;
  };
}

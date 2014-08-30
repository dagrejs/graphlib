var _ = require("lodash"),
    expect = require("../chai").expect,
    Digraph = require("../..").Digraph,
    greedyFAS = require("../..").alg.greedyFAS,
    findCycles = require("../..").alg.findCycles,
    util = require("../../lib/util");

describe("alg.greedyFAS", function() {
  it("returns the empty set for empty and single-node graphs", function() {
    expect(greedyFAS(new Digraph())).to.eql([]);
    expect(greedyFAS(new Digraph().setNode("n1"))).to.eql([]);
  });

  it("returns an empty set if the input graph is acyclic", function() {
    var g = new Digraph();
    g.setEdge("n1", "n2");
    g.setEdge("n2", "n3");
    g.setEdge("n2", "n4");
    g.setEdge("n1", "n5");
    expect(greedyFAS(g)).to.eql([]);
  });

  it("returns a single edge with a simple cycle", function() {
    var g = new Digraph();
    g.setEdge("n1", "n2");
    g.setEdge("n2", "n1");
    checkFAS(g, greedyFAS(g));
  });

  it("returns a single edge in a 4-node cycle", function() {
    var g = new Digraph();
    g.setEdge("n1", "n2");
    g.setPath(["n2", "n3", "n4", "n5", "n2"]);
    g.setEdge("n3", "n5");
    g.setEdge("n4", "n2");
    g.setEdge("n4", "n6");
    checkFAS(g, greedyFAS(g));
  });

  it("returns two edges for two 4-node cycles", function() {
    var g = new Digraph();
    g.setEdge("n1", "n2");
    g.setPath(["n2", "n3", "n4", "n5", "n2"]);
    g.setEdge("n3", "n5");
    g.setEdge("n4", "n2");
    g.setEdge("n4", "n6");
    g.setPath(["n6", "n7", "n8", "n9", "n6"]);
    g.setEdge("n7", "n9");
    g.setEdge("n8", "n6");
    g.setEdge("n8", "n10");
    checkFAS(g, greedyFAS(g));
  });

  it("works with arbitrarily weighted edges", function() {
    // Our algorithm should also work for graphs with multi-edges, a graph
    // where more than one edge can be pointing in the same direction between
    // the same pair of incident nodes. We try this by assigning weights to
    // our edges representing the number of edges from one node to the other.

    var g1 = new Digraph();
    g1.setEdge("n1", "n2", 2);
    g1.setEdge("n2", "n1", 1);
    expect(greedyFAS(g1, util.LABEL_WEIGHT_FUNC)).to.eql([{v: "n2", w: "n1"}]);

    var g2 = new Digraph();
    g2.setEdge("n1", "n2", 1);
    g2.setEdge("n2", "n1", 2);
    expect(greedyFAS(g2, util.LABEL_WEIGHT_FUNC)).to.eql([{v: "n1", w: "n2"}]);
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

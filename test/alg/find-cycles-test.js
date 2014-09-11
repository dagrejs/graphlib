var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    findCycles = require("../..").alg.findCycles;

describe("alg.findCycles", function() {
  it("returns an empty array for an empty graph", function() {
    expect(findCycles(new Graph())).to.eql([]);
  });

  it("returns an empty array if the graph has no cycles", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c"]);
    expect(findCycles(g)).to.eql([]);
  });

  it("returns a single entry for a cycle of 1 edge", function() {
    var g = new Graph();
    g.setPath(["a", "b", "a"]);
    expect(sort(findCycles(g))).to.eql([["a", "b"]]);
  });

  it("returns a single entry for a triangle", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c", "a"]);
    expect(sort(findCycles(g))).to.eql([["a", "b", "c"]]);
  });

  it("returns multiple entries for multiple cycles", function() {
    var g = new Graph();
    g.setPath(["a", "b", "a"]);
    g.setPath(["c", "d", "e", "c"]);
    g.setNode("f");
    expect(sort(findCycles(g))).to.eql([["a", "b"], ["c", "d", "e"]]);
  });
});

// A helper that sorts components and their contents
function sort(cmpts) {
  return _.sortBy(_.map(cmpts, function(cmpt) {
    return _.sortBy(cmpt);
  }), function(cmpts) { return cmpts[0]; });
}

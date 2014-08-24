var expect = require("../chai").expect,
    Digraph = require("../..").Digraph,
    Graph = require("../..").Graph,
    isAcyclic = require("../..").alg.isAcyclic;

describe("alg.isAcylic", function() {
  it("returns true if the graph has no cycles", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "c"]);
    expect(isAcyclic(g)).to.be.true;
  });

  it("returns false if the graph has at least one cycle", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "c", "a"]);
    expect(isAcyclic(g)).to.be.false;
  });

  it("returns false for an undirected graph with at least one edge", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    expect(isAcyclic(g)).to.be.false;
  });

  it("returns true for an undirected graph with no edges", function() {
    var g = new Graph();
    g.setNodes(["a", "b", "c"]);
    expect(isAcyclic(g)).to.be.true;
  });

  it("rethrows non-CycleException errors", function() {
    expect(function() { isAcyclic(undefined); }).to.throw();
  });
});

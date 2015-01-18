var expect = require("../chai").expect,
    Graph = require("../..").Graph,
    isAcyclic = require("../..").alg.isAcyclic;

describe("alg.isAcyclic", function() {
  it("returns true if the graph has no cycles", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c"]);
    expect(isAcyclic(g)).to.be.true;
  });

  it("returns false if the graph has at least one cycle", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c", "a"]);
    expect(isAcyclic(g)).to.be.false;
  });

  it("returns false if the graph has a cycle of 1 node", function() {
    var g = new Graph();
    g.setPath(["a", "a"]);
    expect(isAcyclic(g)).to.be.false;
  });

  it("rethrows non-CycleException errors", function() {
    expect(function() { isAcyclic(undefined); }).to.throw();
  });
});

var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    preorder = require("../..").alg.preorder;

describe("alg.preorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.node("a");
    expect(preorder(g, "a")).to.eql(["a"]);
  });

  it("visits each node in the graph once", function() {
    var g = new Graph();
    g.path("a", "b", "d", "e");
    g.path("a", "c", "d", "e");

    var nodes = preorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
  });

  it("works for a tree", function() {
    var g = new Graph();
    g.edge("a", "b");
    g.path("a", "c", "d");
    g.edge("c", "e");

    var nodes = preorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.gt(nodes.indexOf("c"));
    expect(nodes.indexOf("e")).to.be.gt(nodes.indexOf("c"));
  });

  it("works for an array of roots", function() {
    var g = new Graph();
    g.edge("a", "b");
    g.edge("c", "d");
    g.node("e");
    g.node("f");

    var nodes = preorder(g, ["a", "c", "e"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.gt(nodes.indexOf("c"));
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.node("a");
    expect(function() { preorder(g, "b"); }).to.throw();
  });
});

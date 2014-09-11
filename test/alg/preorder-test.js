var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    preorder = require("../..").alg.preorder;

describe("alg.preorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(preorder(g, "a")).to.eql(["a"]);
  });

  it("visits each node in the graph once", function() {
    var g = new Graph();
    g.setPath(["a", "b", "d", "e"]);
    g.setPath(["a", "c", "d", "e"]);

    var nodes = preorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
  });

  it("works for a tree", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var nodes = preorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.gt(nodes.indexOf("c"));
    expect(nodes.indexOf("e")).to.be.gt(nodes.indexOf("c"));
  });

  it("works for an array of roots", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setEdge("c", "d");
    g.setNode("e");
    g.setNode("f");

    var nodes = preorder(g, ["a", "c", "e"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.gt(nodes.indexOf("c"));
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(function() { preorder(g, "b"); }).to.throw();
  });
});

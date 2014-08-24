var expect = require("../chai").expect,
    Graph = require("../..").Graph,
    Digraph = require("../..").Digraph,
    preorder = require("../..").alg.preorder;

describe("alg.preorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(preorder(g, "a")).to.eql(["a"]);
  });

  it("works for an undirected tree", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var result = preorder(g, "a");
    expect(result.sort()).to.eql(["a", "b", "c", "d", "e"]);
    expect(result.indexOf("a")).to.be.lt(result.indexOf("b"));
    expect(result.indexOf("a")).to.be.lt(result.indexOf("c"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("d"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("e"));
  });

  it("fails for an undirected graph that is not a tree", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c", "a"]);

    expect(function() { preorder(g, "a"); }).to.throw();
  });

  it("works for a directed tree", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var result = preorder(g, "a");
    expect(result.sort()).to.eql(["a", "b", "c", "d", "e"]);
    expect(result.indexOf("a")).to.be.lt(result.indexOf("b"));
    expect(result.indexOf("a")).to.be.lt(result.indexOf("c"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("d"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("e"));
  });

  it("fails for a directed graph that is not a tree", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "a"]);
    expect(function() { preorder(g, "a"); }).to.throw();
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(function() { preorder(g, "b"); }).to.throw();
  });
});

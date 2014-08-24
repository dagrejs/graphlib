var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    Digraph = require("../..").Digraph,
    postorder = require("../..").alg.postorder;

describe("alg.postorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(postorder(g, "a")).to.eql(["a"]);
  });

  it("works for an undirected tree", function() {
    var g = new Graph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var result = postorder(g, "a");
    expect(_.sortBy(result)).to.eql(["a", "b", "c", "d", "e"]);
    expect(result.indexOf("b")).to.be.lt(result.indexOf("a"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("a"));
    expect(result.indexOf("d")).to.be.lt(result.indexOf("c"));
    expect(result.indexOf("e")).to.be.lt(result.indexOf("c"));
  });

  it("fails for an undirected graph that is not a tree", function() {
    var g = new Graph();
    g.setPath(["a", "b", "c", "a"]);

    expect(function() { postorder(g, "a"); }).to.throw();
  });

  it("works for a directed tree", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setEdge("c", "e");

    var result = postorder(g, "a");
    expect(_.sortBy(result)).to.eql(["a", "b", "c", "d", "e"]);
    expect(result.indexOf("b")).to.be.lt(result.indexOf("a"));
    expect(result.indexOf("c")).to.be.lt(result.indexOf("a"));
    expect(result.indexOf("d")).to.be.lt(result.indexOf("c"));
    expect(result.indexOf("e")).to.be.lt(result.indexOf("c"));
  });

  it("fails for a directed graph that is not a tree", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "a"]);
    expect(function() { postorder(g, "a"); }).to.throw();
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(function() { postorder(g, "b"); }).to.throw();
  });
});

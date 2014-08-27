var _ = require("lodash"),
    expect = require("../chai").expect,
    Graph = require("../..").Graph,
    Digraph = require("../..").Digraph,
    CDigraph = require("../..").CDigraph,
    preorder = require("../..").alg.preorder;

describe("alg.preorder", function() {
  it("returns the root for a singleton graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(preorder(g, "a")).to.eql(["a"]);
  });

  it("visits each node in the graph once", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "d", "e"]);
    g.setPath(["a", "c", "d", "e"]);

    var nodes = preorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
  });

  it("works for an undirected tree", function() {
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

  it("works for a directed tree", function() {
    var g = new Digraph();
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

  it("works for a directed diamond", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "d"]);
    g.setPath(["a", "c", "d"]);

    var nodes = preorder(g, "a");
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("c")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.gt(
        Math.min(nodes.indexOf("b"), nodes.indexOf("c")));
    expect(Math.max(nodes.indexOf("b"), nodes.indexOf("c"))).to.be.gt(
        nodes.indexOf("d"));
  });

  it("works for an array of roots", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setEdge("c", "d");
    g.setNode("e");
    g.setNode("f");

    var nodes = preorder(g, ["a", "c", "e"]);
    expect(_.sortBy(nodes)).to.eql(["a", "b", "c", "d", "e"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("d")).to.be.gt(nodes.indexOf("c"));
  });

  it("finishes early if the callback returns false", function() {
    var g = new Digraph();
    g.setPath(["a", "b", "c", "d"]);

    var nodes = preorder(g, "a", function(v) {
      return v !== "c";
    });

    expect(_.sortBy(nodes)).to.eql(["a", "b"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
  });

  it("ends the branch if callback returns null", function() {
    var g = new Digraph();
    g.setEdge("a", "b");
    g.setPath(["a", "c", "d"]);
    g.setPath(["a", "f", "e"]);

    var nodes = preorder(g, "a", function(v) {
      return v !== "c" || null;
    });

    expect(_.sortBy(nodes)).to.eql(["a", "b", "e", "f"]);
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("f")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("e")).to.be.gt(nodes.indexOf("f"));
  });

  it("uses a supplied successors function", function() {
    var g = new CDigraph();
    g.setParent("a", "root");
    g.setParent("a1", "a");
    g.setParent("a2", "a");
    g.setParent("b", "root");

    var nodes = preorder(g, "root", undefined, g.getChildren.bind(g));
    expect(_.sortBy(nodes)).to.eql(["a", "a1", "a2", "b", "root"]);
    expect(nodes.indexOf("a")).to.be.gt(nodes.indexOf("root"));
    expect(nodes.indexOf("a1")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("a2")).to.be.gt(nodes.indexOf("a"));
    expect(nodes.indexOf("b")).to.be.gt(nodes.indexOf("root"));
  });

  it("fails if root is not in the graph", function() {
    var g = new Graph();
    g.setNode("a");
    expect(function() { preorder(g, "b"); }).to.throw();
  });
});
